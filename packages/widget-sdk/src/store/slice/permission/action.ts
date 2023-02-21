import { IWidgetPermission } from 'interface';
import { SET_PERMISSION } from '../../constant';

export interface ISetPermissionAction {
  type: typeof SET_PERMISSION;
  payload: IWidgetPermission;
}

export const setPermissionAction = (payload: IWidgetPermission): ISetPermissionAction => ({ type: SET_PERMISSION, payload });
