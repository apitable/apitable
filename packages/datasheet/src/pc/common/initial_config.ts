import { isPrivateDeployment } from '@apitable/core';

export const initialConfig = () => {
  if (!isPrivateDeployment()) {
    window.__vika_custom_config__ = {
      loginMode: 'identify_code_login',
    };
  }
};