import { ActionConstants } from 'store';
import { IShareInfo } from 'store/interface';

/**
 * 获取分享信息
 */
export const setShareInfo = (shareInfo: IShareInfo) => {
  return {
    type: ActionConstants.SET_SHARE_INFO,
    payload: shareInfo,
  };
};

