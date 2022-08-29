import { IReduxState } from '../interface';

export function hooksSelector(state: IReduxState) {
  return state.hooks;
}
