import { useSyncExternalStore } from "react"
import { getServerDashboardTheme, readDashboardTheme, subscribeDashboardTheme, type DashboardTheme } from "./dashboard-theme"

/** Current dashboard accent + mode; re-renders live on any change (this tab or another tab). */
export function useDashboardTheme(): DashboardTheme {
  return useSyncExternalStore(subscribeDashboardTheme, readDashboardTheme, getServerDashboardTheme)
}
