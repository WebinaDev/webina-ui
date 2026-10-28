export type ApiEnvelope<T = unknown> = {
    success: boolean;
    data: T;
    message?: string | null;
    meta?: Record<string, unknown> | null;
    errors?: Record<string, unknown> | null;
};
/**
 * True only for the Webina Laravel envelope (`success` + `data`|`errors`).
 * Does NOT match CRM-style `{ ok, data }` or bare `{ data }` payloads.
 */
export declare function isApiEnvelope(value: unknown): value is ApiEnvelope;
/**
 * Unwrap envelope `data` only when `success` is present.
 * Leaves `{ ok, data }` and other shapes untouched so callers keep siblings.
 */
export declare function unwrapApiData<T>(payload: unknown): T;
/**
 * Unwrap envelope while preserving `meta` / `message`.
 * Non-envelope payloads (including `{ ok, data }`) are returned as `{ data: payload }`.
 */
export declare function unwrapApiResponse<T>(payload: unknown): {
    data: T;
    message?: string | null;
    meta?: Record<string, unknown> | null;
};
/** Request header our own clients send to opt in to the CDN-safe HTTP-200 error envelope. */
export declare const API_ENVELOPE_HEADER = "X-Webino-Envelope";
/** Response header carrying the real status when an error was wrapped as HTTP 200. */
export declare const API_STATUS_HEADER = "X-Webino-Status";
/** Generic Persian message for non-JSON / CDN HTML error pages. */
export declare const API_GENERIC_ERROR_FA = "\u0627\u0631\u062A\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631 \u0628\u0631\u0642\u0631\u0627\u0631 \u0646\u0634\u062F. \u0644\u0637\u0641\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.";
/**
 * Real HTTP status of an API response: honours `X-Webino-Status` and the
 * `{ ok:false, status }` envelope (both sent as HTTP 200 so CDNs don't replace
 * error bodies), else `res.status`.
 */
export declare function resolveApiStatus(res: {
    status: number;
    headers: {
        get(name: string): string | null;
    };
}, body?: unknown): number;
/** True when the response body is HTML or otherwise not JSON (e.g. a CDN error page). */
export declare function isNonJsonResponse(res: {
    headers: {
        get(name: string): string | null;
    };
}): boolean;
//# sourceMappingURL=api-envelope.d.ts.map