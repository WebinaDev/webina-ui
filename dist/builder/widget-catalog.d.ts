/**
 * Shared page-builder widget catalog (single source of truth for ERP + Dashboard editors).
 * Categories (order + labels) and widget type -> {category, icon}. Icons are lucide-react
 * PascalCase export names, unique per widget. Presentational only: never part of the builder schema.
 * Keys mirror registry widget types — never rename.
 */
export type CatalogCategoryId = "layout" | "basic" | "media" | "interactive" | "marketing" | "forms" | "chrome" | "shop" | "product" | "checkout" | "blog" | "academy" | "resume" | "poetry" | "cafe" | "webina" | "other";
export type CatalogCategory = {
    id: CatalogCategoryId;
    label: string;
    labelEn: string;
    icon: string;
};
export type CatalogEntry = {
    category: CatalogCategoryId;
    icon: string;
};
export declare const WIDGET_CATALOG_CATEGORIES: readonly CatalogCategory[];
export declare const WIDGET_CATALOG: Readonly<Record<string, CatalogEntry>>;
/** Resolve a widget's catalog entry; unknown module-prefixed keys fall into their module category. */
export declare function catalogEntry(type: string): CatalogEntry;
/** Group widget defs by catalog category (category order kept, empty groups dropped). */
export declare function groupWidgetsByCatalog<T extends {
    type: string;
}>(widgets: readonly T[]): {
    category: CatalogCategory;
    widgets: T[];
}[];
/** Every lucide icon name the catalog can return (for building a static icon import map). */
export declare function catalogIconNames(): string[];
//# sourceMappingURL=widget-catalog.d.ts.map