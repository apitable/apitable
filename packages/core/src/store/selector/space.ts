import { IReduxState } from '../interface';

export const activeSpaceId = (state: IReduxState) => {
  return state.space.activeId;
};
