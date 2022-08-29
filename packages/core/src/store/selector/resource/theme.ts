import { IReduxState, ThemeName } from 'store';

export const getTheme = (state: IReduxState) => {
  if (!state.theme) return ThemeName.Light;
  return state.theme;
};