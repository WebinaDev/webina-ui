/** Shared form model (ERP + Dashboard). Types include `heading` (group title, no input) and `file` (private upload, value = token).
 * Pro form model: `label|name|type|options|required|step|showIf` per line (first three columns = legacy format). */
export type FormFieldType = "text" | "email" | "tel" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file" | "heading" | "time" | "url" | "hidden" | "acceptance" | "password" | "rating" | "calc"
export type ConditionOp = "=" | "!=" | "~" | ">" | "<" | ">=" | "<="
export type FieldCondition = { name: string; value: string; op?: ConditionOp }
export type FormField = {
  label: string
  name: string
  type: FormFieldType
  options: string[]
  required: boolean
  step: number
  /** First condition (kept for older callers); `showIfList` holds all of them. */
  showIf?: FieldCondition
  showIfList?: FieldCondition[]
  /** "and" (`a=1 & b>2`) or "or" (`a=1 || b=2`). */
  showIfMode?: "and" | "or"
  /** `calc`: arithmetic over other field names, e.g. `qty * price + 5000`. `hidden`: default value. */
  formula?: string
}

export const FORM_FIELD_TYPES: FormFieldType[] = ["text", "email", "tel", "number", "textarea", "select", "radio", "checkbox", "date", "file", "heading", "time", "url", "hidden", "acceptance", "password", "rating", "calc"]

/** Field types that never take user input (no required check). */
const NO_INPUT: FormFieldType[] = ["heading", "hidden", "calc"]

const COND = /^([\p{L}\p{N}_.-]+)\s*(!=|>=|<=|=|~|>|<)\s*(.*)$/u

export function parseConditions(raw: string): { list: FieldCondition[]; mode: "and" | "or" } {
  const text = raw.trim()
  if (!text) return { list: [], mode: "and" }
  const mode = text.includes("||") ? "or" : "and"
  const list = text
    .split(mode === "or" ? "||" : "&")
    .map((part) => part.trim().match(COND))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => ({ name: m[1], op: m[2] as ConditionOp, value: m[3].trim() }))
  return { list, mode }
}

function test(cond: FieldCondition, values: Record<string, string>): boolean {
  const actual = values[cond.name] ?? ""
  const op = cond.op ?? "="
  if (op === "=") return actual === cond.value
  if (op === "!=") return actual !== cond.value
  if (op === "~") return actual.includes(cond.value)
  const a = Number(toLatinDigits(actual))
  const b = Number(toLatinDigits(cond.value))
  if (!Number.isFinite(a) || !Number.isFinite(b) || actual.trim() === "") return false
  return op === ">" ? a > b : op === "<" ? a < b : op === ">=" ? a >= b : a <= b
}

function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[,٬]/g, "")
}

/** Safe arithmetic (no eval): numbers, field names, + - * / % and parentheses. Unknown/empty fields count as 0. */
export function evalFormula(formula: string, values: Record<string, string>): number | null {
  const tokens = formula.match(/\d+(?:\.\d+)?|[\p{L}_][\p{L}\p{N}_.-]*|[-+*/%()]/gu)
  if (!tokens || tokens.join("").length !== formula.replace(/\s+/g, "").length) return null
  let i = 0
  const num = (name: string) => {
    const n = Number(toLatinDigits(values[name] ?? ""))
    return Number.isFinite(n) ? n : 0
  }
  const factor = (): number => {
    const t = tokens[i++]
    if (t === undefined) throw new Error("eof")
    if (t === "-") return -factor()
    if (t === "+") return factor()
    if (t === "(") {
      const v = expr()
      if (tokens[i++] !== ")") throw new Error("paren")
      return v
    }
    if (/^\d/.test(t)) return Number(t)
    if (/^[-+*/%()]$/.test(t)) throw new Error("op")
    return num(t)
  }
  const term = (): number => {
    let v = factor()
    while (tokens[i] === "*" || tokens[i] === "/" || tokens[i] === "%") {
      const op = tokens[i++]
      const r = factor()
      v = op === "*" ? v * r : op === "/" ? (r === 0 ? 0 : v / r) : r === 0 ? 0 : v % r
    }
    return v
  }
  const expr = (): number => {
    let v = term()
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++]
      const r = term()
      v = op === "+" ? v + r : v - r
    }
    return v
  }
  try {
    const v = expr()
    if (i !== tokens.length || !Number.isFinite(v)) return null
    return Math.round(v * 100) / 100
  } catch {
    return null
  }
}

/** Values with every `calc` field computed (in order, so a calc can use an earlier calc) and `hidden` defaults filled. */
export function withComputed(fields: FormField[], values: Record<string, string>): Record<string, string> {
  const out = { ...values }
  for (const field of fields) {
    if (field.type === "hidden" && out[field.name] === undefined) out[field.name] = field.formula ?? ""
    if (field.type === "calc") {
      const v = evalFormula(field.formula ?? "", out)
      out[field.name] = v === null ? "" : String(v)
    }
  }
  return out
}

const DEFAULT_FIELDS = "نام|name|text\nموبایل|phone|tel\nپیام|message|textarea"

export function parseFormFields(raw: unknown): FormField[] {
  const text = typeof raw === "string" && raw.trim() ? raw : DEFAULT_FIELDS
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", name = "", type = "", options = "", required = "", step = "", showIf = ""] = line.split("|").map((part) => part.trim())
      const conds = parseConditions(showIf)
      const kind = (FORM_FIELD_TYPES as string[]).includes(type) ? (type as FormFieldType) : "text"
      const formulaField = kind === "calc" || kind === "hidden"
      return {
        label: label || name || "فیلد",
        name: (name || label || "field").replace(/[^\p{L}\p{N}_.-]/gu, "_"),
        type: kind,
        options: formulaField ? [] : options.split(/[,،]/).map((item) => item.trim()).filter(Boolean),
        // Legacy forms required every field; an empty column keeps that.
        required: !NO_INPUT.includes(kind) && !["no", "خیر", "0", "false"].includes(required.toLowerCase()),
        step: Math.max(1, Number.parseInt(step, 10) || 1),
        showIf: conds.list[0],
        ...(conds.list.length ? { showIfList: conds.list, showIfMode: conds.mode } : {}),
        ...(formulaField ? { formula: options } : {}),
      }
    })
}

export function isVisible(field: FormField, values: Record<string, string>): boolean {
  const list = field.showIfList?.length ? field.showIfList : field.showIf ? [field.showIf] : []
  if (!list.length) return true
  return field.showIfMode === "or" ? list.some((c) => test(c, values)) : list.every((c) => test(c, values))
}

export function stepCount(fields: FormField[]): number {
  return fields.reduce((max, field) => Math.max(max, field.step), 1)
}

/** Names of visible required fields on `step` that are still empty. */
export function missingOnStep(fields: FormField[], values: Record<string, string>, step: number): string[] {
  return fields
    .filter((field) => !NO_INPUT.includes(field.type) && field.step === step && field.required && isVisible(field, values))
    .filter((field) => (field.type === "acceptance" ? values[field.name] !== "1" : !(values[field.name] ?? "").trim()))
    .map((field) => field.name)
}

/** Payload sent to the server: only visible fields (calc/hidden values computed). */
export function visiblePayload(fields: FormField[], input: Record<string, string>): Record<string, string> {
  const values = withComputed(fields, input)
  const out: Record<string, string> = {}
  for (const field of fields) if (field.type !== "heading" && isVisible(field, values)) out[field.name] = values[field.name] ?? ""
  for (const key of ["email", "phone"]) if (values[key] !== undefined && out[key] === undefined) out[key] = values[key]
  return out
}

/** Marketing form definition (`marketing_forms.fields`) → builder fields, so a widget can use the form's own schema. */
export function fieldsFromDefinition(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const name = typeof row.name === "string" ? row.name : ""
    if (!name) return []
    const type = typeof row.type === "string" && (FORM_FIELD_TYPES as string[]).includes(row.type) ? (row.type as FormFieldType) : "text"
    return [{
      label: typeof row.label === "string" && row.label ? row.label : name,
      name,
      type,
      options: Array.isArray(row.options) ? row.options.map(String) : [],
      required: !NO_INPUT.includes(type) && row.required === true,
      step: Math.max(1, Number(row.step) || 1),
    }]
  })
}
