export type PopupContent = {
    title?: string;
    body?: string;
    image_url?: string;
    cta_label?: string;
    cta_url?: string;
    coupon_code?: string;
    collect?: "none" | "phone" | "email";
    position?: "center" | "bottom" | "corner";
};
export type PopupCardProps = {
    content: PopupContent;
    onClose: () => void;
    onCta?: () => void;
    /** Return true when the lead was stored. Omit to hide the capture form (e.g. read-only previews). */
    onLead?: (value: string) => Promise<boolean> | boolean;
};
/** Normalise Persian digits and validate an Iranian mobile number. */
export declare function isIranMobile(value: string): boolean;
/** Presentational marketing popup (RTL, accent-aware via --primary). Shared by admin previews and storefront runtimes. */
export declare function PopupCard({ content, onClose, onCta, onLead }: PopupCardProps): import("react").JSX.Element;
//# sourceMappingURL=PopupCard.d.ts.map