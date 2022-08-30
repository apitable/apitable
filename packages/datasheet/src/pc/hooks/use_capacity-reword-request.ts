import { Message } from 'pc/components/common';
import { Api } from '@vikadata/core';

export const useCapacityRequest = () => {
  const getCapacityListReq = (isExpire: boolean, pageNo: number) => {
    return Api.getCapacityRewardList(isExpire, pageNo).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
     
  };
  return { getCapacityListReq };
};
