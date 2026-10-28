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
export type DashboardThemeMode = "light" | "dark" | "system"

export type DashboardTheme = {
  accent: string
  mode: DashboardThemeMode
  resolvedMode: "light" | "dark"
}

export const DASHBOARD_ACCENT_STORAGE_KEY = "theme_accent"
export const DASHBOARD_MODE_STORAGE_KEY = "theme_mode"
export const DASHBOARD_THEME_EVENT = "webina:dashboard-theme"
export const DASHBOARD_THEME_CHANNEL = "webina-dashboard-theme"

/** Option value builder colour pickers can store: follows the dashboard accent in the editor, falls back to the site primary elsewhere. */
export const DASHBOARD_ACCENT_TOKEN = "var(--wb-dashboard-accent, var(--wb-color-primary))"
export const DASHBOARD_ACCENT_FOREGROUND_TOKEN = "var(--wb-dashboard-accent-foreground, #fff)"

const SERVER_THEME: DashboardTheme = { accent: "colorful", mode: "system", resolvedMode: "light" }

function storedMode(): DashboardThemeMode {
  try {
    const value = window.localStorage.getItem(DASHBOARD_MODE_STORAGE_KEY)
    return value === "light" || value === "dark" ? value : "system"
  } catch {
    return "system"
  }
}

let cached: DashboardTheme = SERVER_THEME

export function readDashboardTheme(): DashboardTheme {
  if (typeof document === "undefined") return SERVER_THEME
  const root = document.documentElement
  let accent = root.getAttribute("data-accent")
  if (!accent) {
    try {
      accent = window.localStorage.getItem(DASHBOARD_ACCENT_STORAGE_KEY)
    } catch {
      accent = null
    }
  }
  const next: DashboardTheme = {
    accent: accent || "colorful",
    mode: storedMode(),
    resolvedMode: root.classList.contains("dark") ? "dark" : "light",
  }
  // Stable identity for useSyncExternalStore.
  if (next.accent !== cached.accent || next.mode !== cached.mode || next.resolvedMode !== cached.resolvedMode) {
    cached = next
  }
  return cached
}

export function getServerDashboardTheme(): DashboardTheme {
  return SERVER_THEME
}

let channel: BroadcastChannel | null = null
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null
  channel ??= new BroadcastChannel(DASHBOARD_THEME_CHANNEL)
  return channel
}

/** Announce a dashboard theme change to this tab and every other open tab. */
export function broadcastDashboardTheme(patch: Partial<Pick<DashboardTheme, "accent" | "mode">>): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(DASHBOARD_THEME_EVENT, { detail: patch }))
  try {
    getChannel()?.postMessage(patch)
  } catch {
    /* ignore */
  }
}

/**
 * Listen for theme changes made in other tabs (storage + BroadcastChannel) and hand them to the
 * dashboard's own setters so <html> is updated here too.
 */
export function onRemoteDashboardTheme(handler: (patch: Partial<Pick<DashboardTheme, "accent" | "mode">>) => void): () => void {
  if (typeof window === "undefined") return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === DASHBOARD_ACCENT_STORAGE_KEY && event.newValue) handler({ accent: event.newValue })
    if (event.key === DASHBOARD_MODE_STORAGE_KEY && event.newValue) {
      const mode = event.newValue
      if (mode === "light" || mode === "dark" || mode === "system") handler({ mode })
    }
  }
  const bc = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(DASHBOARD_THEME_CHANNEL)
  const onMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === "object") handler(event.data)
  }
  window.addEventListener("storage", onStorage)
  bc?.addEventListener("message", onMessage)
  return () => {
    window.removeEventListener("storage", onStorage)
    bc?.removeEventListener("message", onMessage)
    bc?.close()
  }
}

/** Subscribe to any dashboard theme change (same tab or other tabs). Returns an unsubscribe. */
export function subscribeDashboardTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-accent", "style"] })
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === DASHBOARD_ACCENT_STORAGE_KEY || event.key === DASHBOARD_MODE_STORAGE_KEY) callback()
  }
  const media = window.matchMedia?.("(prefers-color-scheme: dark)")
  window.addEventListener("storage", onStorage)
  window.addEventListener(DASHBOARD_THEME_EVENT, callback)
  media?.addEventListener?.("change", callback)
  return () => {
    observer.disconnect()
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(DASHBOARD_THEME_EVENT, callback)
    media?.removeEventListener?.("change", callback)
  }
}

/** Data attributes that scope dashboard tokens to an element (e.g. the builder editor chrome). */
export function dashboardThemeAttributes(theme: DashboardTheme): { "data-accent": string; "data-wd-mode": "light" | "dark" } {
  return { "data-accent": theme.accent, "data-wd-mode": theme.resolvedMode }
}
