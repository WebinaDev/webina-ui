import { type ComponentType, type ReactNode } from "react";
import { type NavHrefOptions, type NavMenuItem } from "./core";
export type NavLinkComponent = ComponentType<{
    href: string;
    className?: string;
    onClick?: () => void;
    target?: string;
    rel?: string;
    children?: ReactNode;
}>;
/** Bind the app's router link (e.g. next/link) and href scheme once around the storefront chrome. */
export declare const NavRenderContext: import("react").Context<{
    Link: NavLinkComponent;
    hrefOptions?: NavHrefOptions;
}>;
export declare function NavRenderProvider({ Link, hrefOptions, children }: {
    Link?: NavLinkComponent;
    hrefOptions?: NavHrefOptions;
    children: ReactNode;
}): import("react").JSX.Element;
/** Storefront renderers for «منوها» items (header links, dropdowns, mega panel, drawer, footer). */
export declare function NavItemIcon({ icon }: {
    icon?: string;
}): import("react").JSX.Element | null;
export declare function NavItemBadge({ item }: {
    item: NavMenuItem;
}): import("react").JSX.Element | null;
export declare function NavItemLink({ item, className, onNavigate, children }: {
    item: NavMenuItem;
    className?: string;
    onNavigate?: () => void;
    children?: ReactNode;
}): import("react").JSX.Element;
/** Desktop header link with a hover dropdown for sub-items. */
export declare function NavHeaderItem({ item, icon }: {
    item: NavMenuItem;
    icon?: ReactNode;
}): import("react").JSX.Element;
/** Mega panel driven by a menu (same look as the category mega menu). */
export declare function NavMegaPanel({ items, onClose }: {
    items: NavMenuItem[];
    onClose: () => void;
}): import("react").JSX.Element;
/** Mobile drawer list with expandable sub-menus. */
export declare function NavDrawerList({ items, onNavigate }: {
    items: NavMenuItem[];
    onNavigate: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=NavMenuRender.d.ts.map