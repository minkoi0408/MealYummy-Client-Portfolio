import { useRef, useState, useEffect } from 'react';

/**
 * Hook that tracks whether an element is visible in the viewport.
 * Used to pause heavy 3D scenes when off-screen to save GPU/CPU.
 */
export function useVisibility(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin: '200px', ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [options]);

    return { ref, isVisible };
}
