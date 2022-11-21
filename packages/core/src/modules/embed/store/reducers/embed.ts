
import produce from 'immer';
import * as actions from '../action_constants';
import { IEmbedInfo, IEmbedInfoAction } from '../interfaces/embed';

const defaultEmbedInfo = {};

export const embedInfo = produce((embedInfoDraft: IEmbedInfo = defaultEmbedInfo, action: IEmbedInfoAction) => {
  switch (action.type) {
    case actions.SET_EMBED_INFO: {
      return {
        ...embedInfoDraft,
        ...action.payload
      };
    }
    default:
      return embedInfoDraft;
  }
});