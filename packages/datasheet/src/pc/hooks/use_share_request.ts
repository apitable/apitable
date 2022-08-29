import { Api } from '@vikadata/core';
import { Message } from 'pc/components/common';

export const useShareRequest = () => {
  /** 获取分享页的信息 */
  function readShareInfoReq(shareId: string) {
    return Api.readShareInfo(shareId).then(res => {
      const { success, message, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
    });
  }

  return { readShareInfoReq };
};