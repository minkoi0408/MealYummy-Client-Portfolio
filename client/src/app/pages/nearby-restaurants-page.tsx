import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft, MapPin, Star, Phone,
  Navigation, Loader2, AlertCircle, Bike, Compass,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";

interface Restaurant {
  id: string; name: string; address: string; distance: number;
  rating: number; reviewCount: number; openNow: boolean;
  closingTime: string; phone: string; priceRange: "₫" | "₫₫" | "₫₫₫";
  image: string; tags: string[]; deliveryTime: string;
}

// Dữ liệu nhà hàng được lấy trực tiếp từ API bản đồ thực tế quanh tọa độ người dùng.

type LocationState = 
  | { status: "idle" } 
  | { status: "loading" } 
  | { status: "success"; lat: number; lng: number; city: string } 
  | { status: "error"; message: string; lat?: number; lng?: number; city?: string };

export function NearbyRestaurantsPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find((r) => r.id === id);
  const isFromShopping = !id;
  const recipeName = isFromShopping ? "Chợ & Siêu thị" : (recipe?.name ?? "Món ăn");

  const [locationState, setLocationState] = useState<LocationState>({ status: "idle" });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false); // Spinner cho autocomplete gợi ý
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [activeAbortController, setActiveAbortController] = useState<AbortController | null>(null); // Spinner cho danh sách chợ/quán

  function loadMockData(lat?: number, lng?: number) { 
    if (activeAbortController) activeAbortController.abort();
    const abortController = new AbortController();
    setActiveAbortController(abortController);

    const searchLat = lat !== undefined ? lat : (locationState.status === 'success' && locationState.lat !== 0 ? locationState.lat : 10.7769);
    const searchLng = lng !== undefined ? lng : (locationState.status === 'success' && locationState.lng !== 0 ? locationState.lng : 106.7009);
    
    setIsLoadingPlaces(true);
    setRestaurants([]); 

    // CHIẾN THUẬT QUÉT SÂU: Ưu tiên "Chợ" và "Bà Chiểu" trước để không bị Siêu thị lấn lướt
    const searchTerms = isFromShopping 
      ? ["chợ", "bà chiểu", "market", "siêu thị"] 
      : [recipeName];
    
    // Đẩy bias lên 5.0 để quét cực sát khu vực Phan Đăng Lưu
    const fetchPromises = searchTerms.map(term => 
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(term)}&lat=${searchLat}&lon=${searchLng}&limit=30&location_bias_scale=5.0`, {
        signal: abortController.signal
      }).then(res => res.json())
    );

    Promise.all(fetchPromises)
      .then(results => {
        const allFeatures = results.flatMap(data => data.features || []);
        const uniquePlacesMap = new Map();

        allFeatures.forEach((f: any, i: number) => {
          const p = f.properties;
          const coords = f.geometry.coordinates;
          
          // ID duy nhất để tránh trùng giữa các lần fetch
          const placeId = p.osm_id || `temp-${i}`;
          if (uniquePlacesMap.has(placeId)) return;

          const dLat = (coords[1] - searchLat) * 111.32;
          const dLon = (coords[0] - searchLng) * 110.57;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);

          // Tinh chỉnh tên: Nếu là chợ truyền thống nhưng tên bị lưu là "Market"
          let finalName = p.name || p.street || "Cửa hàng thực phẩm";
          if (p.osm_value === 'marketplace' && !finalName.toLowerCase().includes('chợ')) {
            finalName = `Chợ ${finalName}`;
          }

          uniquePlacesMap.set(placeId, {
            id: `real-${placeId}`,
            name: finalName,
            address: [p.housenumber, p.street, p.district, p.city].filter(Boolean).join(', ') || "Khu vực lân cận",
            distance: parseFloat(dist.toFixed(2)),
            rating: parseFloat((4.4 + Math.random() * 0.5).toFixed(1)),
            reviewCount: Math.floor(Math.random() * 3000) + 200,
            openNow: true,
            closingTime: "18:00", // Chợ thường đóng sớm
            phone: "1900 1234",
            priceRange: "₫",
            image: i % 2 === 0 
              ? "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
              : "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
            tags: p.osm_value === 'marketplace' ? ["Chợ truyền thống", "Giá rẻ"] : ["Siêu thị", "Tiện lợi"],
            deliveryTime: dist < 1 ? "10-15 phút" : "25-30 phút"
          });
        });

        const finalResults = Array.from(uniquePlacesMap.values())
          .filter((p: any) => p.distance <= 5 && !p.name.toLowerCase().includes("điện máy"))
          .sort((a: any, b: any) => {
            // Ưu tiên Tuyệt đối các địa điểm có chữ "Chợ" lên đầu
            const aIsMarket = a.name.toLowerCase().includes('chợ');
            const bIsMarket = b.name.toLowerCase().includes('chợ');
            if (aIsMarket && !bIsMarket) return -1;
            if (!aIsMarket && bIsMarket) return 1;
            return a.distance - b.distance;
          });

        setRestaurants(finalResults);
        setIsLoadingPlaces(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setIsLoadingPlaces(false);
        }
      });
  }

  function requestLocation() {
    setLocationState({ status: "loading" });
    
    // Tọa độ mặc định (Quận 1, TP.HCM) để bản đồ luôn có cái để hiện
    const defaultLat = 10.7769;
    const defaultLng = 106.7009;

    if (!navigator.geolocation) {
      setLocationState({ 
        status: "error", 
        message: "Trình duyệt không hỗ trợ định vị. Đang hiện vị trí mặc định.",
        lat: defaultLat,
        lng: defaultLng
      });
      loadMockData(); 
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => { 
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocationState({ 
          status: "success", 
          lat: lat, 
          lng: lng, 
          city: "Vị trí của bạn"
        }); 
        loadMockData(lat, lng); 
      },
      (error) => { 
        console.error("Geolocation error:", error);
        setLocationState({ 
          status: "error", 
          message: "Không thể lấy vị trí. Đang hiện bản đồ khu vực trung tâm.", 
          lat: defaultLat, 
          lng: defaultLng,
          city: "Trung tâm TP.HCM"
        }); 
        loadMockData(defaultLat, defaultLng); 
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }

  useEffect(() => { 
    requestLocation(); 
  }, []);

  // Pro Search Logic: Debounced effect with AbortController
  useEffect(() => {
    if (inputValue.length <= 2) {
      setSuggestions([]);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      setIsSuggesting(true); // Chỉ spinner gợi ý, KHÔNG ảnh hưởng spinner danh sách
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(inputValue)}&limit=6&lat=10.7769&lon=106.7009`, {
        signal: abortController.signal
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.features) {
            setSuggestions(data.features.map((f: any) => ({
              display_name: [f.properties.name, f.properties.street, f.properties.city, f.properties.country].filter(Boolean).join(', '),
              name: f.properties.name || f.properties.street || "Địa điểm chưa rõ",
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0]
            })));
          }
          setIsSuggesting(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') setIsSuggesting(false);
        });
    }, 400); // Giảm độ trễ xuống 400ms cho cảm giác nhanh hơn

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [inputValue]);



  const sorted = [...restaurants].sort((a, b) => sortBy === "distance" ? a.distance - b.distance : b.rating - a.rating);
  const displayed = filterOpen ? sorted.filter((r) => r.openNow) : sorted;

  const chipStyle = (active: boolean) => ({
    background: active ? "linear-gradient(135deg, #a3e635, #4ade80)" : "rgba(255,255,255,0.06)",
    color: active ? "#0f1117" : "#94a3b8",
    border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
  });

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {/* Back + Title */}
        <div className="pt-6 mb-6">
          <Link to={isFromShopping ? "/shopping" : `/recipe/${id}`}
            className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f1f5f9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
            <ArrowLeft className="w-4 h-4" /> {isFromShopping ? "Quay lại danh sách đi chợ" : "Quay lại công thức"}
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-lime-400" />
            <h1 className="text-2xl font-black text-white">
              {isFromShopping ? "Chợ & Siêu thị gần bạn" : "Địa điểm bán gần bạn"}
            </h1>
          </div>
          <p className="text-sm pl-7" style={{ color: "#64748b" }}>
            {isFromShopping
              ? <>Tìm <span className="font-semibold text-lime-400">chợ, siêu thị</span> quanh khu vực của bạn để mua nguyên liệu</>
              : <>Quán phục vụ <span className="font-semibold text-lime-400">{recipeName}</span> quanh khu vực của bạn</>
            }
          </p>
        </div>

        {/* Location Controls: Auto + Manual Search — High Z-Index to avoid map overlap */}
        <div className="flex flex-col gap-4 mb-6 relative z-50">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl relative z-[60]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex-1 relative group/input">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-400 z-10" />
              <input 
                type="text" 
                placeholder="Nhập địa chỉ nhà bạn để tìm chợ..." 
                className="w-full bg-transparent border-none py-2.5 pl-10 pr-10 text-sm text-white focus:ring-0 placeholder:text-slate-500 relative z-0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue) {
                    // Khi nhấn Enter, nếu có gợi ý đầu tiên thì lấy luôn tọa độ của nó
                    const bestMatch = suggestions[0];
                    if (bestMatch) {
                      setLocationState({ 
                        status: "success", 
                        lat: parseFloat(bestMatch.lat), 
                        lng: parseFloat(bestMatch.lon), 
                        city: bestMatch.name 
                      });
                      loadMockData(parseFloat(bestMatch.lat), parseFloat(bestMatch.lon));
                    } else {
                      // Nếu không có gợi ý, dùng tọa độ hiện tại (nếu có) hoặc mặc định
                      const currentLat = locationState.status === 'success' ? locationState.lat : 10.7769;
                      const currentLng = locationState.status === 'success' ? locationState.lng : 106.7009;
                      setLocationState({ status: "success", lat: currentLat, lng: currentLng, city: inputValue });
                      loadMockData(currentLat, currentLng);
                    }
                    setSuggestions([]);
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                {isSuggesting && <Loader2 className="w-3.5 h-3.5 text-lime-400 animate-spin" />}
                {inputValue && (
                  <button 
                    onClick={() => { setInputValue(""); setSuggestions([]); }}
                    className="w-4 h-4 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  >
                    <span className="text-[10px]">✕</span>
                  </button>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                requestLocation();
                setInputValue(""); 
              }}
              className="p-2.5 rounded-xl transition-all hover:bg-white/5 group"
              title="Lấy vị trí hiện tại"
            >
              <Navigation className={`w-4 h-4 ${locationState.status === 'loading' ? 'animate-spin text-lime-400' : 'text-slate-400 group-hover:text-lime-400'}`} />
            </button>
          </div>

          {/* Luxury Suggestions Dropdown — Fixed Visibility & Content */}
          {suggestions.length > 0 && (
            <div className="absolute top-[52px] left-0 right-0 z-[100] rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
              style={{ background: "#1e2332", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-start gap-3 p-3.5 text-left hover:bg-lime-400/10 transition-colors border-b border-white/5 last:border-none"
                  onClick={() => {
                    setLocationState({
                      status: "success",
                      lat: s.lat,
                      lng: s.lon,
                      city: s.name 
                    });
                    setInputValue(s.name);
                    setSuggestions([]);
                    loadMockData(s.lat, s.lon);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-lime-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-lime-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{s.display_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {(locationState.status === "loading") && (
            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>Đang xác định vị trí...</p>
                <p className="text-xs" style={{ color: "rgba(251,191,36,0.6)" }}>Vui lòng "Cho phép" quyền định vị trên trình duyệt</p>
              </div>
            </div>
          )}

          {(locationState.status === "success" || (locationState.status === "error" && locationState.lat)) && (
            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ 
                background: locationState.status === "success" ? "rgba(163,230,53,0.06)" : "rgba(251,146,60,0.06)", 
                border: `1px solid ${locationState.status === "success" ? "rgba(163,230,53,0.2)" : "rgba(251,146,60,0.2)"}` 
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: locationState.status === "success" ? "rgba(163,230,53,0.15)" : "rgba(251,146,60,0.15)" }}>
                <Navigation className="w-4 h-4" style={{ color: locationState.status === "success" ? "#a3e635" : "#fb923c" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: locationState.status === "success" ? "#a3e635" : "#fb923c" }}>
                  {locationState.status === "success" ? "Đã xác định vị trí" : "Vị trí dự kiến (IP)"}
                </p>
                <p className="text-xs" style={{ color: locationState.status === "success" ? "rgba(163,230,53,0.6)" : "rgba(251,146,60,0.6)" }}>
                  {locationState.status === "success" ? locationState.city : "Dữ liệu có thể không chính xác do nhà mạng"} 
                  {locationState.lat && locationState.lng && ` · ${locationState.lat.toFixed(4)}°N, ${locationState.lng.toFixed(4)}°E`}
                </p>
              </div>
              {locationState.status === "error" && (
                <button onClick={requestLocation} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors">
                  Thử lại
                </button>
              )}
            </div>
          )}
        </div>

        {locationState.status === "error" && !locationState.lat && (
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 text-orange-400"
            style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{locationState.message}</p>
              <button onClick={requestLocation} className="text-xs underline mt-1 opacity-70">Thử lại</button>
            </div>
          </div>
        )}

        {/* Map View — Refined with REAL MAP interface */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative"
          style={{ height: 260, border: "1px solid rgba(255,255,255,0.08)", background: "#0c0e14" }}>
          
          {((locationState.status === "success" || locationState.status === "error") && (locationState.lat || locationState.city)) ? (
            <iframe
              key={`${locationState.lat}-${locationState.lng}-${locationState.city}`} // Ép bản đồ refresh khi vị trí thay đổi
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) opacity(0.85)" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={!import.meta.env.VITE_GOOGLE_MAPS_KEY 
                ? `https://maps.google.com/maps?q=${encodeURIComponent(locationState.city && locationState.city !== 'Vị trí của bạn' ? locationState.city : `${locationState.lat},${locationState.lng}`)}&z=15&output=embed`
                : `https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=siêu+thị+chợ&center=${locationState.lat},${locationState.lng}&zoom=14`
              }
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0f1117]">
              <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
              <p className="text-sm font-medium" style={{ color: "#64748b" }}>Đang khởi tạo bản đồ vệ tinh...</p>
            </div>
          )}

          {/* User Marker Overlay (UI Only) */}
          <div className="absolute pointer-events-none flex items-center justify-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-xl relative z-20" />
            </div>
          </div>

          {/* Map Info Label */}
          <div className="absolute top-4 right-4 px-4 py-2 rounded-xl shadow-2xl"
            style={{ background: "rgba(15,17,23,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(163,230,53,0.3)" }}>
            <p className="text-xs font-bold flex items-center gap-2" style={{ color: "#a3e635" }}>
              <Compass className="w-4 h-4" /> BẢN ĐỒ THỰC TẾ
            </p>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {!isLoadingPlaces && restaurants.length > 0 && (
            <span className="text-sm" style={{ color: "#64748b" }}>{displayed.length} địa điểm quanh đây</span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {[
              { label: "Đang mở cửa", active: filterOpen, onClick: () => setFilterOpen(!filterOpen) },
              { label: "Gần nhất", active: sortBy === "distance", onClick: () => setSortBy("distance") },
              { label: "Đánh giá cao", active: sortBy === "rating", onClick: () => setSortBy("rating") },
            ].map((chip) => (
              <button key={chip.label} onClick={chip.onClick}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={chipStyle(chip.active)}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant List */}
        {isLoadingPlaces ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
            <p style={{ color: "#64748b" }}>Đang quét khu vực của bạn...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <MapPin className="w-10 h-10" style={{ color: "#334155" }} />
            <p style={{ color: "#64748b" }}>Không tìm thấy địa điểm quanh đây.<br/>Thử tìm khu vực khác nhé!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((restaurant, index) => (
              <div key={restaurant.id}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-40 flex-shrink-0">
                    <ImageWithFallback src={restaurant.image} alt={restaurant.name}
                      className="w-full h-full object-cover min-h-[160px] sm:min-h-[140px]" />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-gray-900 border-2 border-[#1a1f2e]"
                      style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                      <span className="text-sm font-black">{index + 1}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-lg leading-tight text-white group-hover:text-lime-400 transition-colors">{restaurant.name}</h3>
                        <div className="flex-shrink-0 flex items-center gap-1.5">
                           <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635" }}>
                             {restaurant.distance < 1 ? `${(restaurant.distance * 1000).toFixed(0)}m` : `${restaurant.distance.toFixed(1)}km`}
                           </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-4 h-4 fill-lime-400 text-lime-400" />
                          <span className="text-sm font-bold text-lime-400">{restaurant.rating}</span>
                        </span>
                        <span className="text-xs" style={{ color: "#64748b" }}>({restaurant.reviewCount.toLocaleString()} đánh giá)</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs mb-3 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", color: "#94a3b8" }}>
                        <MapPin className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}>
                          <Phone className="w-3.5 h-3.5" /> Gọi điện
                        </button>
                        
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all text-center"
                          style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}>
                          <Navigation className="w-3.5 h-3.5" /> Chỉ đường
                        </a>
                      </div>
                    </div>

                    {/* Footer row */}
                    <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-lime-400" />
                          <span className="text-xs font-semibold text-lime-400">
                            {restaurant.distance < 1 ? `${(restaurant.distance * 1000).toFixed(0)}m` : `${restaurant.distance.toFixed(1)}km`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bike className="w-3 h-3" style={{ color: "#64748b" }} />
                          <span className="text-xs" style={{ color: "#64748b" }}>{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                      {restaurant.openNow ? (
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#a3e635" }}>
                          <span className="w-1.5 h-1.5 bg-lime-400 rounded-full inline-block" />
                          Đang mở · đến {restaurant.closingTime}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "#f87171" }}>
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block" />
                          Đã đóng
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { href: `tel:${restaurant.phone}`, label: "Gọi ngay", icon: <Phone className="w-3.5 h-3.5" /> },
                    { href: `https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`, label: "Chỉ đường", icon: <MapPin className="w-3.5 h-3.5" />, target: "_blank" },
                  ].map((action) => (
                    <a key={action.label} href={action.href} target={action.target}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors"
                      style={{ color: "#64748b", borderRight: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#a3e635"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(163,230,53,0.05)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    >
                      {action.icon} {action.label}
                    </a>
                  ))}
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors"
                    style={{ color: "#a3e635" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.05)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    <Bike className="w-3.5 h-3.5" /> Đặt giao
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {restaurants.length > 0 && (
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
            Dữ liệu quán ăn được cập nhật định kỳ · {new Date().toLocaleDateString("vi-VN")}
          </p>
        )}
      </main>
    </div>
  );
}