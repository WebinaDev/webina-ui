/**
 * Builder Phase 9 — interaction helpers shared by renderers: run heavy animations (Lottie, video) only while
 * visible and never when the visitor prefers reduced motion. DOM-only; safe to import on the server.
 */
export function prefersReducedMotion() {
    return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/** Calls onChange(true/false) as `el` enters/leaves the viewport. Returns a cleanup. Falls back to "visible". */
export function observeVisibility(el, onChange, rootMargin = "200px") {
    if (typeof IntersectionObserver === "undefined") {
        onChange(true);
        return () => undefined;
    }
    const io = new IntersectionObserver((items) => {
        for (const item of items)
            onChange(item.isIntersecting);
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
}
