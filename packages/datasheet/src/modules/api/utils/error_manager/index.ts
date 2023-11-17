import { Strings, t } from '@apitable/core';
// @ts-ignore
import { triggerUsageAlertUniversal } from 'enterprise/billing';
import { BillingErrorCode } from './const';
import { ApiErrorManager } from './error_manager';

export * from './const';
export const apiErrorManager = new ApiErrorManager();

apiErrorManager.registerErrorHandler(BillingErrorCode.Common, () => {
  triggerUsageAlertUniversal(t(Strings.billing_over_limit_tip_common));
});
apiErrorManager.registerErrorHandler(BillingErrorCode.Seat, () => {
  triggerUsageAlertUniversal(t(Strings.subscribe_seats_usage_over_limit));
});
apiErrorManager.registerErrorHandler(BillingErrorCode.Credit, () => {
  triggerUsageAlertUniversal(t(Strings.subscribe_credit_usage_over_limit));
});
apiErrorManager.registerErrorHandler(BillingErrorCode.Widget, () => {
  triggerUsageAlertUniversal(t(Strings.billing_over_limit_tip_widget));
});
