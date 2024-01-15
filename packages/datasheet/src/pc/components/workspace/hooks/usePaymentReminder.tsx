import dayjs from 'dayjs';
import { useEffect } from 'react';
import store from 'store2';
import { ConfigConstant, Strings, t } from '@apitable/core';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
// @ts-ignore
import { usageWarnModal } from 'enterprise/subscribe_system/usage_warn_modal/usage_warn_modal';

function withinFirstFiveDaysOfRegistration(time: number) {
  const now = dayjs();
  const registrationDate = dayjs(time);
  const diffInDays = now.diff(registrationDate, 'day');
  return diffInDays <= 5;
}

function withinLast48Hours(time: number) {
  const now = dayjs();
  const givenTime = dayjs(time);
  const diffInHours = now.diff(givenTime, 'hour');
  return diffInHours < 48;
}

const LAST_PAYMENT_REMINDER_TIME = 'LAST_PAYMENT_REMINDER_TIME';

export const usePaymentReminder = () => {
  const userInfo = useAppSelector((state) => state.user?.info);
  const subscription = useAppSelector((state) => state.billing?.subscription);

  useEffect(() => {
    if (!userInfo || !subscription) return;
    // debugger

    const signUpTime = userInfo.signUpTime;
    const isTrial = subscription?.onTrial;
    const isSubscribed = subscription?.deadline !== -1;

    if (isSubscribed || isTrial) return;

    if (withinLast48Hours(Number(signUpTime))) return;

    const lastReminderTime = store.get(LAST_PAYMENT_REMINDER_TIME);

    if (lastReminderTime && withinLast48Hours(lastReminderTime)) return;

    store.set(LAST_PAYMENT_REMINDER_TIME, Date.now());

    if (withinFirstFiveDaysOfRegistration(Number(signUpTime))) {
      if (getEnvVariables().IS_AITABLE) {
        TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.AI_TABLE_VIDEO, true);
        return;
      }

      TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.INTRODUCTION_VIDEO_14_SERVER, true);
      return;
    }

    if (getEnvVariables().IS_AITABLE) {
      TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.PRICE_MODAL, true);
      return;
    }

    usageWarnModal({
      title: t(Strings.payment_reminder_modal_title),
      alertContent: t(Strings.payment_reminder_modal_content),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription]);
};
