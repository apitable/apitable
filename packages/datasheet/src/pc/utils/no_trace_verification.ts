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

import * as React from 'react';
import { ConfigConstant, getLanguage, isPrivateDeployment } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';

/**
 * Check if the environment requires no-trace verification.
 */
export const needNoTraceVerification = (): boolean => {
  if (process.env.SSR) { 
    return false;
  }
  const env = getEnvVariables();
  if (isPrivateDeployment() || env.IS_SELFHOST) {
    return false;
  }
  return true;
};

/**
 * Initialization without trace verification.
 * 
 * @param callback The callback to be executed which receives the validation string
 * @param renderTo Specify where the slider validation renders
 * @param triggerButtonId Specify the button that triggers the slider validation
 */
export const initNoTraceVerification = (
  successCallback: React.Dispatch<React.SetStateAction<string | null>> | ((data?: string) => void),
  renderTo: string = ConfigConstant.CaptchaIds.DEFAULT,
  triggerButtonId: string = ConfigConstant.CAPTCHA_BUTTON_ID,
) => {
  const needVerify = needNoTraceVerification();
  if (!needVerify) {
    return;
  }

  if (!window['AliyunCaptchaConfig']) {
    // return;
    setTimeout(() => {
      initNoTraceVerification(successCallback, renderTo, triggerButtonId);
    }, 1000);
    console.error('Man-machine verification code load failure');
    throw new Error('Man-machine verification code load failure');
  }

  const language = getLanguage();

  const successFun = (data: string) => {
    // Modal.destroyAll();
    successCallback(data);
  };

  window['initAliyunCaptcha']({
    SceneId: ConfigConstant.CAPTCHA_SCENE_ID,
    mode: 'popup',
    element: `#${renderTo}`,
    button: `#${triggerButtonId}`,
    success: successFun,
    language: language && language.startsWith('en') ? 'en' : undefined,
  });
};
