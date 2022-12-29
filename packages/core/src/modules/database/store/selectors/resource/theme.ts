import { IReduxState, ThemeName } from '../../../../../exports/store';

export const getTheme = (state: IReduxState) => {
  if (!state.theme) return ThemeName.Light;
  return state.theme;
};