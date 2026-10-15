/** Shared motion/theme helpers for builder widgets (schemas + CSS class names).
 * Platforms attach entrance animations via AdvancedProps; these helpers keep labels/classes in sync. */
import { type SharedOption } from "./types";
export declare const ENTRANCE_ANIMATION_OPTIONS: SharedOption[];
export declare const HOVER_ANIMATION_OPTIONS: SharedOption[];
/** CSS class for an entrance animation (platforms pair with `.wb-anim` + IntersectionObserver). */
export declare function entranceAnimClass(name: string | null | undefined): string;
/** Editor fields platforms can append for per-widget motion shortcuts (optional). */
export declare function sharedMotionFields(): {
    kind: "select";
    key: string;
    label: string;
    options: SharedOption[];
}[];
/** Defaults for section/column background video (store under advanced.background on the platform). */
export declare function defaultBackgroundVideo(): {
    video: string;
    poster: string;
    overlay: string;
    overlayOpacity: number;
};
//# sourceMappingURL=motion.d.ts.map