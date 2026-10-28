export type DocDiffEntry = {
    id: string;
    type: string;
    kind: "added" | "removed" | "changed";
};
export type DocDiff = {
    added: number;
    removed: number;
    changed: number;
    entries: DocDiffEntry[];
};
/** `from` = the revision, `to` = the current draft. Entries describe going from `to` back to `from`. */
export declare function diffDocuments(from: unknown, to: unknown, limit?: number): DocDiff;
//# sourceMappingURL=doc-diff.d.ts.map