/** Shared motion/theme helpers for builder widgets (schemas + CSS class names).
 * Platforms attach entrance animations via AdvancedProps; these helpers keep labels/classes in sync. */
import { SHARED_ENTRANCE_ANIMATIONS } from "./types";
export const ENTRANCE_ANIMATION_OPTIONS = SHARED_ENTRANCE_ANIMATIONS.map((value) => ({
    value,
    label: value === "none"
        ? "بدون انیمیشن"
        : value === "fade"
            ? "محو شدن"
            : value === "slide-up"
                ? "از پایین"
                : value === "slide-down"
                    ? "از بالا"
                    : value === "slide-start"
                        ? "از شروع (راست در RTL)"
                        : value === "slide-end"
                            ? "از پایان (چپ در RTL)"
                            : value === "zoom"
                                ? "بزرگ‌نمایی"
                                : value === "flip"
                                    ? "چرخش"
                                    : "پرش",
}));
export const HOVER_ANIMATION_OPTIONS = [
    { value: "none", label: "بدون" },
    { value: "grow", label: "بزرگ شدن" },
    { value: "shrink", label: "کوچک شدن" },
    { value: "float", label: "شناور" },
    { value: "pulse", label: "نبض" },
    { value: "rotate", label: "چرخش" },
];
/** CSS class for an entrance animation (platforms pair with `.wb-anim` + IntersectionObserver). */
export function entranceAnimClass(name) {
    const n = (name ?? "none");
    if (!n || n === "none" || !SHARED_ENTRANCE_ANIMATIONS.includes(n))
        return "";
    return `wb-anim wb-anim-${n}`;
}
/** Editor fields platforms can append for per-widget motion shortcuts (optional). */
export function sharedMotionFields() {
    return [
        { kind: "select", key: "entrance", label: "انیمیشن ورود", options: ENTRANCE_ANIMATION_OPTIONS },
        { kind: "select", key: "hoverAnim", label: "انیمیشن هاور", options: HOVER_ANIMATION_OPTIONS },
    ];
}
/** Defaults for section/column background video (store under advanced.background on the platform). */
export function defaultBackgroundVideo() {
    return { video: "", poster: "", overlay: "#000000", overlayOpacity: 0.35 };
}
