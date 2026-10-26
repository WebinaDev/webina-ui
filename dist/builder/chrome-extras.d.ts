import type { SharedFieldDef } from "./types";
export declare const NAV_TYPES: Set<string>;
export declare const FOOTER_TYPES: Set<string>;
/** Shared hide-by-device values; same breakpoints everywhere (tablet ≤1024px, mobile ≤767px). */
export declare const HIDE_ON_OPTIONS: {
    value: string;
    label: string;
}[];
export type HideOn = "" | "mobile" | "tablet";
/** Class for a `*HideOn` value; pair with `@webina/ui/styles/hide-on.css`. */
export declare const hideOnClass: (v: unknown) => string;
/** Field factory for a generic per-device visibility select. */
export declare const hideOnField: (key: string, label: string) => SharedFieldDef;
export declare const NAV_EXTRA_FIELDS: SharedFieldDef[];
export declare const FOOTER_EXTRA_FIELDS: SharedFieldDef[];
type WithFields = {
    type: string;
    fields: unknown[];
};
/** Append the shared chrome settings to header/footer defs in place (idempotent). */
export declare function applyChromeExtras<D extends WithFields>(defs: D[]): D[];
export {};
//# sourceMappingURL=chrome-extras.d.ts.map