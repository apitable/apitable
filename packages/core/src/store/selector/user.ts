import { IReduxState } from '../interface';

export function userStateSelector(state: IReduxState) {
  return state.user;
}
