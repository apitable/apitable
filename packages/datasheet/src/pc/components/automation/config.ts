import { Strings, t } from '@apitable/core';

export const CONST_MAX_TRIGGER_COUNT = 3;
export const CONST_MAX_ACTION_COUNT = 9;

export function orDisabled<T>(arr: T[], enabled: boolean) {
  return enabled ? arr : [];
}

export const AutomationConstant = {
  DEFAULT_TEXT: t(Strings.click_start),
  defaultColor: 40,
  whiteColor: 50,
  buttonHeight: 24,
};
