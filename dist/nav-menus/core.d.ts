/** «منوها» — shared types/helpers for the admin Menus section, the builder nav widget and the storefront. */
export type NavItemType = "custom" | "page" | "category" | "brand" | "product" | "post";
export type NavVisibility = "all" | "guest" | "logged_in" | "desktop" | "mobile" | "hidden";
export type NavMenuItem = {
    id: string;
    label: string;
    type: NavItemType;
    ref?: string;
    ref_id?: number;
    url?: string;
    icon?: string;
    badge?: string;
    badge_color?: string;
    new_tab?: boolean;
    mega?: boolean;
    visibility?: NavVisibility;
    children?: NavMenuItem[];
};
export type NavMenu = {
    id: number;
    name: string;
    slug: string;
    items: NavMenuItem[] | null;
    locations: string[] | null;
};
export declare const NAV_LOCATIONS: {
    key: string;
    label: string;
}[];
export declare const NAV_TYPES: {
    key: NavItemType;
    label: string;
}[];
export declare const NAV_VISIBILITY: {
    key: NavVisibility;
    label: string;
}[];
/** Per-app overrides for typed links (e.g. the store's category permalink scheme). */
export type NavHrefOptions = {
    category?: (slug: string) => string;
};
/** Storefront URL for a menu item — root permalinks, never /pages/. */
export declare function navItemHref(it: Pick<NavMenuItem, "type" | "ref" | "url">, opts?: NavHrefOptions): string;
export declare function newNavItemId(): string;
/** CSS classes for device-only visibility; guest/logged-in filtered by {@link filterNavItems}. */
export declare function navVisibilityClass(v?: NavVisibility): string;
/** `loggedIn` null = auth unknown (builder widgets): only hidden items are dropped. */
export declare function filterNavItems(items: NavMenuItem[], loggedIn: boolean | null): NavMenuItem[];
/** Flatten a menu to simple `{label, href}` links for legacy consumers (header nav, footer columns). */
export declare function navItemsToLinks(items: NavMenuItem[], opts?: NavHrefOptions): {
    label: string;
    href: string;
    newTab?: boolean;
    icon?: string;
    badge?: string;
    badgeColor?: string;
    children?: {
        label: string;
        href: string;
        newTab?: boolean;
    }[];
}[];
export type PublicNavMenus = {
    menus: Record<string, {
        id: number;
        name: string;
        items: NavMenuItem[];
    }>;
    locations: Record<string, string>;
};
export type NavTreeNode = {
    label: string;
    href: string;
    newTab?: boolean;
    children: NavTreeNode[];
};
export declare function navItemsToTree(items: NavMenuItem[], opts?: NavHrefOptions): NavTreeNode[];
/** Items for a location key or explicit slug from a public payload; null = nothing assigned (caller falls back). */
export declare function pickNavMenuItems(all: PublicNavMenus | null, opts: {
    location?: string;
    slug?: string;
}): NavMenuItem[] | null;
/** Merge an edited menu into a public payload (live previews while editing). */
export declare function primeNavMenus(base: PublicNavMenus, slug: string, menu: {
    id: number;
    name: string;
    items: NavMenuItem[];
}, locations?: string[]): PublicNavMenus;
export declare const NAV_MAX_DEPTH = 3;
export type NavPath = number[];
export type NavDropPos = "before" | "after" | "inside";
export declare function navGetAt(items: NavMenuItem[], path: NavPath): NavMenuItem | undefined;
export declare function navRemoveAt(items: NavMenuItem[], path: NavPath): [NavMenuItem[], NavMenuItem | undefined];
export declare function navInsertAt(items: NavMenuItem[], path: NavPath, node: NavMenuItem): NavMenuItem[];
export declare function navUpdateAt(items: NavMenuItem[], path: NavPath, patch: Partial<NavMenuItem>): NavMenuItem[];
export declare function navDepthOf(node: NavMenuItem): number;
/** Move `from` to a drop position relative to `to`; returns null when invalid (into itself / too deep). */
export declare function moveNavItem(items: NavMenuItem[], from: NavPath, to: NavPath, pos: NavDropPos): NavMenuItem[] | null;
//# sourceMappingURL=core.d.ts.map