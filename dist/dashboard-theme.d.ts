/**
 * Live dashboard theme (accent + light/dark) for embedded editors such as the page builder.
 *
 * The dashboard stores the accent in localStorage `theme_accent` (applied as `<html data-accent>`)
 * and the mode in `theme_mode` via next-themes (applied as `<html class="dark">`).
 * `subscribeDashboardTheme` reacts to every way these can change without a reload:
 *  - same tab: MutationObserver on <html> class / data-accent, and the `webina:dashboard-theme` event
 *  - other tabs: the `storage` event and a BroadcastChannel
 *  - OS scheme flips while mode is "system": matchMedia
 */
export type DashboardThemeMode = "light" | "dark" | "system";
export type DashboardTheme = {
    accent: string;
    mode: DashboardThemeMode;
    resolvedMode: "light" | "dark";
};
export declare const DASHBOARD_ACCENT_STORAGE_KEY = "theme_accent";
export declare const DASHBOARD_MODE_STORAGE_KEY = "theme_mode";
export declare const DASHBOARD_THEME_EVENT = "webina:dashboard-theme";
export declare const DASHBOARD_THEME_CHANNEL = "webina-dashboard-theme";
/** Option value builder colour pickers can store: follows the dashboard accent in the editor, falls back to the site primary elsewhere. */
export declare const DASHBOARD_ACCENT_TOKEN = "var(--wb-dashboard-accent, var(--wb-color-primary))";
export declare const DASHBOARD_ACCENT_FOREGROUND_TOKEN = "var(--wb-dashboard-accent-foreground, #fff)";
export declare function readDashboardTheme(): DashboardTheme;
export declare function getServerDashboardTheme(): DashboardTheme;
/** Announce a dashboard theme change to this tab and every other open tab. */
export declare function broadcastDashboardTheme(patch: Partial<Pick<DashboardTheme, "accent" | "mode">>): void;
/**
 * Listen for theme changes made in other tabs (storage + BroadcastChannel) and hand them to the
 * dashboard's own setters so <html> is updated here too.
 */
export declare function onRemoteDashboardTheme(handler: (patch: Partial<Pick<DashboardTheme, "accent" | "mode">>) => void): () => void;
/** Subscribe to any dashboard theme change (same tab or other tabs). Returns an unsubscribe. */
export declare function subscribeDashboardTheme(callback: () => void): () => void;
/** Data attributes that scope dashboard tokens to an element (e.g. the builder editor chrome). */
export declare function dashboardThemeAttributes(theme: DashboardTheme): {
    "data-accent": string;
    "data-wd-mode": "light" | "dark";
};
//# sourceMappingURL=dashboard-theme.d.ts.map