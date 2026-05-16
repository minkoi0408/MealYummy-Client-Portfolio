import { type ReactNode, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePerformanceOptimizer } from '../../hooks/usePerformanceOptimizer';

interface AdaptiveComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  highPerformance?: ReactNode;
  mediumPerformance?: ReactNode;
  lowPerformance?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export function AdaptiveComponent({
  children,
  highPerformance,
  mediumPerformance,
  lowPerformance,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className = ''
}: Omit<AdaptiveComponentProps, 'fallback'>) {
  const { config, isCritical } = usePerformanceOptimizer();
  const { ref } = useInView({
    threshold,
    rootMargin,
    triggerOnce
  });

  const content = useMemo(() => {
    // Only hide content if extremely critical performance
    if (isCritical && config.animations === 'off' && lowPerformance) {
      return lowPerformance;
    }

    // Default to showing the main content
    if (config.animations === 'full' && highPerformance) {
      return highPerformance;
    }

    if (config.animations === 'reduced' && mediumPerformance) {
      return mediumPerformance;
    }

    // Always fallback to children unless explicitly overridden
    return children;
  }, [
    isCritical,
    config.animations,
    children,
    highPerformance,
    mediumPerformance,
    lowPerformance
  ]);

  return (
    <div ref={ref} className={className}>
      {content}
    </div>
  );
}

// Specialized components for different performance levels
export function AdaptiveAnimation({ 
  children, 
  className = '',
  ...props 
}: AdaptiveComponentProps) {
  return (
    <AdaptiveComponent
      {...props}
      children={children}
      className={className}
      lowPerformance={<div className="animate-none">{children}</div>}
      mediumPerformance={<div className="animate-pulse">{children}</div>}
      highPerformance={children}
    />
  );
}

export function Adaptive3D({ 
  children, 
  fallback2D,
  className = '',
  ...props 
}: AdaptiveComponentProps & { fallback2D?: ReactNode }) {
  const { config, isCritical } = usePerformanceOptimizer();
  
  // Only use fallback in extreme cases
  if (isCritical && config.animations === 'off') {
    return (
      <div className={className}>
        {fallback2D || <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-lg p-8 text-center text-white">🍔 3D Content</div>}
      </div>
    );
  }

  // Always show 3D content unless critically overheating
  return (
    <AdaptiveComponent
      {...props}
      children={children}
      className={className}
      lowPerformance={children} // Still show 3D even on low performance
      mediumPerformance={children}
      highPerformance={children}
    />
  );
}

export function AdaptiveParticles({ 
  children, 
  className = '',
  ...props 
}: AdaptiveComponentProps) {
  const { config } = usePerformanceOptimizer();
  
  if (config.particles === 'off') {
    return null;
  }

  return (
    <AdaptiveComponent
      {...props}
      children={children}
      className={className}
      lowPerformance={null}
      mediumPerformance={<div className="opacity-50">{children}</div>}
      highPerformance={children}
    />
  );
}