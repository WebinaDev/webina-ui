/**
 * Builder Phase 10 — revision diff: compares two builder documents by node id and summarises what a
 * restore would change (added / removed / changed nodes). Pure and structural (any tree of {id, type, children}).
 */
type AnyNode = { id?: unknown; type?: unknown; children?: unknown; [k: string]: unknown }

export type DocDiffEntry = { id: string; type: string; kind: "added" | "removed" | "changed" }
export type DocDiff = { added: number; removed: number; changed: number; entries: DocDiffEntry[] }

function collect(node: unknown, out: Map<string, AnyNode>): void {
  if (Array.isArray(node)) {
    for (const n of node) collect(n, out)
    return
  }
  if (!node || typeof node !== "object") return
  const n = node as AnyNode
  if (typeof n.id === "string" && n.id) out.set(n.id, n)
  for (const [key, value] of Object.entries(n)) if (key !== "props" && key !== "style" && value && typeof value === "object") collect(value, out)
}

/** Own content of a node, without its children (so a child edit does not mark every ancestor as changed). */
function own(n: AnyNode): string {
  const rest: Record<string, unknown> = {}
  for (const key of Object.keys(n).sort()) if (key !== "children" && key !== "sections" && key !== "columns" && key !== "widgets") rest[key] = n[key]
  return JSON.stringify(rest)
}

/** `from` = the revision, `to` = the current draft. Entries describe going from `to` back to `from`. */
export function diffDocuments(from: unknown, to: unknown, limit = 200): DocDiff {
  const a = new Map<string, AnyNode>()
  const b = new Map<string, AnyNode>()
  collect(from, a)
  collect(to, b)
  const entries: DocDiffEntry[] = []
  let added = 0
  let removed = 0
  let changed = 0
  const label = (n: AnyNode) => (typeof n.type === "string" ? n.type : "node")
  for (const [id, n] of a) {
    const cur = b.get(id)
    if (!cur) {
      added++
      if (entries.length < limit) entries.push({ id, type: label(n), kind: "added" })
    } else if (own(cur) !== own(n)) {
      changed++
      if (entries.length < limit) entries.push({ id, type: label(n), kind: "changed" })
    }
  }
  for (const [id, n] of b) {
    if (!a.has(id)) {
      removed++
      if (entries.length < limit) entries.push({ id, type: label(n), kind: "removed" })
    }
  }
  return { added, removed, changed, entries }
}
