import { IReduxState } from '../interface';

export const labsFeatureOpen = (state: IReduxState, key: string) => {
  return state.labs.includes(key);
};
