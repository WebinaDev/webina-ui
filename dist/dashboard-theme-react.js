import { useSyncExternalStore } from "react";
import { getServerDashboardTheme, readDashboardTheme, subscribeDashboardTheme } from "./dashboard-theme";
/** Current dashboard accent + mode; re-renders live on any change (this tab or another tab). */
export function useDashboardTheme() {
    return useSyncExternalStore(subscribeDashboardTheme, readDashboardTheme, getServerDashboardTheme);
}
