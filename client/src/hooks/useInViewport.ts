import { useState, useEffect, useRef, type RefObject } from 'react';

/**
 * Returns true only when the element is visible in the viewport.
 * On mobile, 3D canvases use this to unmount when scrolled off-screen,
 * freeing GPU resources so at most ~1 WebGL context is active at a time.
 *
 * @param rootMargin  Extra margin around viewport (e.g. "200px" to pre-load)
 * @param once        If true, stays true once visible (don't unmount)
 */
export function useInViewport(
  rootMargin = '200px',
  once = false
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, isVisible];
}
