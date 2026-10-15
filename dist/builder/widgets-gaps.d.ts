import type { SharedOption, SharedWidgetDef } from "./types";
/** Generic team members: collection-backed or manual repeater. */
export declare function sharedTeamWidget(): SharedWidgetDef;
/** YouTube + Aparat embed with player options. */
export declare function sharedVideoEmbedWidget(): SharedWidgetDef;
export declare function sharedAudioWidget(): SharedWidgetDef;
export declare function sharedBeforeAfterWidget(): SharedWidgetDef;
export declare function sharedLottieWidget(): SharedWidgetDef;
/** Login form shell — platform wires auth submit. */
export declare function sharedLoginFormWidget(): SharedWidgetDef;
/** Register form shell — platform wires auth submit. */
export declare function sharedRegisterFormWidget(): SharedWidgetDef;
/** Nested section shell (platforms create column children in their own create()). */
export declare function sharedSectionWidget(): SharedWidgetDef;
export declare function sharedColumnsWidget(): SharedWidgetDef;
export declare function sharedOffCanvasWidget(): SharedWidgetDef;
export declare function sharedFlexContainerWidget(): SharedWidgetDef;
export declare function sharedGridContainerWidget(): SharedWidgetDef;
export declare function sharedSiteHeaderWidget(): SharedWidgetDef;
export declare function sharedSiteFooterWidget(): SharedWidgetDef;
/** All gap widgets (team + media + layout + chrome + auth). */
export declare function sharedGapWidgets(_iconOptions?: SharedOption[]): SharedWidgetDef[];
//# sourceMappingURL=widgets-gaps.d.ts.map