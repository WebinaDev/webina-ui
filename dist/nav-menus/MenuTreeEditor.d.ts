import { type NavHrefOptions, type NavItemType, type NavMenuItem } from "./core";
/**
 * WordPress-style menu tree editor (drag-and-drop reorder + nesting, max 3 levels), Tailwind-classed, RTL.
 * Used by the admin «منوها» page and the page-builder nav widget so both edit the same data.
 */
export type NavSourceRow = {
    id: number;
    label: string;
    slug: string;
};
export type NavSourceSearch = (type: NavItemType, q: string) => Promise<NavSourceRow[]>;
export type MenuTreeEditorProps = {
    items: NavMenuItem[];
    onChange: (items: NavMenuItem[]) => void;
    compact?: boolean;
    /** Link picker search for typed items (pages, categories, …); omit to allow custom URLs only in practice. */
    searchSources?: NavSourceSearch;
    hrefOptions?: NavHrefOptions;
};
export declare function MenuTreeEditor({ items, onChange, compact, searchSources, hrefOptions }: MenuTreeEditorProps): import("react").JSX.Element;
//# sourceMappingURL=MenuTreeEditor.d.ts.map