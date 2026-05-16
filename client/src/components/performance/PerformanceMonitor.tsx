import { useEffect, useState } from 'react';
import { usePerformanceOptimizer } from '../../hooks/usePerformanceOptimizer';

interface PerformanceMonitorProps {
  showDebug?: boolean;
  onPerformanceChange?: (config: any) => void;
}

export function PerformanceMonitor({ showDebug = false, onPerformanceChange }: PerformanceMonitorProps) {
  const { metrics, config, setPreset, forceGC, isLowEnd, isCritical } = usePerformanceOptimizer();
  const [showWarning, setShowWarning] = useState(false);

  // Notify parent of performance changes
  useEffect(() => {
    if (onPerformanceChange) {
      onPerformanceChange(config);
    }
  }, [config, onPerformanceChange]);

  // Show performance warnings
  useEffect(() => {
    if (isCritical && !showWarning) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    }
  }, [isCritical, showWarning]);

  // Auto-optimize on critical performance
  useEffect(() => {
    if (metrics.fps < 10 && metrics.thermalState === 'critical') {
      setPreset('potato');
    }
  }, [metrics.fps, metrics.thermalState, setPreset]);

  if (!showDebug && !showWarning) return null;

  return (
    <>
      {/* Performance Warning */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-500 rounded-lg p-3 text-white text-sm max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400">⚠️</span>
            <span className="font-semibold">Performance Warning</span>
          </div>
          <p className="text-xs text-red-200 mb-2">
            Device is overheating. Reducing graphics quality to prevent lag.
          </p>
          <button
            onClick={forceGC}
            className="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
          >
            Clear Memory
          </button>
        </div>
      )}

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 border border-gray-600 rounded-lg p-3 text-white text-xs font-mono">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>FPS: <span className={metrics.fps < 20 ? 'text-red-400' : 'text-green-400'}>{metrics.fps}</span></div>
            <div>Memory: <span className={metrics.memory > 0.8 ? 'text-red-400' : 'text-green-400'}>{Math.round(metrics.memory * 100)}%</span></div>
            <div>Device: <span className="text-blue-400">{metrics.deviceType}</span></div>
            <div>Thermal: <span className={metrics.thermalState === 'critical' ? 'text-red-400' : 'text-green-400'}>{metrics.thermalState}</span></div>
            <div>Battery: <span className={metrics.batteryLevel < 0.2 ? 'text-red-400' : 'text-green-400'}>{Math.round(metrics.batteryLevel * 100)}%</span></div>
            <div>Network: <span className="text-yellow-400">{metrics.connection}</span></div>
          </div>
          
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-xs text-gray-400 mb-1">Performance Config:</div>
            <div>Animations: <span className="text-cyan-400">{config.animations}</span></div>
            <div>Particles: <span className="text-cyan-400">{config.particles}</span></div>
            <div>Max FPS: <span className="text-cyan-400">{config.maxFPS}</span></div>
            <div>Pixel Ratio: <span className="text-cyan-400">{config.pixelRatio.toFixed(1)}</span></div>
          </div>

          <div className="flex gap-1 mt-2">
            <button onClick={() => setPreset('ultra')} className="bg-green-700 px-1 py-0.5 rounded text-xs">Ultra</button>
            <button onClick={() => setPreset('high')} className="bg-blue-700 px-1 py-0.5 rounded text-xs">High</button>
            <button onClick={() => setPreset('medium')} className="bg-yellow-700 px-1 py-0.5 rounded text-xs">Med</button>
            <button onClick={() => setPreset('low')} className="bg-orange-700 px-1 py-0.5 rounded text-xs">Low</button>
            <button onClick={() => setPreset('potato')} className="bg-red-700 px-1 py-0.5 rounded text-xs">Potato</button>
          </div>
        </div>
      )}
    </>
  );
}