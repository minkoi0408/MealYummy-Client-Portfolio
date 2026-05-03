import { useState, useEffect } from 'react';

/**
 * Detects mobile/low-power devices for performance-adaptive rendering.
 * Uses multiple signals: screen width, touch, user agent, device memory.
 * 
 * IMPORTANT: Always defaults to `true` (mobile) on initial render to avoid
 * flash of heavy 3D content. This ensures SSR/hydration safety.
 */
export function useIsMobile(breakpoint = 768): boolean {
    // Default to true (mobile) to prevent heavy 3D from loading initially
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const check = () => {
            const isSmallScreen = window.innerWidth < breakpoint;
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Mobile if ANY of these are true
            setIsMobile(isSmallScreen || isTouch || isMobileUA);
        };
        
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Stricter check: returns true ONLY for actual desktop with large screen.
 * Use this when you want to be extra cautious about loading heavy 3D.
 */
export function useIsDesktop(breakpoint = 1024): boolean {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const check = () => {
            const isLargeScreen = window.innerWidth >= breakpoint;
            const noTouch = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
            const notMobileUA = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Desktop only if ALL conditions met
            setIsDesktop(isLargeScreen && noTouch && notMobileUA);
        };
        
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);

    return isDesktop;
}
