import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Navigation,
  Loader2,
  AlertCircle,
  ChevronRight,
  Bike,
  DollarSign,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AppHeader } from "../components/app-header";
import { mockRecipes } from "../data/mock-recipes";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance: number; // km
  rating: number;
  reviewCount: number;
  openNow: boolean;
  closingTime: string;
  phone: string;
  priceRange: "₫" | "₫₫" | "₫₫₫";
  image: string;
  tags: string[];
  deliveryTime: string;
}

function generateMockRestaurants(recipeName: string): Restaurant[] {
  const baseRestaurants: Restaurant[] = [
    {
      id: "r1",
      name: `Quán ${recipeName} Bà Năm`,
      address: "12 Nguyễn Trãi, Quận 1, TP.HCM",
      distance: 0.3,
      rating: 4.8,
      reviewCount: 1240,
      openNow: true,
      closingTime: "22:00",
      phone: "028 3822 1234",
      priceRange: "₫",
      image:
        "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcmVzdGF1cmFudCUyMHN0cmVldCUyMGZvb2QlMjBzaG9wfGVufDF8fHx8MTc3MjU0MzQzOXww&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Truyền thống", "Gia đình"],
      deliveryTime: "15-20 phút",
    },
    {
      id: "r2",
      name: `${recipeName} Gánh - Lê Lợi`,
      address: "45 Lê Lợi, Quận 1, TP.HCM",
      distance: 0.7,
      rating: 4.6,
      reviewCount: 876,
      openNow: true,
      closingTime: "21:30",
      phone: "028 3821 5678",
      priceRange: "₫",
      image:
        "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGUlMjBzb3VwJTIwcmVzdGF1cmFudCUyMGJvd2x8ZW58MXx8fHwxNzcyNTQzNDM5fDA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Vỉa hè", "Đông khách"],
      deliveryTime: "20-30 phút",
    },
    {
      id: "r3",
      name: `Nhà hàng ${recipeName} Ngon`,
      address: "160 Pasteur, Quận 3, TP.HCM",
      distance: 1.2,
      rating: 4.9,
      reviewCount: 2103,
      openNow: true,
      closingTime: "23:00",
      phone: "028 3822 9999",
      priceRange: "₫₫",
      image:
        "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcmVzdGF1cmFudCUyMHN0cmVldCUyMGZvb2QlMjBzaG9wfGVufDF8fHx8MTc3MjU0MzQzOXww&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Không gian đẹp", "Có máy lạnh"],
      deliveryTime: "25-35 phút",
    },
    {
      id: "r4",
      name: `${recipeName} Chú Sáu`,
      address: "78 Võ Văn Tần, Quận 3, TP.HCM",
      distance: 1.5,
      rating: 4.5,
      reviewCount: 543,
      openNow: false,
      closingTime: "20:00",
      phone: "028 3931 4567",
      priceRange: "₫",
      image:
        "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGUlMjBzb3VwJTIwcmVzdGF1cmFudCUyMGJvd2x8ZW58MXx8fHwxNzcyNTQzNDM5fDA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Bình dân", "Ngon"],
      deliveryTime: "30-40 phút",
    },
    {
      id: "r5",
      name: `${recipeName} Cali - Đinh Tiên Hoàng`,
      address: "22 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM",
      distance: 2.1,
      rating: 4.7,
      reviewCount: 1560,
      openNow: true,
      closingTime: "22:30",
      phone: "028 3840 2233",
      priceRange: "₫₫",
      image:
        "https://images.unsplash.com/photo-1763793244461-01fa59bbae5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcmVzdGF1cmFudCUyMHN0cmVldCUyMGZvb2QlMjBzaG9wfGVufDF8fHx8MTc3MjU0MzQzOXww&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Chain", "Tiêu chuẩn"],
      deliveryTime: "35-45 phút",
    },
    {
      id: "r6",
      name: `${recipeName} Đặc Biệt Hai Bà Trưng`,
      address: "96 Hai Bà Trưng, Quận 1, TP.HCM",
      distance: 2.8,
      rating: 4.4,
      reviewCount: 389,
      openNow: true,
      closingTime: "21:00",
      phone: "028 3829 6677",
      priceRange: "₫₫₫",
      image:
        "https://images.unsplash.com/photo-1758458800136-e6337d2e5c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGUlMjBzb3VwJTIwcmVzdGF1cmFudCUyMGJvd2x8ZW58MXx8fHwxNzcyNTQzNDM5fDA&ixlib=rb-4.1.0&q=80&w=400",
      tags: ["Cao cấp", "View đẹp"],
      deliveryTime: "40-55 phút",
    },
  ];
  return baseRestaurants;
}

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; lat: number; lng: number; city: string }
  | { status: "error"; message: string };

export function NearbyRestaurantsPage() {
  const { id } = useParams();
  const recipe = mockRecipes.find((r) => r.id === id);
  const recipeName = recipe?.name ?? "Món ăn";

  const [locationState, setLocationState] = useState<LocationState>({
    status: "idle",
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  function requestLocation() {
    setLocationState({ status: "loading" });
    if (!navigator.geolocation) {
      setLocationState({
        status: "error",
        message: "Trình duyệt của bạn không hỗ trợ định vị.",
      });
      loadMockData();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationState({
          status: "success",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          city: "TP. Hồ Chí Minh",
        });
        loadMockData();
      },
      () => {
        setLocationState({
          status: "error",
          message:
            "Không thể lấy vị trí. Đang hiển thị quán gần bạn dựa trên dữ liệu mặc định.",
        });
        loadMockData();
      },
      { timeout: 8000 }
    );
  }

  function loadMockData() {
    setTimeout(() => {
      setRestaurants(generateMockRestaurants(recipeName));
    }, 600);
  }

  const sorted = [...restaurants].sort((a, b) =>
    sortBy === "distance" ? a.distance - b.distance : b.rating - a.rating
  );

  const displayed = filterOpen ? sorted.filter((r) => r.openNow) : sorted;

  function renderStars(rating: number) {
    return (
      <span className="flex items-center gap-0.5">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm font-semibold text-amber-600">{rating}</span>
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Back + Title */}
        <div className="mb-6">
          <Link to={`/recipe/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Quay lại công thức
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-black text-foreground">
              Địa điểm bán gần bạn
            </h1>
          </div>
          <p className="text-muted-foreground text-sm pl-7">
            Quán phục vụ{" "}
            <span className="font-semibold text-amber-600">{recipeName}</span>{" "}
            quanh khu vực của bạn
          </p>
        </div>

        {/* Location Status */}
        {locationState.status === "loading" && (
          <div className="flex items-center gap-3 p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl mb-6">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-700">
                Đang xác định vị trí...
              </p>
              <p className="text-xs text-amber-600/70">
                Vui lòng cho phép truy cập định vị
              </p>
            </div>
          </div>
        )}

        {locationState.status === "success" && (
          <div className="flex items-center gap-3 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/60 rounded-2xl mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Navigation className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-700">
                Đã xác định vị trí
              </p>
              <p className="text-xs text-green-600/70">
                {locationState.city} •{" "}
                {locationState.lat.toFixed(4)}°N,{" "}
                {locationState.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
        )}

        {locationState.status === "error" && (
          <div className="flex items-start gap-3 p-4 bg-orange-50/80 backdrop-blur-sm border border-orange-200/60 rounded-2xl mb-6">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-700">
                {locationState.message}
              </p>
              <button
                onClick={requestLocation}
                className="text-xs text-orange-600 underline mt-1"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-lg border border-amber-100/60">
          <div className="h-48 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
            {/* Fake map grid */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Fake roads */}
              <line
                x1="0"
                y1="96"
                x2="100%"
                y2="96"
                stroke="#f59e0b"
                strokeWidth="3"
                opacity="0.5"
              />
              <line
                x1="0"
                y1="140"
                x2="100%"
                y2="140"
                stroke="#f59e0b"
                strokeWidth="2"
                opacity="0.4"
              />
              <line
                x1="200"
                y1="0"
                x2="200"
                y2="192"
                stroke="#f59e0b"
                strokeWidth="3"
                opacity="0.5"
              />
              <line
                x1="480"
                y1="0"
                x2="480"
                y2="192"
                stroke="#f59e0b"
                strokeWidth="2"
                opacity="0.4"
              />
            </svg>

            {/* Mock pins */}
            {[
              { x: "28%", y: "45%", label: "1" },
              { x: "52%", y: "30%", label: "2" },
              { x: "38%", y: "65%", label: "3" },
              { x: "68%", y: "55%", label: "4" },
              { x: "18%", y: "70%", label: "5" },
            ].map((pin) => (
              <div
                key={pin.label}
                className="absolute flex flex-col items-center"
                style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}
              >
                <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-xs font-bold">{pin.label}</span>
                </div>
                <div className="w-2 h-2 bg-amber-500 rotate-45 -mt-1 shadow"></div>
              </div>
            ))}

            {/* User location */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <div className="w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-lg relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-60"></div>
              </div>
            </div>

            {/* Map overlay label */}
            <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-500" />
                Bản đồ khu vực
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Sort */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {displayed.length} quán tìm thấy
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterOpen
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white/60 text-foreground border-border hover:border-amber-300"
              }`}
            >
              Đang mở cửa
            </button>
            <button
              onClick={() => setSortBy("distance")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sortBy === "distance"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white/60 text-foreground border-border hover:border-amber-300"
              }`}
            >
              Gần nhất
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                sortBy === "rating"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white/60 text-foreground border-border hover:border-amber-300"
              }`}
            >
              Đánh giá cao
            </button>
          </div>
        </div>

        {/* Restaurant List */}
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-muted-foreground">Đang tìm quán gần bạn...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="overflow-hidden border border-amber-100/60 bg-white/70 backdrop-blur-sm hover:shadow-lg hover:border-amber-300/60 transition-all cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="flex gap-0">
                    {/* Thumbnail */}
                    <div className="relative w-28 flex-shrink-0">
                      <ImageWithFallback
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover min-h-[120px]"
                      />
                      {/* Rank badge */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-base leading-tight group-hover:text-amber-600 transition-colors">
                            {restaurant.name}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-amber-500 transition-colors" />
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          {renderStars(restaurant.rating)}
                          <span className="text-xs text-muted-foreground">
                            ({restaurant.reviewCount.toLocaleString()} đánh giá)
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {restaurant.priceRange}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{restaurant.address}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {restaurant.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer row */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-amber-500" />
                            <span className="text-xs font-semibold text-amber-600">
                              {restaurant.distance < 1
                                ? `${(restaurant.distance * 1000).toFixed(0)}m`
                                : `${restaurant.distance.toFixed(1)}km`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bike className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {restaurant.deliveryTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {restaurant.openNow ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                              Đang mở • đến {restaurant.closingTime}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block"></span>
                              Đã đóng
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex gap-0 border-t border-border/50">
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors border-r border-border/50"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Gọi ngay
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + " " + restaurant.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors border-r border-border/50"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Chỉ đường
                    </a>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors">
                      <Bike className="w-3.5 h-3.5" />
                      Đặt giao
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom note */}
        {restaurants.length > 0 && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            Dữ liệu quán ăn được cập nhật định kỳ · {new Date().toLocaleDateString("vi-VN")}
          </p>
        )}
      </main>
    </div>
  );
}