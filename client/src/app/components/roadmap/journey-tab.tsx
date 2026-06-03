import { useState, useEffect } from "react";
import { Sparkles, Trash2, Route, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapDisplay, DurationDialog, type DurationLabel, type DietRoadmapDTO } from "./journey-components";

const API_BASE = "http://localhost:8082/api/v1";

function getToken() {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
}

export function JourneyTab({ onGoToNutrition }: { onGoToNutrition: () => void }) {
  const { user } = useAuth();
  const [hasSavedMetrics, setHasSavedMetrics] = useState<boolean | null>(null);
  const [roadmap, setRoadmap] = useState<DietRoadmapDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDurationDialog, setShowDurationDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Check if user has saved metrics
    fetch(`${API_BASE}/users/metrics/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data?.data && data.data.length > 0) {
          setHasSavedMetrics(true);
        } else {
          setHasSavedMetrics(false);
        }
      })
      .catch(() => setHasSavedMetrics(false));

    // Load existing roadmap
    fetch(`${API_BASE}/diet-roadmap`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data?.data) setRoadmap(data.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleGenerateRoadmap = async (duration: DurationLabel) => {
    const token = getToken();
    if (!token) { toast.error("Vui lòng đăng nhập lại"); return; }

    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/diet-roadmap/generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ durationLabel: duration }),
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        setRoadmap(data.data);
        setShowDurationDialog(false);
        toast.success("🎉 Lộ trình cá nhân hóa đã được tạo thành công!");
      } else {
        toast.error(data.message || "Không thể tạo lộ trình. Thử lại sau.");
      }
    } catch {
      toast.error("Lỗi kết nối server khi tạo lộ trình.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!roadmap) return;
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/diet-roadmap/${roadmap.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoadmap(null);
      toast.success("Đã xóa lộ trình");
    } catch {
      toast.error("Lỗi khi xóa lộ trình");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-slate-500 text-sm">Đang tải dữ liệu hành trình...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {!hasSavedMetrics ? (
        <div className="rounded-2xl p-8 text-center mt-6" style={{ background: "rgba(26,31,46,0.6)", border: "1px dashed rgba(163,230,53,0.2)" }}>
          <Route className="w-10 h-10 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-white font-black text-lg mb-2">Chưa có dữ liệu cơ thể</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Để AI có thể thiết kế lộ trình chính xác nhất cho bạn, vui lòng cập nhật chỉ số cơ thể hiện tại.
          </p>
          <button 
            onClick={onGoToNutrition}
            className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#a3e635,#4ade80)", color: "#0f1117", boxShadow: "0 4px 16px rgba(163,230,53,0.3)" }}
          >
            Đến trang Hồ sơ dinh dưỡng <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Create Button Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 mb-6 rounded-2xl" style={{ background: "rgba(26,31,46,0.9)", border: "1px solid rgba(163,230,53,0.25)" }}>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white mb-1">Hành trình thay đổi vóc dáng</h2>
              <p className="text-xs text-slate-400">Lộ trình được thiết kế cá nhân hóa dựa trên chỉ số của bạn</p>
            </div>
            <button
              onClick={() => setShowDurationDialog(true)}
              className="mt-4 sm:mt-0 h-10 px-5 rounded-xl text-xs font-black flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.4)", color: "#a3e635" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {roadmap ? "Tạo lại lộ trình mới" : "Tạo Lộ Trình AI"}
            </button>
          </div>

          {/* Roadmap Result */}
          {roadmap ? (
            <RoadmapDisplay roadmap={roadmap} onDelete={handleDeleteRoadmap} />
          ) : (
            <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(26,31,46,0.6)", border: "1px dashed rgba(163,230,53,0.2)" }}>
              <Sparkles className="w-10 h-10 text-lime-400 mx-auto mb-4 opacity-50" />
              <p className="text-white font-black text-lg mb-2">Bạn chưa có lộ trình nào</p>
              <p className="text-slate-400 text-sm">Nhấn nút "Tạo Lộ Trình AI" phía trên để hệ thống thiết kế riêng cho bạn nhé!</p>
            </div>
          )}
        </>
      )}

      {/* Duration Dialog */}
      <DurationDialog
        open={showDurationDialog}
        onClose={() => !isGenerating && setShowDurationDialog(false)}
        onGenerate={handleGenerateRoadmap}
        isGenerating={isGenerating}
      />
    </div>
  );
}
