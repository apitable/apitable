import { SET_THEME } from '../../../../shared/store/action_constants';
import { IThemeAction, ThemeName } from '../../../../../exports/store/interfaces';
import produce from 'immer';

export const theme = produce((themeDraft: ThemeName = ThemeName.Light, action: IThemeAction) => {
  if (action.type === SET_THEME) {
    themeDraft = action.payload;
    return action.payload;
  }
  return themeDraft;
});