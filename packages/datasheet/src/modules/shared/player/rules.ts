/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import dayjs from 'dayjs';
import * as dot from 'dot-object';
import { isMatch } from 'lodash';
import { ScreenWidth, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import { getInitializationData, isMobileApp } from 'pc/utils/env';

type IPlayerRulesCondition = 'device' | 'identity' | 'sign_up_time' | 'url';
type IPlayerRulesOperator =
  | 'IS'
  | 'IS_BEFORE'
  | 'IS_AFTER'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'EQUAL'
  | 'ONE_OF_TRUE'
  | 'ALL_OF_TRUE'
  | 'ALL_OF_FALSE'
  | 'INCLUDES'
  | 'EXCLUDES';

enum PlayerRulesConditionType {
  DEVICE = 'device',
  IDENTITY = 'identity',
  SIGN_UP_TIME = 'sign_up_time',
  URL = 'url',
  LABS = 'labs',
  EDITION = 'edition',
}

enum DeviceType {
  Mobile = 'mobile',
  PC = 'pc',
  App = 'app',
}

enum PlayerRulesConditionArgsType {
  SHARE_ID = 'shareId',
  SPACE_ID = 'spaceId',
  TEMPLATE_ID = 'templateId',
  AI_ONBOARDING = 'ai_onboarding',
}

export const getConditionValue = (str: string) => {
  const state = store.getState();
  const user = Selectors.getUserState(state);
  const userInfo = user.info;
  const userWizards = userInfo?.wizards;
  if (str.includes('.')) {
    const tempObj = dot.object({ [str]: null });
    const strKey = Object.keys(tempObj)[0];
    switch (strKey) {
      case 'wizard': {
        const id = tempObj[strKey].findIndex((item: any) => item);
        return userWizards && userWizards.hasOwnProperty(id) ? userWizards[id] : 0;
      }
      default: {
        return str;
      }
    }
  }

  switch (str) {
    case PlayerRulesConditionType.DEVICE: {
      const width = window.innerWidth;
      if (isMobileApp()) {
        return DeviceType.App;
      }
      return width > ScreenWidth.md ? DeviceType.PC : DeviceType.Mobile;
    }
    case PlayerRulesConditionType.IDENTITY: {
      const rulesContext = {
        main_admin: userInfo && userInfo?.isMainAdmin,
        sub_admin: userInfo && !userInfo.isMainAdmin && userInfo.isAdmin,
        member: true, // All have the status of ordinary members by default for the time being
        visitor: false,
      };
      return Object.keys(rulesContext).filter((key) => rulesContext[key]);
    }
    case PlayerRulesConditionType.SIGN_UP_TIME: {
      return userInfo?.signUpTime;
    }
    case PlayerRulesConditionType.URL: {
      return window.location.href;
    }
    case PlayerRulesConditionType.LABS: {
      return state.labs;
    }
    case PlayerRulesConditionType.EDITION: {
      return getInitializationData().envVars.EDITION?.split('-')[0];
    }
    default:
      return str;
  }
};

export const getConditionArgsValue = (str: any) => {
  const state = store.getState();
  switch (str) {
    case PlayerRulesConditionArgsType.SHARE_ID: {
      return state.pageParams.shareId;
    }
    case PlayerRulesConditionArgsType.TEMPLATE_ID: {
      return state.pageParams.templateId;
    }
    case PlayerRulesConditionArgsType.SPACE_ID: {
      return state.space.activeId;
    }
    case PlayerRulesConditionArgsType.AI_ONBOARDING: {
      return new URLSearchParams(window.location.search).get('template');
    }
    default:
      return str;
  }
};

export const isRulePassed = (conditionValue: any, operator: IPlayerRulesOperator, conditionArgs: any) => {
  switch (operator) {
    case 'IS': {
      return Boolean(conditionValue === conditionArgs);
    }
    case 'IS_BEFORE': {
      return dayjs(conditionValue).isBefore(conditionArgs);
    }
    case 'IS_AFTER': {
      return dayjs(conditionValue).isAfter(conditionArgs);
    }
    case 'GREATER_THAN': {
      return Number(conditionValue) > Number(conditionArgs);
    }
    case 'GREATER_THAN_OR_EQUAL': {
      return Number(conditionValue) >= Number(conditionArgs);
    }
    case 'LESS_THAN': {
      return Number(conditionValue) < Number(conditionArgs);
    }
    case 'LESS_THAN_OR_EQUAL': {
      return Number(conditionValue) <= Number(conditionArgs);
    }
    case 'EQUAL': {
      return Number(conditionValue) === Number(conditionArgs);
    }
    case 'ONE_OF_TRUE': {
      const conditionArr = eval('(' + conditionArgs + ')');
      return Boolean(conditionArr.find((item: any) => conditionValue.includes(item)));
    }
    case 'ALL_OF_TRUE': {
      const conditionArr = eval('(' + conditionArgs + ')');
      return Boolean(conditionArr.every((item: any) => conditionValue.includes(item)));
    }
    case 'ALL_OF_FALSE': {
      const conditionArr = eval('(' + conditionArgs + ')');
      return Boolean(conditionArr.every((item: any) => !conditionValue.includes(item)));
    }
    case 'INCLUDES': {
      const conditionArgsValue = getConditionArgsValue(conditionArgs);
      return Boolean(String(conditionValue).includes(conditionArgsValue));
    }
    case 'EXCLUDES': {
      const conditionArgsValue = getConditionArgsValue(conditionArgs);
      return !String(conditionValue).includes(conditionArgsValue);
    }
    default:
      return false;
  }
};

export const isRulesPassed = (rulesConfig: any[] | undefined, ruleIds: string[] | undefined) => {
  if (!ruleIds) {
    return true;
  }
  const someIsNotPass = ruleIds.find((ruleId) => {
    const curRule = rulesConfig?.find((item) => item.id === ruleId);
    if (!curRule) {
      return true;
    }
    const conditionValue = getConditionValue(curRule.condition as IPlayerRulesCondition);
    return !isRulePassed(conditionValue, curRule.operator as IPlayerRulesOperator, curRule.conditionArgs);
  });
  return !someIsNotPass;
};

// Determine if the current time is within the configured time interval
export const isTimeRulePassed = (startTime?: string | number, endTime?: string | number) => {
  if (!startTime && !endTime) {
    return true;
  }
  const cur = dayjs().valueOf();
  const start = startTime ? dayjs(startTime).valueOf() : Number.NEGATIVE_INFINITY;
  const end = endTime ? dayjs(endTime).valueOf() : Number.POSITIVE_INFINITY;
  return cur > start && cur < end;
};

// Determine if eventState matches
export const isEventStateMatch = (args: any, eventStatesConfig: any) => {
  if (!eventStatesConfig) {
    return true;
  }
  return isMatch(args, JSON.parse(eventStatesConfig));
};
