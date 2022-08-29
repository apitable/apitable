import { SET_THEME } from 'store/action_constants';
import { IThemeAction, ThemeName } from 'store/interface';
import produce from 'immer';

export const theme = produce((themeDraft: ThemeName = ThemeName.Light, action: IThemeAction) => {
  if (action.type === SET_THEME) {
    themeDraft = action.payload;
    return action.payload;
  }
  return themeDraft;
});