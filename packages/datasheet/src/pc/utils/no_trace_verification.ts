import { Modal } from '@vikadata/components';
import { ConfigConstant, isPrivateDeployment } from '@apitable/core';
import { getEnvVariables } from 'pc/utils/env';
import * as React from 'react';

/**
 * Initialization without trace verification
 * @param callback The callback to be executed which receives the validation string
 * @param renderTo Specify where the slider validation renders
 */
export const initNoTraceVerification = (successCallback: React.Dispatch<React.SetStateAction<string | null>>,
  renderTo: string = ConfigConstant.CaptchaIds.DEFAULT) => {
  if (process.env.SSR) return;
  const env = getEnvVariables();
  if (isPrivateDeployment() || env.DISABLE_AWSC) {
    return;
  }
  if (!window['AWSC']) {
    // return;
    setTimeout(() => {initNoTraceVerification(successCallback);}, 1000);
    console.error('Man-machine verification code load failure');
    throw new Error('Man-machine verification code load failure');
  }

  const successFun = data => {
    Modal.destroyAll();
    successCallback(data);
  };

  window['AWSC'].use('nvc', (state, module) => {
    window['nvc'] = module.init({
      appkey: ConfigConstant.nvcAppkey,
      scene: 'nvc_login', // nvc_login and nc_login
      // test: module.TEST_PASS, // No trace verification passed
      // test: module.TEST_BLOCK, // No trace verification failed, direct blocking
      // test: module.TEST_NC_PASS, // Wake-up sliding verification and sliding verification passes
      // test: module.TEST_NC_BLOCK, // Wake-up sliding verification and sliding verification does not pass
      renderTo,
      success: successFun,
    });
  });
};

export const execNoTraceVerification = (callback: (data?: string) => void) => {
  if (process.env.SSR) return;
  const env = getEnvVariables();
  if (isPrivateDeployment() || env.DISABLE_AWSC) {
    callback(undefined);
    return;
  }

  if (!window['nvc']) {
    throw new Error('Man-machine verification code load failure');
  }
  window['nvc'].getNVCValAsync(nvcVal => callback(nvcVal));
};
