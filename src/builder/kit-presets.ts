/**
 * Builder Phase 8 — kit presets: one-click full design kits (colours + button variants + palette).
 * Pure and structural: works with any globals object that has `colors`, `palette` and `buttons.variants`,
 * so Dashboard and ERP share it without sharing their BuilderGlobals type. Fonts stay Yekan Bakh.
 */
export type KitColors = {
  primary: string
  secondary: string
  text: string
  accent: string
  background: string
  surface: string
  border: string
  muted: string
  success: string
  danger: string
}

export type KitPreset = { id: string; name: string; colors: KitColors; radius: string }

const k = (id: string, name: string, radius: string, c: [string, string, string, string, string, string, string, string]): KitPreset => ({
  id,
  name,
  radius,
  colors: { primary: c[0], secondary: c[1], text: c[2], accent: c[3], background: c[4], surface: c[5], border: c[6], muted: c[7], success: "#1F8A70", danger: "#C2414A" },
})

export const KIT_PRESETS: KitPreset[] = [
  k("webina", "وبینا (پیش‌فرض)", "999px", ["#E16BA6", "#0C2D63", "#0C2D63", "#E16BA6", "#F5F8FB", "#FFFFFF", "#E6EEF6", "#5C6B82"]),
  k("firouzeh", "فیروزه‌ای", "12px", ["#0E9AA7", "#123B4A", "#123B4A", "#F6A01A", "#F3FAFB", "#FFFFFF", "#DCEFF1", "#58707A"]),
  k("zarshenas", "زرشکی و طلایی", "8px", ["#8E1B3A", "#2B1A12", "#2B1A12", "#C9A227", "#FBF7F2", "#FFFFFF", "#EFE3D6", "#7A6658"]),
  k("jangal", "جنگلی", "10px", ["#2F7D4F", "#183A2A", "#183A2A", "#D98E04", "#F4F8F3", "#FFFFFF", "#DDE9DE", "#5E7266"]),
  k("shab", "شب (تیره)", "12px", ["#7C8CFF", "#E7EAF6", "#E7EAF6", "#FF7AB6", "#0F1220", "#181C2E", "#2A3049", "#9AA3C0"]),
  k("minimal", "مینیمال", "4px", ["#111111", "#444444", "#111111", "#E4572E", "#FFFFFF", "#FAFAFA", "#E8E8E8", "#6B6B6B"]),
]

type Variant = { background: string; color: string; hoverBackground: string; hoverColor: string; border?: string }
type KitTarget = {
  colors: Record<string, string>
  palette: { id: string; name: string; value: string }[]
  buttons: { radius: string; variants: Record<string, Variant> }
}

/** Darken/lighten a #rrggbb colour by `amount` (-1..1). Non-hex input is returned unchanged. */
export function shadeHex(hex: string, amount: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const ch = (v: number) => Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount)
  const out = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch).map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
  return `#${out.join("")}`
}

/** Returns a new globals object with the preset applied; every other key (fonts, classes, components...) is kept. */
export function applyKitPreset<G extends KitTarget>(globals: G, preset: KitPreset): G {
  const c = preset.colors
  const dark = preset.id === "shab"
  return {
    ...globals,
    colors: { ...globals.colors, ...c },
    palette: [
      { id: "primary", name: "اصلی", value: c.primary },
      { id: "secondary", name: "ثانویه", value: c.secondary },
      { id: "accent", name: "تأکیدی", value: c.accent },
      { id: "background", name: "زمینه", value: c.background },
    ],
    buttons: {
      ...globals.buttons,
      radius: preset.radius,
      variants: {
        ...globals.buttons.variants,
        primary: { background: c.primary, color: dark ? "#0F1220" : "#FFFFFF", hoverBackground: shadeHex(c.primary, -0.1), hoverColor: dark ? "#0F1220" : "#FFFFFF", border: "transparent" },
        secondary: { background: c.secondary, color: dark ? "#0F1220" : "#FFFFFF", hoverBackground: shadeHex(c.secondary, dark ? -0.1 : 0.1), hoverColor: dark ? "#0F1220" : "#FFFFFF", border: "transparent" },
        outline: { background: "transparent", color: c.text, hoverBackground: c.background, hoverColor: c.text, border: c.border },
        ghost: { background: "transparent", color: c.text, hoverBackground: c.background, hoverColor: c.primary, border: "transparent" },
      },
    },
  }
}
