import { DEFAULT_PERMISSION } from 'core';
import { ISetPermissionAction } from './action';
import { SET_PERMISSION } from '../../constant';
import { IWidgetPermission } from 'interface';

export const DEFAULT_WIDGET_PERMISSION = {
  storage: {
    editable: false
  },
  datasheet: DEFAULT_PERMISSION
};

export function permissionReducer(
  state: IWidgetPermission = DEFAULT_WIDGET_PERMISSION,
  action: ISetPermissionAction
): IWidgetPermission {
  switch (action.type) {
    case SET_PERMISSION: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: return state;
  }
}
