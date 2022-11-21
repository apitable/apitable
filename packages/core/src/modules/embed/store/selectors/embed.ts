import { IReduxState } from '../../../../exports/store/interfaces';

export const getEmbedInfo = (state: IReduxState) => {
  return state.embedInfo;
};