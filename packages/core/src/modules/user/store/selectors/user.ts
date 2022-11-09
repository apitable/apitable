import { IReduxState } from '../../../../store/interfaces';

export function userStateSelector(state: IReduxState) {
  return state.user;
}
