/**
 * Shared widget library catalog for Webina page builders (ERP + Dashboard).
 * Single source of truth for the editor palette: categories (order + labels) and one
 * distinct lucide icon (kebab-case name) per widget type. Purely presentational —
 * it never changes the builder document schema.
 */
export type WidgetCatalogCategoryId = "layout" | "text-media" | "header-footer" | "forms" | "marketing" | "shop" | "shop-parts" | "content" | "academy" | "resume" | "poetry" | "webina";
export type WidgetCatalogCategory = {
    id: WidgetCatalogCategoryId;
    label: string;
    icon: string;
};
export declare const WIDGET_CATALOG_CATEGORIES: readonly WidgetCatalogCategory[];
export type WidgetCatalogEntry = {
    category: WidgetCatalogCategoryId;
    icon: string;
};
/** widget type -> category + lucide icon. Icons are unique across widgets. */
export declare const WIDGET_CATALOG: Readonly<Record<string, WidgetCatalogEntry>>;
/** Fallback category for widget types not in the catalog (e.g. new or site-specific widgets). */
export declare const WIDGET_CATALOG_FALLBACK: WidgetCatalogEntry;
export declare function widgetCatalogEntry(type: string): WidgetCatalogEntry;
/** Group a list of widget defs by catalog category, preserving category order and dropping empty groups. */
export declare function groupWidgetsByCatalog<T extends {
    type: string;
}>(widgets: readonly T[]): {
    category: WidgetCatalogCategory;
    widgets: T[];
}[];
/** Every lucide icon name used by the catalog (for static import maps). */
export declare function widgetCatalogIconNames(): string[];
//# sourceMappingURL=widget-catalog.d.ts.map