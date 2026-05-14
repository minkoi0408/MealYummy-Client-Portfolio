import { useLocation, useNavigate } from "react-router";
import { AppHeader } from "../components/app-header";
import { Store, Navigation, MapPin, Star, ArrowLeft, Clock, ShoppingBasket } from "lucide-react";
import { useBrightness } from "../contexts/brightness-context";

export function NearbyMarketsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isBright } = useBrightness();
  
  // Lấy data được truyền qua từ trang danh sách đi chợ
  const markets = location.state?.markets || [];
  const userLat = location.state?.userLat;
  const userLng = location.state?.userLng;

  // Tính khoảng cách gần đúng (chỉ mang tính minh họa nếu không có data từ API)
  const renderDistance = (marketLat: number, marketLng: number) => {
    if (!userLat || !userLng || !marketLat || !marketLng) return "Gần đây";
    
    // Tính khoảng cách nhanh bằng Pythagoras (gần đúng)
    const R = 6371; // km
    const dLat = (marketLat - userLat) * Math.PI / 180;
    const dLng = (marketLng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(marketLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`;
  };

  const handleOpenGoogleMaps = (marketName: string, lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&destination_place_id=${marketName}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen pb-20">
      <AppHeader />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition-colors"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách đi chợ
        </button>

        <div className="mb-8 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
               style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
            <ShoppingBasket className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: "var(--foreground)" }}>Siêu thị & Chợ gần bạn</h1>
            <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
              Đã tìm thấy {markets.length} địa điểm trong bán kính 2km
            </p>
          </div>
        </div>

        {markets.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: "var(--card)", border: isBright ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.05)" }}>
            <Store className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: "var(--muted-foreground)" }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>Không tìm thấy địa điểm nào</h3>
            <p className="text-sm px-8" style={{ color: "var(--muted-foreground)" }}>Có vẻ như khu vực xung quanh bạn không có siêu thị hoặc chợ nào được đăng ký trên bản đồ.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {markets.map((market: any, index: number) => {
              const distance = renderDistance(market.geometry?.location?.lat, market.geometry?.location?.lng);
              const isOpen = market.opening_hours?.open_now;
              const rating = market.rating || "Mới";
              const photoRef = market.photos?.[0]?.photo_reference;
              const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
              
              // Tạo URL ảnh từ Google nếu có, nếu không thì xài hình placeholder gradient
              const photoUrl = photoRef 
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${apiKey}`
                : null;

              return (
                <div 
                  key={market.place_id || index}
                  className="group rounded-3xl p-4 transition-all duration-300 hover:scale-[1.02] flex gap-4 overflow-hidden relative cursor-pointer"
                  style={{ 
                    background: "var(--card)", 
                    border: isBright ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  onClick={() => handleOpenGoogleMaps(market.name, market.geometry.location.lat, market.geometry.location.lng)}
                >
                  {/* Hiệu ứng viền phát sáng khi hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                       style={{ background: isBright ? "linear-gradient(135deg, transparent, rgba(16,185,129,0.05))" : "linear-gradient(135deg, transparent, rgba(16,185,129,0.1))" }} />

                  {/* Ảnh minh họa */}
                  <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden relative shadow-md">
                    {photoUrl ? (
                      <img src={photoUrl} alt={market.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                           style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                        <Store className="w-8 h-8 text-white opacity-50" />
                      </div>
                    )}
                    {isOpen !== undefined && (
                      <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm backdrop-blur-md"
                           style={{ background: isOpen ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)", color: "white" }}>
                        {isOpen ? "ĐANG MỞ" : "ĐÓNG CỬA"}
                      </div>
                    )}
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 flex flex-col py-1 justify-between min-w-0">
                    <div>
                      <h3 className="font-bold text-[17px] truncate mb-1" style={{ color: "var(--foreground)" }}>{market.name}</h3>
                      <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                        {market.vicinity || "Không có địa chỉ"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                           style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                        <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg"
                           style={{ background: isBright ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)", color: "var(--foreground)" }}>
                        <MapPin className="w-3 h-3 text-emerald-500" /> {distance}
                      </div>

                      <button className="ml-auto w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:bg-emerald-500 group-hover:text-white"
                              style={{ background: isBright ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.15)", color: "#10b981" }}>
                        <Navigation className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
