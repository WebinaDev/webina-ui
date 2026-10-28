/**
 * Builder Phase 10 — A/B auto-winner: two-proportion z-test, same rule as the backend
 * (|z| ≥ 1.96 and at least `minViews` views per arm). Pure so editors and reports agree.
 */
export type AbStats = { viewsA: number; conversionsA: number; viewsB: number; conversionsB: number }
export type AbVerdict = { z: number; rateA: number; rateB: number; significant: boolean; winner: "A" | "B" | null; lift: number }

export function abVerdict(s: AbStats, minViews = 100): AbVerdict {
  const rateA = s.viewsA > 0 ? s.conversionsA / s.viewsA : 0
  const rateB = s.viewsB > 0 ? s.conversionsB / s.viewsB : 0
  const pooledN = s.viewsA + s.viewsB
  const p = pooledN > 0 ? (s.conversionsA + s.conversionsB) / pooledN : 0
  const se = s.viewsA > 0 && s.viewsB > 0 ? Math.sqrt(p * (1 - p) * (1 / s.viewsA + 1 / s.viewsB)) : 0
  const z = se > 0 ? (rateB - rateA) / se : 0
  const significant = Math.abs(z) >= 1.96 && Math.min(s.viewsA, s.viewsB) >= minViews
  return { z, rateA, rateB, significant, winner: significant ? (z > 0 ? "B" : "A") : null, lift: rateA > 0 ? (rateB - rateA) / rateA : 0 }
}
