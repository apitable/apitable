import produce from 'immer';
import * as actions from '../action_constants';
import { IShareInfo, IShareInfoAction } from '../interface';

const defaultShareInfo = {
};

export const share = produce((shareInfoDraft: IShareInfo = defaultShareInfo, action: IShareInfoAction) => {
  switch (action.type) {
    case actions.SET_SHARE_INFO: {
      shareInfoDraft = action.payload;
      return shareInfoDraft;
    }

    default:
      return shareInfoDraft;
  }
});
