import { ActionConstants } from 'store';
import { IShareInfo } from '../../../../store/interfaces';

/**
 * get share info
 */
export const setShareInfo = (shareInfo: IShareInfo) => {
  return {
    type: ActionConstants.SET_SHARE_INFO,
    payload: shareInfo,
  };
};

