import { IReduxState } from '../../../../exports/store/interfaces';

export function hooksSelector(state: IReduxState) {
  return state.hooks;
}
