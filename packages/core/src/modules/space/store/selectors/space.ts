import { IReduxState } from '../../../../store/interfaces';

export const activeSpaceId = (state: IReduxState) => {
  return state.space.activeId;
};
