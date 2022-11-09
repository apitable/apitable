import { ActionConstants } from '../../../../exports/store';
import { IShareInfo } from '../../../../exports/store/interfaces';

/**
 * get share info
 */
export const setShareInfo = (shareInfo: IShareInfo) => {
  return {
    type: ActionConstants.SET_SHARE_INFO,
    payload: shareInfo,
  };
};

