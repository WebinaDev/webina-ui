/**
 * Builder Phase 8 — kit presets: one-click full design kits (colours + button variants + palette).
 * Pure and structural: works with any globals object that has `colors`, `palette` and `buttons.variants`,
 * so Dashboard and ERP share it without sharing their BuilderGlobals type. Fonts stay Yekan Bakh.
 */
export type KitColors = {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    muted: string;
    success: string;
    danger: string;
};
export type KitPreset = {
    id: string;
    name: string;
    colors: KitColors;
    radius: string;
};
export declare const KIT_PRESETS: KitPreset[];
type Variant = {
    background: string;
    color: string;
    hoverBackground: string;
    hoverColor: string;
    border?: string;
};
type KitTarget = {
    colors: Record<string, string>;
    palette: {
        id: string;
        name: string;
        value: string;
    }[];
    buttons: {
        radius: string;
        variants: Record<string, Variant>;
    };
};
/** Darken/lighten a #rrggbb colour by `amount` (-1..1). Non-hex input is returned unchanged. */
export declare function shadeHex(hex: string, amount: number): string;
/** Returns a new globals object with the preset applied; every other key (fonts, classes, components...) is kept. */
export declare function applyKitPreset<G extends KitTarget>(globals: G, preset: KitPreset): G;
export {};
//# sourceMappingURL=kit-presets.d.ts.map