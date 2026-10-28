/**
 * Builder Phase 9 — interaction helpers shared by renderers: run heavy animations (Lottie, video) only while
 * visible and never when the visitor prefers reduced motion. DOM-only; safe to import on the server.
 */
export declare function prefersReducedMotion(): boolean;
/** Calls onChange(true/false) as `el` enters/leaves the viewport. Returns a cleanup. Falls back to "visible". */
export declare function observeVisibility(el: Element, onChange: (visible: boolean) => void, rootMargin?: string): () => void;
//# sourceMappingURL=lazy-media.d.ts.map