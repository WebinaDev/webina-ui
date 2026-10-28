export function abVerdict(s, minViews = 100) {
    const rateA = s.viewsA > 0 ? s.conversionsA / s.viewsA : 0;
    const rateB = s.viewsB > 0 ? s.conversionsB / s.viewsB : 0;
    const pooledN = s.viewsA + s.viewsB;
    const p = pooledN > 0 ? (s.conversionsA + s.conversionsB) / pooledN : 0;
    const se = s.viewsA > 0 && s.viewsB > 0 ? Math.sqrt(p * (1 - p) * (1 / s.viewsA + 1 / s.viewsB)) : 0;
    const z = se > 0 ? (rateB - rateA) / se : 0;
    const significant = Math.abs(z) >= 1.96 && Math.min(s.viewsA, s.viewsB) >= minViews;
    return { z, rateA, rateB, significant, winner: significant ? (z > 0 ? "B" : "A") : null, lift: rateA > 0 ? (rateB - rateA) / rateA : 0 };
}
