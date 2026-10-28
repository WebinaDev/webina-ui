
/** «منوها» — shared types/helpers for the admin Menus section, the builder nav widget and the storefront. */
export type NavItemType = "custom" | "page" | "category" | "brand" | "product" | "post"
export type NavVisibility = "all" | "guest" | "logged_in" | "desktop" | "mobile" | "hidden"

export type NavMenuItem = {
  id: string
  label: string
  type: NavItemType
  ref?: string
  ref_id?: number
  url?: string
  icon?: string
  badge?: string
  badge_color?: string
  new_tab?: boolean
  mega?: boolean
  visibility?: NavVisibility
  children?: NavMenuItem[]
}

export type NavMenu = { id: number; name: string; slug: string; items: NavMenuItem[] | null; locations: string[] | null }

export const NAV_LOCATIONS: { key: string; label: string }[] = [
  { key: "header_main", label: "منوی اصلی هدر" },
  { key: "top_bar", label: "نوار بالایی" },
  { key: "mobile", label: "منوی موبایل" },
  { key: "mega_menu", label: "مگامنو (دسته‌بندی‌ها)" },
  { key: "footer_1", label: "ستون اول فوتر" },
  { key: "footer_2", label: "ستون دوم فوتر" },
  { key: "footer_3", label: "ستون سوم فوتر" },
  { key: "footer_4", label: "ستون چهارم فوتر" },
  { key: "footer_bottom", label: "پایین فوتر" },
]

export const NAV_TYPES: { key: NavItemType; label: string }[] = [
  { key: "custom", label: "لینک دلخواه" },
  { key: "page", label: "برگه" },
  { key: "category", label: "دسته‌بندی محصول" },
  { key: "brand", label: "برند" },
  { key: "product", label: "محصول" },
  { key: "post", label: "نوشته بلاگ" },
]

export const NAV_VISIBILITY: { key: NavVisibility; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "guest", label: "فقط مهمان" },
  { key: "logged_in", label: "فقط کاربران واردشده" },
  { key: "desktop", label: "فقط دسکتاپ" },
  { key: "mobile", label: "فقط موبایل" },
  { key: "hidden", label: "مخفی" },
]

/** Per-app overrides for typed links (e.g. the store's category permalink scheme). */
/** Per-app permalinks; omitted keys fall back to the WooCommerce-style defaults below. */
export type NavHrefOptions = { category?: (slug: string) => string; product?: (slug: string) => string }

/** Storefront URL for a menu item — root permalinks, never /pages/. */
export function navItemHref(it: Pick<NavMenuItem, "type" | "ref" | "url">, opts?: NavHrefOptions): string {
  const ref = (it.ref ?? "").trim()
  if (it.type !== "custom" && ref) {
    const e = encodeURIComponent(ref)
    switch (it.type) {
      case "category":
        return opts?.category ? opts.category(ref) : `/category/${e}`
      case "brand":
        return `/brand/${e}`
      case "product":
        return opts?.product ? opts.product(ref) : `/product/${e}`
      case "post":
        return `/blog/${e}`
      case "page":
        return `/${e}`
    }
  }
  const url = (it.url ?? "").trim() || "#"
  return url.replace(/^\/pages\//, "/")
}

export function newNavItemId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** CSS classes for device-only visibility; guest/logged-in filtered by {@link filterNavItems}. */
export function navVisibilityClass(v?: NavVisibility): string {
  return v === "desktop" ? "max-md:hidden" : v === "mobile" ? "md:hidden" : ""
}

/** `loggedIn` null = auth unknown (builder widgets): only hidden items are dropped. */
export function filterNavItems(items: NavMenuItem[], loggedIn: boolean | null): NavMenuItem[] {
  return items
    .filter((i) => i.visibility !== "hidden" && !(loggedIn === true && i.visibility === "guest") && !(loggedIn === false && i.visibility === "logged_in"))
    .map((i) => ({ ...i, children: i.children?.length ? filterNavItems(i.children, loggedIn) : [] }))
}

/** Flatten a menu to simple `{label, href}` links for legacy consumers (header nav, footer columns). */
export function navItemsToLinks(items: NavMenuItem[], opts?: NavHrefOptions): { label: string; href: string; newTab?: boolean; icon?: string; badge?: string; badgeColor?: string; children?: { label: string; href: string; newTab?: boolean }[] }[] {
  return items.map((i) => ({
    label: i.label,
    href: navItemHref(i, opts),
    newTab: i.new_tab,
    icon: i.icon,
    badge: i.badge,
    badgeColor: i.badge_color,
    children: (i.children ?? []).map((c) => ({ label: c.label, href: navItemHref(c, opts), newTab: c.new_tab })),
  }))
}

export type PublicNavMenus = { menus: Record<string, { id: number; name: string; items: NavMenuItem[] }>; locations: Record<string, string> }

export type NavTreeNode = { label: string; href: string; newTab?: boolean; children: NavTreeNode[] }

export function navItemsToTree(items: NavMenuItem[], opts?: NavHrefOptions): NavTreeNode[] {
  return items.map((i) => ({ label: i.label, href: navItemHref(i, opts), newTab: i.new_tab, children: navItemsToTree(i.children ?? [], opts) }))
}

/** Items for a location key or explicit slug from a public payload; null = nothing assigned (caller falls back). */
export function pickNavMenuItems(all: PublicNavMenus | null, opts: { location?: string; slug?: string }): NavMenuItem[] | null {
  if (!all) return null
  const slug = opts.slug || (opts.location ? all.locations[opts.location] : undefined)
  const items = slug ? all.menus[slug]?.items : undefined
  return items && items.length ? items : null
}

/** Merge an edited menu into a public payload (live previews while editing). */
export function primeNavMenus(base: PublicNavMenus, slug: string, menu: { id: number; name: string; items: NavMenuItem[] }, locations?: string[]): PublicNavMenus {
  const locs = { ...base.locations }
  if (locations) {
    for (const [k, v] of Object.entries(locs)) if (v === slug && !locations.includes(k)) delete locs[k]
    for (const l of locations) locs[l] = slug
  }
  return { menus: { ...base.menus, [slug]: menu }, locations: locs }
}

export const NAV_MAX_DEPTH = 3

export type NavPath = number[]
export type NavDropPos = "before" | "after" | "inside"

export function navGetAt(items: NavMenuItem[], path: NavPath): NavMenuItem | undefined {
  let list = items
  let node: NavMenuItem | undefined
  for (const i of path) {
    node = list[i]
    if (!node) return undefined
    list = node.children ?? []
  }
  return node
}

export function navRemoveAt(items: NavMenuItem[], path: NavPath): [NavMenuItem[], NavMenuItem | undefined] {
  const [head, ...rest] = path
  if (!rest.length) {
    const copy = [...items]
    const [removed] = copy.splice(head, 1)
    return [copy, removed]
  }
  const copy = [...items]
  const [children, removed] = navRemoveAt(copy[head].children ?? [], rest)
  copy[head] = { ...copy[head], children }
  return [copy, removed]
}

export function navInsertAt(items: NavMenuItem[], path: NavPath, node: NavMenuItem): NavMenuItem[] {
  const [head, ...rest] = path
  const copy = [...items]
  if (!rest.length) {
    copy.splice(head, 0, node)
    return copy
  }
  copy[head] = { ...copy[head], children: navInsertAt(copy[head].children ?? [], rest, node) }
  return copy
}

export function navUpdateAt(items: NavMenuItem[], path: NavPath, patch: Partial<NavMenuItem>): NavMenuItem[] {
  const [head, ...rest] = path
  const copy = [...items]
  copy[head] = rest.length ? { ...copy[head], children: navUpdateAt(copy[head].children ?? [], rest, patch) } : { ...copy[head], ...patch }
  return copy
}

export function navDepthOf(node: NavMenuItem): number {
  return 1 + Math.max(0, ...(node.children ?? []).map(navDepthOf))
}

const samePrefix = (a: NavPath, b: NavPath) => a.length <= b.length && a.every((v, i) => b[i] === v)

/** Move `from` to a drop position relative to `to`; returns null when invalid (into itself / too deep). */
export function moveNavItem(items: NavMenuItem[], from: NavPath, to: NavPath, pos: NavDropPos): NavMenuItem[] | null {
  if (samePrefix(from, to)) return null
  const node = navGetAt(items, from)
  if (!node) return null
  const targetDepth = pos === "inside" ? to.length + 1 : to.length
  if (targetDepth - 1 + navDepthOf(node) > NAV_MAX_DEPTH) return null
  // Compute the destination path before removal, then adjust for the removed index.
  let dest: NavPath = pos === "inside" ? [...to, (navGetAt(items, to)?.children ?? []).length] : [...to.slice(0, -1), to[to.length - 1] + (pos === "after" ? 1 : 0)]
  const [without] = navRemoveAt(items, from)
  const fl = from.length - 1
  if (dest.length > fl && from.slice(0, fl).every((v, i) => dest[i] === v) && dest[fl] > from[fl]) {
    dest = [...dest]
    dest[fl] -= 1
  }
  return navInsertAt(without, dest, node)
}

