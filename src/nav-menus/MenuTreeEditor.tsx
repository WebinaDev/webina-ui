"use client"

import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, GripVertical, IndentDecrease, IndentIncrease, Plus, Trash2 } from "lucide-react"
import { useEffect, useState, type DragEvent } from "react"

import {
  NAV_MAX_DEPTH,
  NAV_TYPES,
  NAV_VISIBILITY,
  moveNavItem,
  navGetAt,
  navItemHref,
  navRemoveAt,
  navUpdateAt,
  newNavItemId,
  type NavDropPos,
  type NavHrefOptions,
  type NavItemType,
  type NavMenuItem,
  type NavPath,
  type NavVisibility,
} from "./core"

/**
 * WordPress-style menu tree editor (drag-and-drop reorder + nesting, max 3 levels), Tailwind-classed, RTL.
 * Used by the admin «منوها» page and the page-builder nav widget so both edit the same data.
 */
export type NavSourceRow = { id: number; label: string; slug: string }
export type NavSourceSearch = (type: NavItemType, q: string) => Promise<NavSourceRow[]>

function SourcePicker({ type, onPick, search }: { type: NavItemType; onPick: (row: NavSourceRow) => void; search?: NavSourceSearch }) {
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<NavSourceRow[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (type === "custom") return
    let alive = true
    const t = setTimeout(() => {
      setLoading(true)
      ;(search ? search(type, q) : Promise.resolve([] as NavSourceRow[]))
        .then((r) => alive && setRows(r ?? []))
        .catch(() => alive && setRows([]))
        .finally(() => alive && setLoading(false))
    }, 250)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [type, q, search])
  if (type === "custom") return null
  return (
    <div className="space-y-1">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو…" className={field} />
      <div className="max-h-40 overflow-auto rounded border bg-background text-xs">
        {loading ? <div className="p-2 text-muted-foreground">در حال بارگذاری…</div> : null}
        {!loading && !rows.length ? <div className="p-2 text-muted-foreground">موردی یافت نشد</div> : null}
        {rows.map((r) => (
          <button key={r.id} type="button" className="block w-full truncate px-2 py-1 text-start hover:bg-muted" onClick={() => onPick(r)}>
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const field = "h-8 w-full rounded-md border bg-background px-2 text-xs"
const iconBtn = "inline-flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-muted"

function ItemFields({ item, onPatch, search, hrefOptions }: { item: NavMenuItem; onPatch: (p: Partial<NavMenuItem>) => void; search?: NavSourceSearch; hrefOptions?: NavHrefOptions }) {
  return (
    <div className="grid gap-2 border-t p-2 sm:grid-cols-2">
      <label className="space-y-1 text-xs">
        <span>عنوان</span>
        <input className={field} value={item.label} onChange={(e) => onPatch({ label: e.target.value })} />
      </label>
      <label className="space-y-1 text-xs">
        <span>نوع لینک</span>
        <select className={field} value={item.type} onChange={(e) => onPatch({ type: e.target.value as NavItemType, ref: undefined, ref_id: undefined })}>
          {NAV_TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {item.type === "custom" ? (
        <label className="space-y-1 text-xs sm:col-span-2">
          <span>آدرس (مثلاً ‎/about یا https://…)</span>
          <input dir="ltr" className={field} value={item.url ?? ""} onChange={(e) => onPatch({ url: e.target.value.replace(/^\/pages\//, "/") })} />
        </label>
      ) : (
        <div className="space-y-1 text-xs sm:col-span-2">
          <span>
            مقصد: <b dir="ltr">{item.ref ? navItemHref(item, hrefOptions) : "—"}</b>
          </span>
          <SourcePicker search={search} type={item.type} onPick={(r) => onPatch({ ref: r.slug, ref_id: r.id, label: item.label || r.label })} />
        </div>
      )}
      <label className="space-y-1 text-xs">
        <span>آیکن (نام lucide یا آدرس تصویر)</span>
        <input dir="ltr" className={field} value={item.icon ?? ""} onChange={(e) => onPatch({ icon: e.target.value || undefined })} />
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-1 text-xs">
        <label className="space-y-1">
          <span>نشان (مثلاً «جدید»)</span>
          <input className={field} value={item.badge ?? ""} onChange={(e) => onPatch({ badge: e.target.value || undefined })} />
        </label>
        <label className="space-y-1">
          <span>رنگ</span>
          <input type="color" className="h-8 w-10 rounded border" value={item.badge_color ?? "#ef4444"} onChange={(e) => onPatch({ badge_color: e.target.value })} />
        </label>
      </div>
      <label className="space-y-1 text-xs">
        <span>نمایش</span>
        <select className={field} value={item.visibility ?? "all"} onChange={(e) => onPatch({ visibility: e.target.value as NavVisibility })}>
          {NAV_VISIBILITY.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-end gap-3 text-xs">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={!!item.new_tab} onChange={(e) => onPatch({ new_tab: e.target.checked || undefined })} />
          باز شدن در تب جدید
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={!!item.mega} onChange={(e) => onPatch({ mega: e.target.checked || undefined })} />
          مگامنو
        </label>
      </div>
    </div>
  )
}

export type MenuTreeEditorProps = {
  items: NavMenuItem[]
  onChange: (items: NavMenuItem[]) => void
  compact?: boolean
  /** Link picker search for typed items (pages, categories, …); omit to allow custom URLs only in practice. */
  searchSources?: NavSourceSearch
  hrefOptions?: NavHrefOptions
}

export function MenuTreeEditor({ items, onChange, compact = false, searchSources, hrefOptions }: MenuTreeEditorProps) {
  const [open, setOpen] = useState<string | null>(null)
  const [drag, setDrag] = useState<NavPath | null>(null)
  const [over, setOver] = useState<{ key: string; pos: NavDropPos } | null>(null)

  const addRoot = () => {
    const it: NavMenuItem = { id: newNavItemId(), label: "آیتم جدید", type: "custom", url: "/" }
    onChange([...items, it])
    setOpen(it.id)
  }

  const onDragOver = (e: DragEvent, path: NavPath) => {
    if (!drag) return
    e.preventDefault()
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const y = (e.clientY - r.top) / r.height
    // In RTL, dragging further to the inline-start (left) nests under the hovered row.
    const indent = document.documentElement.dir === "rtl" ? r.right - e.clientX > 48 : e.clientX - r.left > 48
    const pos: NavDropPos = y < 0.3 ? "before" : y > 0.7 && !indent ? "after" : path.length < NAV_MAX_DEPTH ? "inside" : "after"
    setOver({ key: path.join("."), pos })
  }

  const onDrop = (e: DragEvent, path: NavPath) => {
    e.preventDefault()
    if (drag && over) {
      const next = moveNavItem(items, drag, path, over.pos)
      if (next) onChange(next)
    }
    setDrag(null)
    setOver(null)
  }

  const shift = (path: NavPath, dir: "up" | "down" | "in" | "out") => {
    const i = path[path.length - 1]
    let next: NavMenuItem[] | null = null
    if (dir === "up" && i > 0) next = moveNavItem(items, path, [...path.slice(0, -1), i - 1], "before")
    if (dir === "down") {
      const sib = [...path.slice(0, -1), i + 1]
      if (navGetAt(items, sib)) next = moveNavItem(items, path, sib, "after")
    }
    if (dir === "in" && i > 0) next = moveNavItem(items, path, [...path.slice(0, -1), i - 1], "inside")
    if (dir === "out" && path.length > 1) next = moveNavItem(items, path, path.slice(0, -1), "after")
    if (next) onChange(next)
  }

  const renderList = (list: NavMenuItem[], parent: NavPath) => (
    <ul className={parent.length ? "ms-5 mt-1 space-y-1 border-s ps-2" : "space-y-1"}>
      {list.map((it, i) => {
        const path = [...parent, i]
        const key = path.join(".")
        const isOver = over?.key === key
        const expanded = open === it.id
        return (
          <li key={it.id}>
            <div
              draggable
              onDragStart={(e) => {
                e.stopPropagation()
                e.dataTransfer.effectAllowed = "move"
                setDrag(path)
              }}
              onDragEnd={() => {
                setDrag(null)
                setOver(null)
              }}
              onDragOver={(e) => {
                e.stopPropagation()
                onDragOver(e, path)
              }}
              onDrop={(e) => {
                e.stopPropagation()
                onDrop(e, path)
              }}
              className={[
                "rounded-md border bg-card",
                isOver && over?.pos === "before" ? "border-t-2 border-t-primary" : "",
                isOver && over?.pos === "after" ? "border-b-2 border-b-primary" : "",
                isOver && over?.pos === "inside" ? "ring-2 ring-primary/50" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-1 p-1.5 text-sm">
                <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden />
                <button type="button" className="flex min-w-0 flex-1 items-center gap-1 text-start" onClick={() => setOpen(expanded ? null : it.id)}>
                  {expanded ? <ChevronDown className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
                  <span className="truncate font-medium">{it.label || "بدون عنوان"}</span>
                  {it.badge ? (
                    <span className="rounded px-1 text-[10px] text-white" style={{ background: it.badge_color || "#ef4444" }}>
                      {it.badge}
                    </span>
                  ) : null}
                  {!compact ? <span className="truncate text-xs text-muted-foreground">{NAV_TYPES.find((t) => t.key === it.type)?.label}</span> : null}
                  {it.visibility && it.visibility !== "all" ? <span className="text-[10px] text-amber-600">{NAV_VISIBILITY.find((v) => v.key === it.visibility)?.label}</span> : null}
                </button>
                <button type="button" className={iconBtn} title="بالا" onClick={() => shift(path, "up")}>
                  <ArrowUp className="size-3.5" />
                </button>
                <button type="button" className={iconBtn} title="پایین" onClick={() => shift(path, "down")}>
                  <ArrowDown className="size-3.5" />
                </button>
                <button type="button" className={iconBtn} title="زیرمنوی آیتم قبلی" onClick={() => shift(path, "in")}>
                  <IndentIncrease className="size-3.5 rtl:-scale-x-100" />
                </button>
                <button type="button" className={iconBtn} title="خروج از زیرمنو" onClick={() => shift(path, "out")}>
                  <IndentDecrease className="size-3.5 rtl:-scale-x-100" />
                </button>
                {path.length < NAV_MAX_DEPTH ? (
                  <button type="button" className={iconBtn}
                    title="افزودن زیرمنو"
                    onClick={() => {
                      const child: NavMenuItem = { id: newNavItemId(), label: "زیرمنو", type: "custom", url: "/" }
                      onChange(navUpdateAt(items, path, { children: [...(it.children ?? []), child] }))
                      setOpen(child.id)
                    }}
                  >
                    <Plus className="size-3.5" />
                  </button>
                ) : null}
                <button type="button" className={iconBtn + " text-destructive"} title="حذف" onClick={() => onChange(navRemoveAt(items, path)[0])}>
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {expanded ? <ItemFields search={searchSources} hrefOptions={hrefOptions} item={it} onPatch={(p) => onChange(navUpdateAt(items, path, p))} /> : null}
            </div>
            {it.children?.length ? renderList(it.children, path) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div dir="rtl" className="space-y-2">
      {items.length ? renderList(items, []) : <p className="rounded border border-dashed p-3 text-center text-xs text-muted-foreground">این منو هنوز آیتمی ندارد.</p>}
      <button type="button" className="inline-flex h-8 items-center gap-1 rounded-md border bg-background px-3 text-sm hover:bg-muted" onClick={addRoot}>
        <Plus className="size-4" /> افزودن آیتم
      </button>
      <p className="text-[11px] text-muted-foreground">برای جابه‌جایی بکشید و رها کنید؛ رها کردن روی وسط یک آیتم آن را زیرمنو می‌کند.</p>
    </div>
  )
}
