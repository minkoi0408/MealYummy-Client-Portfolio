import { usePerformanceOptimizer } from '../../hooks/usePerformanceOptimizer';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function PerformanceIndicator() {
  const { metrics, config, isCritical } = usePerformanceOptimizer();
  const [showIndicator, setShowIndicator] = useState(false);

  // Show indicator when performance is poor
  useEffect(() => {
    if (metrics.fps < 15 || metrics.memory > 0.9 || (isCritical && metrics.fps < 20)) {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [metrics.fps, metrics.memory, isCritical]);

  const getPerformanceColor = () => {
    if (metrics.fps >= 50) return '#4ade80'; // Green
    if (metrics.fps >= 30) return '#fbbf24'; // Yellow
    if (metrics.fps >= 20) return '#fb923c'; // Orange
    return '#ef4444'; // Red
  };

  const getPerformanceText = () => {
    if (config.animations === 'off') return 'Tối ưu tối đa';
    if (config.animations === 'minimal') return 'Tối ưu cao';
    if (config.animations === 'reduced') return 'Tối ưu vừa';
    return 'Chất lượng cao';
  };

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-4 right-4 z-50 bg-black/90 border border-gray-600 rounded-lg p-3 text-white text-sm backdrop-blur-sm"
          style={{ minWidth: 200 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: getPerformanceColor() }}
            />
            <span className="font-semibold">Performance</span>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span style={{ color: getPerformanceColor() }}>{metrics.fps}</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={metrics.memory > 0.8 ? 'text-red-400' : 'text-green-400'}>
                {Math.round(metrics.memory * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-cyan-400">{getPerformanceText()}</span>
            </div>
            {metrics.batteryLevel < 0.3 && (
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className="text-red-400">{Math.round(metrics.batteryLevel * 100)}%</span>
              </div>
            )}
          </div>
          
          {isCritical && (
            <div className="mt-2 p-2 bg-red-900/50 rounded text-xs text-red-200">
              ⚠️ Đã giảm chất lượng để tránh lag
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}