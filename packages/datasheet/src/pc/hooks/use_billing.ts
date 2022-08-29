import { useEffect, useState } from 'react';
import { Api, ISubscription } from '@vikadata/core';
import { getBillingInfo } from 'pc/common/billing';

export const useBillingInfoReq = (spaceId: string) => {
  const [subscription, setSubscription] = useState<ISubscription | null>(null);
  useEffect(() => {
    if (!spaceId) {
      return;
    }
    getBillingInfo(spaceId).then(data => {
      setSubscription(data || null);
    });
  }, [spaceId]);
  return { subscription };
};

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
