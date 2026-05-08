import { useState, useEffect, useCallback, useRef } from 'react';

// Custom network state hook
function useNetworkState() {
  const [networkState, setNetworkState] = useState<{
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  }>({});

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        setNetworkState({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  return networkState;
}

// Custom battery hook
function useBattery() {
  const [batteryState, setBatteryState] = useState<{
    level?: number;
    charging?: boolean;
  }>({});

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryState({
            level: battery.level,
            charging: battery.charging
          });
        };

        updateBatteryInfo();
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingchange', updateBatteryInfo);
        };
      });
    }
  }, []);

  return batteryState;
}

interface PerformanceMetrics {
  fps: number;
  memory: number;
  connection: string;
  batteryLevel: number;
  isCharging: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
}

interface PerformanceConfig {
  animations: 'full' | 'reduced' | 'minimal' | 'off';
  particles: 'full' | 'reduced' | 'minimal' | 'off';
  shadows: boolean;
  antialiasing: boolean;
  pixelRatio: number;
  maxFPS: number;
  renderDistance: number;
  textureQuality: 'high' | 'medium' | 'low';
}

export function usePerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    connection: 'unknown',
    batteryLevel: 1,
    isCharging: true,
    deviceType: 'desktop',
    thermalState: 'nominal'
  });

  const [config, setConfig] = useState<PerformanceConfig>({
    animations: 'full',
    particles: 'full',
    shadows: true,
    antialiasing: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    maxFPS: 60,
    renderDistance: 100,
    textureQuality: 'high'
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const performanceHistory = useRef<number[]>([]);
  
  // Network and battery hooks
  const networkState = useNetworkState();
  const batteryState = useBattery();

  // Device detection
  const detectDevice = useCallback((): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent;
    
    if (/Mobi|Android/i.test(userAgent) || width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      
      // Keep performance history
      performanceHistory.current.push(fps);
      if (performanceHistory.current.length > 10) {
        performanceHistory.current.shift();
      }
      
      setMetrics(prev => ({ ...prev, fps }));
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  }, []);

  // Memory monitoring
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      setMetrics(prev => ({ ...prev, memory: usedMemory }));
    }
  }, []);

  // Thermal state detection
  const detectThermalState = useCallback(() => {
    const avgFPS = performanceHistory.current.reduce((a, b) => a + b, 0) / performanceHistory.current.length;
    
    if (avgFPS < 15) return 'critical';
    if (avgFPS < 25) return 'serious';
    if (avgFPS < 40) return 'fair';
    return 'nominal';
  }, []);

  // Auto-optimize based on metrics (less aggressive)
  const optimizePerformance = useCallback(() => {
    const device = detectDevice();
    const thermalState = detectThermalState();
    const isVeryLowEnd = device === 'mobile' && metrics.memory > 0.9 && !metrics.isCharging && metrics.batteryLevel < 0.1;
    const isSlowNetwork = networkState?.effectiveType === 'slow-2g';

    let newConfig: PerformanceConfig = { ...config };

    // Only optimize for very extreme cases
    if (device === 'mobile' && metrics.memory > 0.8) {
      newConfig.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      newConfig.maxFPS = 30;
      // Keep shadows and other features unless critical
    }

    // Thermal throttling - only in extreme cases
    if (thermalState === 'critical' && metrics.fps < 10) {
      newConfig.animations = 'off';
      newConfig.particles = 'off';
      newConfig.shadows = false;
      newConfig.antialiasing = false;
      newConfig.maxFPS = 15;
      newConfig.textureQuality = 'low';
    } else if (thermalState === 'serious' && metrics.fps < 15) {
      newConfig.animations = 'minimal';
      newConfig.particles = 'minimal';
      newConfig.maxFPS = 20;
      newConfig.textureQuality = 'medium';
    }

    // Battery optimization - only when very low
    if (metrics.batteryLevel < 0.1 && !metrics.isCharging) {
      newConfig.animations = 'reduced';
      newConfig.maxFPS = 25;
    }

    // Network optimization
    if (isSlowNetwork) {
      newConfig.textureQuality = 'medium'; // Don't go to low immediately
    }

    // Memory pressure - only when very high
    if (metrics.memory > 0.95) {
      newConfig.particles = 'reduced'; // Don't turn off completely
      newConfig.renderDistance = 50;
    }

    setConfig(newConfig);
    setMetrics(prev => ({ ...prev, deviceType: device, thermalState }));
  }, [metrics, networkState, config, detectDevice, detectThermalState]);

  // Web Vitals monitoring (simplified)
  useEffect(() => {
    // Simple performance monitoring without web-vitals library
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log(`${entry.name}: ${entry.duration}ms`);
        });
      });
      
      try {
        observer.observe({ entryTypes: ['navigation', 'paint'] });
      } catch (e) {
        // Fallback for older browsers
      }
      
      return () => observer.disconnect();
    }
  }, []);

  // Initialize monitoring
  useEffect(() => {
    const rafId = requestAnimationFrame(measureFPS);
    const memoryInterval = setInterval(measureMemory, 2000);
    const optimizeInterval = setInterval(optimizePerformance, 3000);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(memoryInterval);
      clearInterval(optimizeInterval);
    };
  }, [measureFPS, measureMemory, optimizePerformance]);

  // Update battery metrics
  useEffect(() => {
    if (batteryState) {
      setMetrics(prev => ({
        ...prev,
        batteryLevel: batteryState.level || 1,
        isCharging: batteryState.charging || true
      }));
    }
  }, [batteryState]);

  // Update network metrics
  useEffect(() => {
    if (networkState) {
      setMetrics(prev => ({
        ...prev,
        connection: networkState.effectiveType || 'unknown'
      }));
    }
  }, [networkState]);

  // Force garbage collection
  const forceGC = useCallback(() => {
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Clear Three.js cache
    if ('THREE' in window) {
      (window as any).THREE.Cache.clear();
    }
  }, []);

  // Performance presets
  const setPreset = useCallback((preset: 'ultra' | 'high' | 'medium' | 'low' | 'potato') => {
    const presets: Record<string, PerformanceConfig> = {
      ultra: {
        animations: 'full',
        particles: 'full',
        shadows: true,
        antialiasing: true,
        pixelRatio: Math.min(window.devicePixelRatio, 3),
        maxFPS: 120,
        renderDistance: 200,
        textureQuality: 'high'
      },
      high: {
        animations: 'full',
        particles: 'full',
        shadows: true,
        antialiasing: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        maxFPS: 60,
        renderDistance: 100,
        textureQuality: 'high'
      },
      medium: {
        animations: 'reduced',
        particles: 'reduced',
        shadows: true,
        antialiasing: true,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        maxFPS: 30,
        renderDistance: 75,
        textureQuality: 'medium'
      },
      low: {
        animations: 'minimal',
        particles: 'minimal',
        shadows: false,
        antialiasing: false,
        pixelRatio: 1,
        maxFPS: 20,
        renderDistance: 50,
        textureQuality: 'low'
      },
      potato: {
        animations: 'off',
        particles: 'off',
        shadows: false,
        antialiasing: false,
        pixelRatio: 0.5,
        maxFPS: 15,
        renderDistance: 25,
        textureQuality: 'low'
      }
    };
    
    setConfig(presets[preset]);
  }, []);

  return {
    metrics,
    config,
    setConfig,
    setPreset,
    forceGC,
    isLowEnd: metrics.deviceType === 'mobile' && metrics.memory > 0.9 && metrics.batteryLevel < 0.1, // Much more strict
    isCritical: metrics.thermalState === 'critical' && metrics.fps < 10, // Only truly critical
    shouldReduceMotion: config.animations === 'off'
  };
}