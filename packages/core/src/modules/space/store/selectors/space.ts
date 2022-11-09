import { IReduxState } from '../../../../exports/store/interfaces';

export const activeSpaceId = (state: IReduxState) => {
  return state.space.activeId;
};
