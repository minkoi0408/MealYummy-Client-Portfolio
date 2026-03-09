import { Link, useLocation } from "react-router";
import { Home, Search, ChefHat, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
                    style={{ background: "radial-gradient(circle, #a3e635, transparent)" }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-md">
                {/* Big 404 */}
                <div className="mb-6">
                    <p className="text-[120px] font-black leading-none select-none"
                        style={{
                            background: "linear-gradient(135deg, #a3e635 0%, #4ade80 50%, rgba(163,230,53,0.2) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 0 40px rgba(163,230,53,0.3))",
                        }}>
                        404
                    </p>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.2)" }}>
                    <ChefHat className="w-8 h-8" style={{ color: "#a3e635" }} />
                </div>

                <h1 className="text-2xl font-black text-white mb-2">Trang không tồn tại</h1>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: "#64748b" }}>
                    Đường dẫn <code className="px-1.5 py-0.5 rounded text-xs font-mono"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                        {location.pathname}
                    </code> không hợp lệ.
                </p>
                <p className="text-sm mb-8" style={{ color: "#475569" }}>
                    Có thể bạn đã nhập sai URL hoặc trang đã bị xóa.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/">
                        <button className="w-full sm:w-auto h-11 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #a3e635, #4ade80)", color: "#0f1117", boxShadow: "0 0 24px rgba(163,230,53,0.3)" }}>
                            <Home className="w-4 h-4" />
                            Về trang chủ
                        </button>
                    </Link>
                    <Link to="/app">
                        <button className="w-full sm:w-auto h-11 px-6 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
                            style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" }}>
                            <Search className="w-4 h-4" />
                            Tìm món ăn
                        </button>
                    </Link>
                </div>

                {/* Back link */}
                <button onClick={() => history.back()}
                    className="mt-6 flex items-center gap-1.5 text-xs mx-auto transition-colors"
                    style={{ color: "#475569" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; }}>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Quay lại trang trước
                </button>
            </div>
        </div>
    );
}
