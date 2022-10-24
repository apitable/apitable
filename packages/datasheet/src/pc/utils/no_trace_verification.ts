import { Modal } from '@vikadata/components';
import { ConfigConstant, isPrivateDeployment } from '@apitable/core';
import * as React from 'react';

/**
 * 初始化无痕验证
 * @param callback 要执行的回调，该回调接收验证字符串
 * @param renderTo 指定滑块验证渲染在哪里
 */
export const initNoTraceVerification = (successCallback: React.Dispatch<React.SetStateAction<string | null>>,
  renderTo: string = ConfigConstant.CaptchaIds.DEFAULT) => {
  if (isPrivateDeployment()) {
    return;
  }
  if (!window['AWSC']) {
    // return;
    setTimeout(() => {initNoTraceVerification(successCallback);}, 1000);
    console.error('人机验证代码加载失败');
    throw new Error('人机验证代码加载失败');
  }

  const successFun = data => {
    Modal.destroyAll();
    successCallback(data);
  };

  window['AWSC'].use('nvc', (state, module) => {
    window['nvc'] = module.init({
      appkey: ConfigConstant.nvcAppkey,
      scene: 'nvc_login', // nvc_login 和 nc_login
      // test: module.TEST_PASS, // 无痕验证通过
      // test: module.TEST_BLOCK, // 无痕验证未通过，直接拦截
      // test: module.TEST_NC_PASS, // 唤醒滑动验证，且滑动验证通过
      // test: module.TEST_NC_BLOCK, // 唤醒滑动验证，且滑动验证不通过
      renderTo,
      success: successFun,
    });
  });
};

export const execNoTraceVerification = (callback: (data?: string) => void) => {
  if (isPrivateDeployment()) {
    callback(undefined);
    return;
  }

  if (!window['nvc']) {
    throw new Error('人机验证代码加载失败');
  }
  window['nvc'].getNVCValAsync(nvcVal => callback(nvcVal));
};
