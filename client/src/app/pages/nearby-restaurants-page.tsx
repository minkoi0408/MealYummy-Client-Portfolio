import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft, MapPin, Star, Phone,
  Navigation, Loader2, AlertCircle, ChevronRight, Bike,
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

function generateMockRestaurants(recipeName: string): Restaurant[] {
  return [
    { id: "r1", name: `Quán ${recipeName} Bà Năm`, address: "12 Nguyễn Trãi, Quận 1, TP.HCM", distance: 0.3, rating: 4.8, reviewCount: 1240, openNow: true, closingTime: "22:00", phone: "028 3822 1234", priceRange: "₫", image: "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Truyền thống", "Gia đình"], deliveryTime: "15-20 phút" },
    { id: "r2", name: `${recipeName} Gánh - Lê Lợi`, address: "45 Lê Lợi, Quận 1, TP.HCM", distance: 0.7, rating: 4.6, reviewCount: 876, openNow: true, closingTime: "21:30", phone: "028 3821 5678", priceRange: "₫", image: "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Vỉa hè", "Đông khách"], deliveryTime: "20-30 phút" },
    { id: "r3", name: `Nhà hàng ${recipeName} Ngon`, address: "160 Pasteur, Quận 3, TP.HCM", distance: 1.2, rating: 4.9, reviewCount: 2103, openNow: true, closingTime: "23:00", phone: "028 3822 9999", priceRange: "₫₫", image: "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Không gian đẹp", "Có máy lạnh"], deliveryTime: "25-35 phút" },
    { id: "r4", name: `${recipeName} Chú Sáu`, address: "78 Võ Văn Tần, Quận 3, TP.HCM", distance: 1.5, rating: 4.5, reviewCount: 543, openNow: false, closingTime: "20:00", phone: "028 3931 4567", priceRange: "₫", image: "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Bình dân", "Ngon"], deliveryTime: "30-40 phút" },
    { id: "r5", name: `${recipeName} Cali`, address: "22 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM", distance: 2.1, rating: 4.7, reviewCount: 1560, openNow: true, closingTime: "22:30", phone: "028 3840 2233", priceRange: "₫₫", image: "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Chain", "Tiêu chuẩn"], deliveryTime: "35-45 phút" },
    { id: "r6", name: `${recipeName} Đặc Biệt`, address: "96 Hai Bà Trưng, Quận 1, TP.HCM", distance: 2.8, rating: 4.4, reviewCount: 389, openNow: true, closingTime: "21:00", phone: "028 3829 6677", priceRange: "₫₫₫", image: "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", tags: ["Cao cấp", "View đẹp"], deliveryTime: "40-55 phút" },
  ];
}

type LocationState = { status: "idle" } | { status: "loading" } | { status: "success"; lat: number; lng: number; city: string } | { status: "error"; message: string };

export function NearbyRestaurantsPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find((r) => r.id === id);
  const recipeName = recipe?.name ?? "Món ăn";

  const [locationState, setLocationState] = useState<LocationState>({ status: "idle" });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => { requestLocation(); }, []);

  function requestLocation() {
    setLocationState({ status: "loading" });
    if (!navigator.geolocation) {
      setLocationState({ status: "error", message: "Trình duyệt của bạn không hỗ trợ định vị." });
      loadMockData(); return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocationState({ status: "success", lat: pos.coords.latitude, lng: pos.coords.longitude, city: "TP. Hồ Chí Minh" }); loadMockData(); },
      () => { setLocationState({ status: "error", message: "Không thể lấy vị trí. Đang hiển thị quán gần bạn dựa trên dữ liệu mặc định." }); loadMockData(); },
      { timeout: 8000 }
    );
  }

  function loadMockData() { setTimeout(() => setRestaurants(generateMockRestaurants(recipeName)), 600); }

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
          <Link to={`/recipe/${id}`}
            className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#f1f5f9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#64748b"; }}>
            <ArrowLeft className="w-4 h-4" /> Quay lại công thức
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-lime-400" />
            <h1 className="text-2xl font-black text-white">Địa điểm bán gần bạn</h1>
          </div>
          <p className="text-sm pl-7" style={{ color: "#64748b" }}>
            Quán phục vụ <span className="font-semibold text-lime-400">{recipeName}</span> quanh khu vực của bạn
          </p>
        </div>

        {/* Location Status */}
        {locationState.status === "loading" && (
          <div className="flex items-center gap-3 p-4 rounded-2xl mb-6"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <Loader2 className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#fbbf24" }}>Đang xác định vị trí...</p>
              <p className="text-xs" style={{ color: "rgba(251,191,36,0.6)" }}>Vui lòng cho phép truy cập định vị</p>
            </div>
          </div>
        )}

        {locationState.status === "success" && (
          <div className="flex items-center gap-3 p-4 rounded-2xl mb-6"
            style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.2)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(163,230,53,0.15)" }}>
              <Navigation className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#a3e635" }}>Đã xác định vị trí</p>
              <p className="text-xs" style={{ color: "rgba(163,230,53,0.6)" }}>
                {locationState.city} · {locationState.lat.toFixed(4)}°N, {locationState.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        )}

        {locationState.status === "error" && (
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-6"
            style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#fb923c" }}>{locationState.message}</p>
              <button onClick={requestLocation} className="text-xs underline mt-1" style={{ color: "rgba(251,146,60,0.7)" }}>Thử lại</button>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg"
          style={{ border: "1px solid rgba(163,230,53,0.15)" }}>
          <div className="h-48 relative" style={{ background: "linear-gradient(135deg, #0f1a0a, #1a2e0f)" }}>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a3e635" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapgrid)" />
              <line x1="0" y1="96" x2="100%" y2="96" stroke="#a3e635" strokeWidth="2" opacity="0.4" />
              <line x1="0" y1="140" x2="100%" y2="140" stroke="#a3e635" strokeWidth="1.5" opacity="0.3" />
              <line x1="200" y1="0" x2="200" y2="192" stroke="#a3e635" strokeWidth="2" opacity="0.4" />
              <line x1="480" y1="0" x2="480" y2="192" stroke="#a3e635" strokeWidth="1.5" opacity="0.3" />
            </svg>

            {/* Mock pins */}
            {[{ x: "28%", y: "45%", label: "1" }, { x: "52%", y: "30%", label: "2" }, { x: "38%", y: "65%", label: "3" }, { x: "68%", y: "55%", label: "4" }, { x: "18%", y: "70%", label: "5" }].map((pin) => (
              <div key={pin.label} className="absolute flex flex-col items-center"
                style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2"
                  style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", borderColor: "#0f1117" }}>
                  <span className="text-gray-900 text-xs font-black">{pin.label}</span>
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 shadow" style={{ background: "#a3e635" }} />
              </div>
            ))}

            {/* User location ping */}
            <div className="absolute flex items-center justify-center" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-60" />
              </div>
            </div>

            {/* Map label */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg shadow"
              style={{ background: "rgba(15,17,23,0.8)", backdropFilter: "blur(8px)", border: "1px solid rgba(163,230,53,0.2)" }}>
              <p className="text-xs flex items-center gap-1.5" style={{ color: "#a3e635" }}>
                <MapPin className="w-3 h-3" /> Bản đồ khu vực
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-sm" style={{ color: "#64748b" }}>{displayed.length} quán tìm thấy</span>
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
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
            <p style={{ color: "#64748b" }}>Đang tìm quán gần bạn...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((restaurant, index) => (
              <div key={restaurant.id}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
                style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(163,230,53,0.2)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(163,230,53,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
              >
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="relative w-28 flex-shrink-0">
                    <ImageWithFallback src={restaurant.image} alt={restaurant.name}
                      className="w-full h-full object-cover min-h-[120px]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md text-gray-900"
                      style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)" }}>
                      <span className="text-xs font-black">{index + 1}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-base leading-tight text-white group-hover:text-lime-400 transition-colors">{restaurant.name}</h3>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors group-hover:text-lime-400" style={{ color: "#475569" }} />
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
                          <span className="text-sm font-semibold text-lime-400">{restaurant.rating}</span>
                        </span>
                        <span className="text-xs" style={{ color: "#64748b" }}>({restaurant.reviewCount.toLocaleString()} đánh giá)</span>
                        <span className="text-xs font-medium" style={{ color: "#64748b" }}>{restaurant.priceRange}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "#64748b" }}>
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {restaurant.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full"
                            style={{ background: "rgba(163,230,53,0.08)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.15)" }}>
                            {tag}
                          </span>
                        ))}
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