import { Api } from '@apitable/core';

export const useBilling = () => {
  // 查询账户积分信息
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
