import { Strings, t } from '@apitable/core';
import { Modal } from 'pc/components/common';
import { BillingErrorCode } from './const';
import { ApiErrorManager } from './error_manager';
// @ts-ignore
import { triggerUsageAlertUniversal } from 'enterprise/billing/trigger_usage_alert';

export * from './const';
export const apiErrorManager = new ApiErrorManager();
apiErrorManager.registerErrorHandler(BillingErrorCode.Forbidden, () => {
  Modal.error({
    title: t(Strings.usage_overlimit_alert_title),
    content: t(Strings.billing_over_limit_tip_forbidden),
    onOk: () => location.reload(),
    onCancel: () => location.reload(),
  });
});
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
