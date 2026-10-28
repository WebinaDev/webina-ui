"use client"

import { useState, type CSSProperties } from "react"

export type PopupContent = {
  title?: string
  body?: string
  image_url?: string
  cta_label?: string
  cta_url?: string
  coupon_code?: string
  collect?: "none" | "phone" | "email"
  position?: "center" | "bottom" | "corner"
}

export type PopupCardProps = {
  content: PopupContent
  onClose: () => void
  onCta?: () => void
  /** Return true when the lead was stored. Omit to hide the capture form (e.g. read-only previews). */
  onLead?: (value: string) => Promise<boolean> | boolean
}

const ACCENT = "var(--primary, #ef4056)"
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"

/** Normalise Persian digits and validate an Iranian mobile number. */
export function isIranMobile(value: string): boolean {
  const v = value.trim().replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
  return /^(\+98|0)?9\d{9}$/.test(v)
}

const s: Record<string, CSSProperties> = {
  card: { position: "relative", width: "100%", maxWidth: 384, overflow: "hidden", borderRadius: 16, background: "#fff", color: "#1e293b", boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)", fontFamily: "inherit" },
  close: { position: "absolute", left: 8, top: 8, zIndex: 1, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, border: 0, background: "rgba(0,0,0,.4)", color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer" },
  img: { display: "block", width: "100%", maxHeight: 224, objectFit: "cover" },
  inner: { display: "flex", flexDirection: "column", gap: 12, padding: 20, textAlign: "center" },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  body: { margin: 0, whiteSpace: "pre-line", fontSize: 14, lineHeight: 1.9, color: "#475569" },
  coupon: { width: "100%", borderRadius: 8, border: `2px dashed ${ACCENT}`, background: "transparent", color: ACCENT, padding: "8px 12px", fontFamily: "ui-monospace, monospace", fontWeight: 700, letterSpacing: ".1em", cursor: "pointer" },
  form: { display: "flex", gap: 8 },
  input: { height: 40, minWidth: 0, flex: 1, borderRadius: 8, border: "1px solid #cbd5e1", padding: "0 12px", fontSize: 14, fontFamily: "inherit" },
  btn: { height: 40, borderRadius: 8, border: 0, padding: "0 16px", fontSize: 14, fontWeight: 500, color: "#fff", background: ACCENT, cursor: "pointer", fontFamily: "inherit" },
  cta: { display: "block", borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 500, color: "#fff", background: ACCENT, textDecoration: "none" },
  done: { margin: 0, fontSize: 14, fontWeight: 500, color: "#059669" },
}

/** Presentational marketing popup (RTL, accent-aware via --primary). Shared by admin previews and storefront runtimes. */
export function PopupCard({ content, onClose, onCta, onLead }: PopupCardProps) {
  const [value, setValue] = useState("")
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const collect = content.collect ?? "none"
  return (
    <div dir="rtl" style={s.card}>
      <button type="button" aria-label="بستن" onClick={onClose} style={s.close}>×</button>
      {content.image_url ? <img src={content.image_url} alt="" style={s.img} /> : null}
      <div style={s.inner}>
        {content.title ? <h3 style={s.title}>{content.title}</h3> : null}
        {content.body ? <p style={s.body}>{content.body}</p> : null}
        {content.coupon_code ? (
          <button
            type="button"
            dir="ltr"
            style={s.coupon}
            onClick={() => {
              void navigator.clipboard?.writeText(content.coupon_code ?? "")
              setCopied(true)
            }}
          >
            {copied ? "کپی شد ✓" : content.coupon_code}
          </button>
        ) : null}
        {collect !== "none" && onLead !== undefined ? (
          done ? (
            <p style={s.done}>عضویت شما ثبت شد.</p>
          ) : (
            <form
              style={s.form}
              onSubmit={async (e) => {
                e.preventDefault()
                const v = value.trim()
                const ok = collect === "email" ? /.+@.+\..+/.test(v) : isIranMobile(v)
                if (!ok) return
                if (await onLead(v)) setDone(true)
              }}
            >
              <input
                dir="ltr"
                inputMode={collect === "email" ? "email" : "tel"}
                placeholder={collect === "email" ? "ایمیل" : "۰۹۱۲۳۴۵۶۷۸۹"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={s.input}
              />
              <button type="submit" style={s.btn}>عضویت</button>
            </form>
          )
        ) : null}
        {content.cta_label && content.cta_url ? (
          <a href={content.cta_url} onClick={onCta} style={s.cta}>
            {content.cta_label}
          </a>
        ) : null}
      </div>
    </div>
  )
}
