export type ApiEnvelope<T = unknown> = {
  success: boolean
  data: T
  message?: string | null
  meta?: Record<string, unknown> | null
  errors?: Record<string, unknown> | null
}

/**
 * True only for the Webina Laravel envelope (`success` + `data`|`errors`).
 * Does NOT match CRM-style `{ ok, data }` or bare `{ data }` payloads.
 */
export function isApiEnvelope(value: unknown): value is ApiEnvelope {
  if (!value || typeof value !== "object") return false
  return "success" in value && ("data" in value || "errors" in value)
}

/**
 * Unwrap envelope `data` only when `success` is present.
 * Leaves `{ ok, data }` and other shapes untouched so callers keep siblings.
 */
export function unwrapApiData<T>(payload: unknown): T {
  if (isApiEnvelope(payload)) {
    return payload.data as T
  }
  return payload as T
}

/**
 * Unwrap envelope while preserving `meta` / `message`.
 * Non-envelope payloads (including `{ ok, data }`) are returned as `{ data: payload }`.
 */
export function unwrapApiResponse<T>(payload: unknown): {
  data: T
  message?: string | null
  meta?: Record<string, unknown> | null
} {
  if (isApiEnvelope(payload)) {
    return {
      data: payload.data as T,
      message: payload.message,
      meta: payload.meta ?? undefined,
    }
  }
  return { data: payload as T }
}

/** Request header our own clients send to opt in to the CDN-safe HTTP-200 error envelope. */
export const API_ENVELOPE_HEADER = "X-Webino-Envelope"
/** Response header carrying the real status when an error was wrapped as HTTP 200. */
export const API_STATUS_HEADER = "X-Webino-Status"
/** Generic Persian message for non-JSON / CDN HTML error pages. */
export const API_GENERIC_ERROR_FA = "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."

/**
 * Real HTTP status of an API response: honours `X-Webino-Status` and the
 * `{ ok:false, status }` envelope (both sent as HTTP 200 so CDNs don't replace
 * error bodies), else `res.status`.
 */
export function resolveApiStatus(res: { status: number; headers: { get(name: string): string | null } }, body?: unknown): number {
  const h = Number(res.headers.get(API_STATUS_HEADER))
  if (Number.isInteger(h) && h >= 400) return h
  if (body && typeof body === "object" && (body as { ok?: unknown }).ok === false) {
    const s = Number((body as { status?: unknown }).status)
    if (Number.isInteger(s) && s >= 400) return s
  }
  return res.status
}

/** True when the response body is HTML or otherwise not JSON (e.g. a CDN error page). */
export function isNonJsonResponse(res: { headers: { get(name: string): string | null } }): boolean {
  const ct = (res.headers.get("content-type") || "").toLowerCase()
  return ct !== "" && !ct.includes("json")
}
