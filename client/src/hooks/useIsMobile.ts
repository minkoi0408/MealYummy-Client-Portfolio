import { useState, useEffect } from 'react';

/**
 * Detects mobile/low-power devices for performance-adaptive rendering.
 * Checks screen width, touch capability, and GPU tier heuristics.
 */
export function useIsMobile(breakpoint = 768): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < breakpoint || 'ontouchstart' in window;
    });

    useEffect(() => {
        const check = () => {
            setIsMobile(window.innerWidth < breakpoint || 'ontouchstart' in window);
        };
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);

    return isMobile;
}

/**
 * More aggressive check: true for any device with weak GPU.
 * Uses navigator.hardwareConcurrency and deviceMemory as heuristics.
 */
export function useIsLowEnd(): boolean {
    const [isLowEnd, setIsLowEnd] = useState(false);

    useEffect(() => {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
        const isTouchDevice = 'ontouchstart' in window;
        const isSmallScreen = window.innerWidth < 768;

        // Low-end: touch device OR < 4 cores OR < 4GB RAM OR small screen
        setIsLowEnd(isTouchDevice || cores < 4 || memory < 4 || isSmallScreen);
    }, []);

    return isLowEnd;
}
