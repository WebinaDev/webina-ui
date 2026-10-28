"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, GripVertical, IndentDecrease, IndentIncrease, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_MAX_DEPTH, NAV_TYPES, NAV_VISIBILITY, moveNavItem, navGetAt, navItemHref, navRemoveAt, navUpdateAt, newNavItemId, } from "./core";
function SourcePicker({ type, onPick, search }) {
    const [q, setQ] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (type === "custom")
            return;
        let alive = true;
        const t = setTimeout(() => {
            setLoading(true);
            (search ? search(type, q) : Promise.resolve([]))
                .then((r) => alive && setRows(r ?? []))
                .catch(() => alive && setRows([]))
                .finally(() => alive && setLoading(false));
        }, 250);
        return () => {
            alive = false;
            clearTimeout(t);
        };
    }, [type, q, search]);
    if (type === "custom")
        return null;
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "\u062C\u0633\u062A\u062C\u0648\u2026", className: field }), _jsxs("div", { className: "max-h-40 overflow-auto rounded border bg-background text-xs", children: [loading ? _jsx("div", { className: "p-2 text-muted-foreground", children: "\u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC\u2026" }) : null, !loading && !rows.length ? _jsx("div", { className: "p-2 text-muted-foreground", children: "\u0645\u0648\u0631\u062F\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F" }) : null, rows.map((r) => (_jsx("button", { type: "button", className: "block w-full truncate px-2 py-1 text-start hover:bg-muted", onClick: () => onPick(r), children: r.label }, r.id)))] })] }));
}
const field = "h-8 w-full rounded-md border bg-background px-2 text-xs";
const iconBtn = "inline-flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-muted";
function ItemFields({ item, onPatch, search, hrefOptions }) {
    return (_jsxs("div", { className: "grid gap-2 border-t p-2 sm:grid-cols-2", children: [_jsxs("label", { className: "space-y-1 text-xs", children: [_jsx("span", { children: "\u0639\u0646\u0648\u0627\u0646" }), _jsx("input", { className: field, value: item.label, onChange: (e) => onPatch({ label: e.target.value }) })] }), _jsxs("label", { className: "space-y-1 text-xs", children: [_jsx("span", { children: "\u0646\u0648\u0639 \u0644\u06CC\u0646\u06A9" }), _jsx("select", { className: field, value: item.type, onChange: (e) => onPatch({ type: e.target.value, ref: undefined, ref_id: undefined }), children: NAV_TYPES.map((t) => (_jsx("option", { value: t.key, children: t.label }, t.key))) })] }), item.type === "custom" ? (_jsxs("label", { className: "space-y-1 text-xs sm:col-span-2", children: [_jsx("span", { children: "\u0622\u062F\u0631\u0633 (\u0645\u062B\u0644\u0627\u064B \u200E/about \u06CC\u0627 https://\u2026)" }), _jsx("input", { dir: "ltr", className: field, value: item.url ?? "", onChange: (e) => onPatch({ url: e.target.value.replace(/^\/pages\//, "/") }) })] })) : (_jsxs("div", { className: "space-y-1 text-xs sm:col-span-2", children: [_jsxs("span", { children: ["\u0645\u0642\u0635\u062F: ", _jsx("b", { dir: "ltr", children: item.ref ? navItemHref(item, hrefOptions) : "—" })] }), _jsx(SourcePicker, { search: search, type: item.type, onPick: (r) => onPatch({ ref: r.slug, ref_id: r.id, label: item.label || r.label }) })] })), _jsxs("label", { className: "space-y-1 text-xs", children: [_jsx("span", { children: "\u0622\u06CC\u06A9\u0646 (\u0646\u0627\u0645 lucide \u06CC\u0627 \u0622\u062F\u0631\u0633 \u062A\u0635\u0648\u06CC\u0631)" }), _jsx("input", { dir: "ltr", className: field, value: item.icon ?? "", onChange: (e) => onPatch({ icon: e.target.value || undefined }) })] }), _jsxs("div", { className: "grid grid-cols-[1fr_auto] gap-1 text-xs", children: [_jsxs("label", { className: "space-y-1", children: [_jsx("span", { children: "\u0646\u0634\u0627\u0646 (\u0645\u062B\u0644\u0627\u064B \u00AB\u062C\u062F\u06CC\u062F\u00BB)" }), _jsx("input", { className: field, value: item.badge ?? "", onChange: (e) => onPatch({ badge: e.target.value || undefined }) })] }), _jsxs("label", { className: "space-y-1", children: [_jsx("span", { children: "\u0631\u0646\u06AF" }), _jsx("input", { type: "color", className: "h-8 w-10 rounded border", value: item.badge_color ?? "#ef4444", onChange: (e) => onPatch({ badge_color: e.target.value }) })] })] }), _jsxs("label", { className: "space-y-1 text-xs", children: [_jsx("span", { children: "\u0646\u0645\u0627\u06CC\u0634" }), _jsx("select", { className: field, value: item.visibility ?? "all", onChange: (e) => onPatch({ visibility: e.target.value }), children: NAV_VISIBILITY.map((v) => (_jsx("option", { value: v.key, children: v.label }, v.key))) })] }), _jsxs("div", { className: "flex flex-wrap items-end gap-3 text-xs", children: [_jsxs("label", { className: "flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: !!item.new_tab, onChange: (e) => onPatch({ new_tab: e.target.checked || undefined }) }), "\u0628\u0627\u0632 \u0634\u062F\u0646 \u062F\u0631 \u062A\u0628 \u062C\u062F\u06CC\u062F"] }), _jsxs("label", { className: "flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: !!item.mega, onChange: (e) => onPatch({ mega: e.target.checked || undefined }) }), "\u0645\u06AF\u0627\u0645\u0646\u0648"] })] })] }));
}
export function MenuTreeEditor({ items, onChange, compact = false, searchSources, hrefOptions }) {
    const [open, setOpen] = useState(null);
    const [drag, setDrag] = useState(null);
    const [over, setOver] = useState(null);
    const addRoot = () => {
        const it = { id: newNavItemId(), label: "آیتم جدید", type: "custom", url: "/" };
        onChange([...items, it]);
        setOpen(it.id);
    };
    const onDragOver = (e, path) => {
        if (!drag)
            return;
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        const y = (e.clientY - r.top) / r.height;
        // In RTL, dragging further to the inline-start (left) nests under the hovered row.
        const indent = document.documentElement.dir === "rtl" ? r.right - e.clientX > 48 : e.clientX - r.left > 48;
        const pos = y < 0.3 ? "before" : y > 0.7 && !indent ? "after" : path.length < NAV_MAX_DEPTH ? "inside" : "after";
        setOver({ key: path.join("."), pos });
    };
    const onDrop = (e, path) => {
        e.preventDefault();
        if (drag && over) {
            const next = moveNavItem(items, drag, path, over.pos);
            if (next)
                onChange(next);
        }
        setDrag(null);
        setOver(null);
    };
    const shift = (path, dir) => {
        const i = path[path.length - 1];
        let next = null;
        if (dir === "up" && i > 0)
            next = moveNavItem(items, path, [...path.slice(0, -1), i - 1], "before");
        if (dir === "down") {
            const sib = [...path.slice(0, -1), i + 1];
            if (navGetAt(items, sib))
                next = moveNavItem(items, path, sib, "after");
        }
        if (dir === "in" && i > 0)
            next = moveNavItem(items, path, [...path.slice(0, -1), i - 1], "inside");
        if (dir === "out" && path.length > 1)
            next = moveNavItem(items, path, path.slice(0, -1), "after");
        if (next)
            onChange(next);
    };
    const renderList = (list, parent) => (_jsx("ul", { className: parent.length ? "ms-5 mt-1 space-y-1 border-s ps-2" : "space-y-1", children: list.map((it, i) => {
            const path = [...parent, i];
            const key = path.join(".");
            const isOver = over?.key === key;
            const expanded = open === it.id;
            return (_jsxs("li", { children: [_jsxs("div", { draggable: true, onDragStart: (e) => {
                            e.stopPropagation();
                            e.dataTransfer.effectAllowed = "move";
                            setDrag(path);
                        }, onDragEnd: () => {
                            setDrag(null);
                            setOver(null);
                        }, onDragOver: (e) => {
                            e.stopPropagation();
                            onDragOver(e, path);
                        }, onDrop: (e) => {
                            e.stopPropagation();
                            onDrop(e, path);
                        }, className: [
                            "rounded-md border bg-card",
                            isOver && over?.pos === "before" ? "border-t-2 border-t-primary" : "",
                            isOver && over?.pos === "after" ? "border-b-2 border-b-primary" : "",
                            isOver && over?.pos === "inside" ? "ring-2 ring-primary/50" : "",
                        ].join(" "), children: [_jsxs("div", { className: "flex items-center gap-1 p-1.5 text-sm", children: [_jsx(GripVertical, { className: "size-4 shrink-0 cursor-grab text-muted-foreground", "aria-hidden": true }), _jsxs("button", { type: "button", className: "flex min-w-0 flex-1 items-center gap-1 text-start", onClick: () => setOpen(expanded ? null : it.id), children: [expanded ? _jsx(ChevronDown, { className: "size-3.5" }) : _jsx(ChevronLeft, { className: "size-3.5" }), _jsx("span", { className: "truncate font-medium", children: it.label || "بدون عنوان" }), it.badge ? (_jsx("span", { className: "rounded px-1 text-[10px] text-white", style: { background: it.badge_color || "#ef4444" }, children: it.badge })) : null, !compact ? _jsx("span", { className: "truncate text-xs text-muted-foreground", children: NAV_TYPES.find((t) => t.key === it.type)?.label }) : null, it.visibility && it.visibility !== "all" ? _jsx("span", { className: "text-[10px] text-amber-600", children: NAV_VISIBILITY.find((v) => v.key === it.visibility)?.label }) : null] }), _jsx("button", { type: "button", className: iconBtn, title: "\u0628\u0627\u0644\u0627", onClick: () => shift(path, "up"), children: _jsx(ArrowUp, { className: "size-3.5" }) }), _jsx("button", { type: "button", className: iconBtn, title: "\u067E\u0627\u06CC\u06CC\u0646", onClick: () => shift(path, "down"), children: _jsx(ArrowDown, { className: "size-3.5" }) }), _jsx("button", { type: "button", className: iconBtn, title: "\u0632\u06CC\u0631\u0645\u0646\u0648\u06CC \u0622\u06CC\u062A\u0645 \u0642\u0628\u0644\u06CC", onClick: () => shift(path, "in"), children: _jsx(IndentIncrease, { className: "size-3.5 rtl:-scale-x-100" }) }), _jsx("button", { type: "button", className: iconBtn, title: "\u062E\u0631\u0648\u062C \u0627\u0632 \u0632\u06CC\u0631\u0645\u0646\u0648", onClick: () => shift(path, "out"), children: _jsx(IndentDecrease, { className: "size-3.5 rtl:-scale-x-100" }) }), path.length < NAV_MAX_DEPTH ? (_jsx("button", { type: "button", className: iconBtn, title: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0632\u06CC\u0631\u0645\u0646\u0648", onClick: () => {
                                            const child = { id: newNavItemId(), label: "زیرمنو", type: "custom", url: "/" };
                                            onChange(navUpdateAt(items, path, { children: [...(it.children ?? []), child] }));
                                            setOpen(child.id);
                                        }, children: _jsx(Plus, { className: "size-3.5" }) })) : null, _jsx("button", { type: "button", className: iconBtn + " text-destructive", title: "\u062D\u0630\u0641", onClick: () => onChange(navRemoveAt(items, path)[0]), children: _jsx(Trash2, { className: "size-3.5" }) })] }), expanded ? _jsx(ItemFields, { search: searchSources, hrefOptions: hrefOptions, item: it, onPatch: (p) => onChange(navUpdateAt(items, path, p)) }) : null] }), it.children?.length ? renderList(it.children, path) : null] }, it.id));
        }) }));
    return (_jsxs("div", { dir: "rtl", className: "space-y-2", children: [items.length ? renderList(items, []) : _jsx("p", { className: "rounded border border-dashed p-3 text-center text-xs text-muted-foreground", children: "\u0627\u06CC\u0646 \u0645\u0646\u0648 \u0647\u0646\u0648\u0632 \u0622\u06CC\u062A\u0645\u06CC \u0646\u062F\u0627\u0631\u062F." }), _jsxs("button", { type: "button", className: "inline-flex h-8 items-center gap-1 rounded-md border bg-background px-3 text-sm hover:bg-muted", onClick: addRoot, children: [_jsx(Plus, { className: "size-4" }), " \u0627\u0641\u0632\u0648\u062F\u0646 \u0622\u06CC\u062A\u0645"] }), _jsx("p", { className: "text-[11px] text-muted-foreground", children: "\u0628\u0631\u0627\u06CC \u062C\u0627\u0628\u0647\u200C\u062C\u0627\u06CC\u06CC \u0628\u06A9\u0634\u06CC\u062F \u0648 \u0631\u0647\u0627 \u06A9\u0646\u06CC\u062F\u061B \u0631\u0647\u0627 \u06A9\u0631\u062F\u0646 \u0631\u0648\u06CC \u0648\u0633\u0637 \u06CC\u06A9 \u0622\u06CC\u062A\u0645 \u0622\u0646 \u0631\u0627 \u0632\u06CC\u0631\u0645\u0646\u0648 \u0645\u06CC\u200C\u06A9\u0646\u062F." })] }));
}
