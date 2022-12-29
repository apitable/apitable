import { Api } from '@apitable/core';

export const useBilling = () => {
  const getUserIntegral = () => {
    return Api.getUserIntegral().then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return false;
    });
  };
  return { getUserIntegral };
};
