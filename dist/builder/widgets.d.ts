import type { SharedOption, SharedWidgetDef } from "./types";
import { sharedGapWidgets, sharedTeamWidget, sharedVideoEmbedWidget, sharedAudioWidget, sharedBeforeAfterWidget, sharedLottieWidget, sharedLoginFormWidget, sharedRegisterFormWidget, sharedSectionWidget, sharedColumnsWidget, sharedOffCanvasWidget, sharedFlexContainerWidget, sharedGridContainerWidget, sharedSiteHeaderWidget, sharedSiteFooterWidget } from "./widgets-gaps";
export { sharedGapWidgets, sharedTeamWidget, sharedVideoEmbedWidget, sharedAudioWidget, sharedBeforeAfterWidget, sharedLottieWidget, sharedLoginFormWidget, sharedRegisterFormWidget, sharedSectionWidget, sharedColumnsWidget, sharedOffCanvasWidget, sharedFlexContainerWidget, sharedGridContainerWidget, sharedSiteHeaderWidget, sharedSiteFooterWidget, };
export type SharedFormOptions = {
    formKeyLabel?: string;
    fieldsLabel?: string;
};
export declare const DEFAULT_ICON_OPTIONS: SharedOption[];
/** Shared pro form. `formKey` is resolved by the platform adapter (ERP: Marketing form slug). */
export declare function sharedFormWidget(opts?: SharedFormOptions): SharedWidgetDef;
export declare function sharedContentWidgets(iconOptions?: SharedOption[]): SharedWidgetDef[];
/** Content widgets + gap widgets (team/media/layout/chrome/auth) for platforms that want one spread. */
export declare function sharedAllBuilderWidgets(iconOptions?: SharedOption[]): SharedWidgetDef[];
//# sourceMappingURL=widgets.d.ts.map