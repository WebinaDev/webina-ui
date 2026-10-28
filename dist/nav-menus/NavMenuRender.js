"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { navItemHref, navVisibilityClass } from "./core";
const PlainLink = ({ children, ...p }) => _jsx("a", { ...p, children: children });
/** Bind the app's router link (e.g. next/link) and href scheme once around the storefront chrome. */
export const NavRenderContext = createContext({ Link: PlainLink });
export function NavRenderProvider({ Link, hrefOptions, children }) {
    return _jsx(NavRenderContext.Provider, { value: { Link: Link ?? PlainLink, hrefOptions }, children: children });
}
/** Storefront renderers for «منوها» items (header links, dropdowns, mega panel, drawer, footer). */
export function NavItemIcon({ icon }) {
    if (!icon)
        return null;
    if (/^(https?:)?\/|^data:image\//.test(icon))
        return _jsx("img", { src: icon, alt: "", width: 18, height: 18, loading: "lazy", decoding: "async", className: "sfc-navmenu__icon" });
    return _jsx("span", { className: "sfc-navmenu__icon", "aria-hidden": "true", children: icon.length <= 3 ? icon : null });
}
export function NavItemBadge({ item }) {
    if (!item.badge)
        return null;
    return (_jsx("span", { className: "sfc-navmenu__badge", style: { background: item.badge_color || "#ef4444" }, children: item.badge }));
}
export function NavItemLink({ item, className, onNavigate, children }) {
    const { Link, hrefOptions } = useContext(NavRenderContext);
    const href = navItemHref(item, hrefOptions);
    const ext = item.new_tab ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (_jsx(Link, { href: href, className: [className, navVisibilityClass(item.visibility)].filter(Boolean).join(" "), onClick: onNavigate, ...ext, children: children ?? (_jsxs(_Fragment, { children: [_jsx(NavItemIcon, { icon: item.icon }), _jsx("span", { children: item.label }), _jsx(NavItemBadge, { item: item })] })) }));
}
/** Desktop header link with a hover dropdown for sub-items. */
export function NavHeaderItem({ item, icon }) {
    const kids = item.children ?? [];
    if (!kids.length) {
        return (_jsxs(NavItemLink, { item: item, children: [item.icon ? _jsx(NavItemIcon, { icon: item.icon }) : icon ? _jsx("span", { className: "sfc-header__link-icon", children: icon }) : null, _jsx("span", { children: item.label }), _jsx(NavItemBadge, { item: item })] }));
    }
    return (_jsxs("div", { className: `sfc-navmenu__drop group relative ${navVisibilityClass(item.visibility)}`, children: [_jsxs(NavItemLink, { item: item, children: [item.icon ? _jsx(NavItemIcon, { icon: item.icon }) : icon ? _jsx("span", { className: "sfc-header__link-icon", children: icon }) : null, _jsx("span", { children: item.label }), _jsx(NavItemBadge, { item: item }), _jsx("span", { "aria-hidden": "true", className: "text-[10px] opacity-60", children: "\u25BE" })] }), _jsx("div", { className: "invisible absolute start-0 top-full z-50 min-w-48 rounded-xl border bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100", children: kids.map((c) => (_jsxs("div", { children: [_jsx(NavItemLink, { item: c, className: "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm hover:bg-black/5" }), (c.children ?? []).map((g) => (_jsx(NavItemLink, { item: g, className: "flex items-center gap-1.5 rounded-lg px-6 py-1.5 text-xs text-black/60 hover:bg-black/5" }, g.id)))] }, c.id))) })] }));
}
/** Mega panel driven by a menu (same look as the category mega menu). */
export function NavMegaPanel({ items, onClose }) {
    const [active, setActive] = useState(0);
    const cur = items[active] ?? items[0];
    const rows = [];
    for (const c of cur?.children ?? []) {
        rows.push({ key: `l2-${c.id}`, item: c, level: 2 });
        for (const g of c.children ?? [])
            rows.push({ key: `l3-${g.id}`, item: g, level: 3 });
    }
    return (_jsxs("div", { className: "sfc-mega__panel", role: "menu", "aria-label": "\u0645\u0646\u0648", children: [_jsx("ul", { className: "sfc-mega__parents", role: "tablist", children: items.map((it, i) => (_jsx("li", { role: "none", onMouseEnter: () => setActive(i), onFocus: () => setActive(i), children: _jsx(NavItemLink, { item: it, className: i === active ? "is-active" : "", onNavigate: onClose, children: _jsxs("span", { className: "sfc-mega__parent-label", children: [_jsx(NavItemIcon, { icon: it.icon }), _jsx("span", { children: it.label }), _jsx(NavItemBadge, { item: it })] }) }) }, it.id))) }), _jsxs("div", { className: "sfc-mega__childs", children: [cur ? (_jsxs(NavItemLink, { item: cur, className: "sfc-mega__all", onNavigate: onClose, children: ["\u0647\u0645\u0647 ", cur.label] })) : null, rows.length ? (_jsx("ul", { className: "sfc-mega__level2", children: rows.map((r) => (_jsx("li", { className: r.level === 2 ? "sfc-mega__l2" : "sfc-mega__l3", children: _jsx(NavItemLink, { item: r.item, className: r.level === 2 ? "sfc-mega__l2-link" : "sfc-mega__l3-link", onNavigate: onClose }) }, r.key))) })) : null] })] }));
}
/** Mobile drawer list with expandable sub-menus. */
export function NavDrawerList({ items, onNavigate }) {
    const [open, setOpen] = useState(null);
    return (_jsx(_Fragment, { children: items.map((it) => {
            const kids = it.children ?? [];
            const isOpen = open === it.id;
            return (_jsxs("div", { className: `sfc-drawer__cat ${navVisibilityClass(it.visibility)}`, children: [_jsxs("div", { className: "sfc-drawer__cat-row", children: [_jsx(NavItemLink, { item: it, onNavigate: onNavigate }), kids.length ? (_jsx("button", { type: "button", "aria-expanded": isOpen, "aria-label": "\u0632\u06CC\u0631\u0645\u0646\u0648", onClick: () => setOpen(isOpen ? null : it.id), children: isOpen ? "−" : "+" })) : null] }), isOpen ? (_jsx("div", { className: "sfc-drawer__sub", children: kids.map((c) => (_jsx(NavItemLink, { item: c, onNavigate: onNavigate }, c.id))) })) : null] }, it.id));
        }) }));
}
