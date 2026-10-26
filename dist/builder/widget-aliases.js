import data from "./data/widget-aliases.json";
/** Legacy builder widget type -> current type (shared with PHP backends via the JSON file). */
export const WIDGET_ALIASES = data.aliases;
export function resolveWidgetAlias(type) {
    return WIDGET_ALIASES[type] ?? type;
}
