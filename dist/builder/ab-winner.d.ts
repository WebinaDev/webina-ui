/**
 * Builder Phase 10 — A/B auto-winner: two-proportion z-test, same rule as the backend
 * (|z| ≥ 1.96 and at least `minViews` views per arm). Pure so editors and reports agree.
 */
export type AbStats = {
    viewsA: number;
    conversionsA: number;
    viewsB: number;
    conversionsB: number;
};
export type AbVerdict = {
    z: number;
    rateA: number;
    rateB: number;
    significant: boolean;
    winner: "A" | "B" | null;
    lift: number;
};
export declare function abVerdict(s: AbStats, minViews?: number): AbVerdict;
//# sourceMappingURL=ab-winner.d.ts.map