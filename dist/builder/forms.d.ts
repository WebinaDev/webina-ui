/** Shared form model (ERP + Dashboard). Types include `heading` (group title, no input) and `file` (private upload, value = token).
 * Pro form model: `label|name|type|options|required|step|showIf` per line (first three columns = legacy format). */
export type FormFieldType = "text" | "email" | "tel" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date" | "file" | "heading" | "time" | "url" | "hidden" | "acceptance" | "password" | "rating" | "calc";
export type ConditionOp = "=" | "!=" | "~" | ">" | "<" | ">=" | "<=";
export type FieldCondition = {
    name: string;
    value: string;
    op?: ConditionOp;
};
export type FormField = {
    label: string;
    name: string;
    type: FormFieldType;
    options: string[];
    required: boolean;
    step: number;
    /** First condition (kept for older callers); `showIfList` holds all of them. */
    showIf?: FieldCondition;
    showIfList?: FieldCondition[];
    /** "and" (`a=1 & b>2`) or "or" (`a=1 || b=2`). */
    showIfMode?: "and" | "or";
    /** `calc`: arithmetic over other field names, e.g. `qty * price + 5000`. `hidden`: default value. */
    formula?: string;
};
export declare const FORM_FIELD_TYPES: FormFieldType[];
export declare function parseConditions(raw: string): {
    list: FieldCondition[];
    mode: "and" | "or";
};
/** Safe arithmetic (no eval): numbers, field names, + - * / % and parentheses. Unknown/empty fields count as 0. */
export declare function evalFormula(formula: string, values: Record<string, string>): number | null;
/** Values with every `calc` field computed (in order, so a calc can use an earlier calc) and `hidden` defaults filled. */
export declare function withComputed(fields: FormField[], values: Record<string, string>): Record<string, string>;
export declare function parseFormFields(raw: unknown): FormField[];
export declare function isVisible(field: FormField, values: Record<string, string>): boolean;
export declare function stepCount(fields: FormField[]): number;
/** Names of visible required fields on `step` that are still empty. */
export declare function missingOnStep(fields: FormField[], values: Record<string, string>, step: number): string[];
/** Payload sent to the server: only visible fields (calc/hidden values computed). */
export declare function visiblePayload(fields: FormField[], input: Record<string, string>): Record<string, string>;
/** Marketing form definition (`marketing_forms.fields`) → builder fields, so a widget can use the form's own schema. */
export declare function fieldsFromDefinition(raw: unknown): FormField[];
//# sourceMappingURL=forms.d.ts.map