import { IReduxState } from '../../../../exports/store/interfaces';

export function userStateSelector(state: IReduxState) {
  return state.user;
}
