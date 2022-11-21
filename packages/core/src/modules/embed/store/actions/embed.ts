import * as actions from '../action_constants';
import { IEmbedInfo } from '../interfaces/embed';

export const setEmbedInfo = (embedInfo: IEmbedInfo) => {
  return {
    type: actions.SET_EMBED_INFO,
    payload: embedInfo
  };
};