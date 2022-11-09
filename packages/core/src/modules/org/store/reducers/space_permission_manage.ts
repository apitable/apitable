import {
  ISpacePermissionManage,
  IUpdateSubAdminListDataAction,
  IUpdateMainAdminInfoAction,
  IUpdateSpaceResourceAction,
} from '../../../../store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { produce } from 'immer';
const defaultState: ISpacePermissionManage = {
  subAdminListData: null,
  mainAdminInfo: null,
  spaceResource: null,
};
type ISpacePermissionManageActions = IUpdateSubAdminListDataAction 
  | IUpdateMainAdminInfoAction | IUpdateSpaceResourceAction;

export const spacePermissionManage = produce((
  data: ISpacePermissionManage = defaultState,
  action: ISpacePermissionManageActions,
) => {
  switch (action.type) {
    case actions.UPDATE_SUB_ADMIN_LIST_DATA: {
      data.subAdminListData = action.payload;
      return data;
    }
    case actions.UPDATE_MAIN_ADMIN_INFO: {
      data.mainAdminInfo = action.payload;
      return data;
    }
    case actions.UPDATE_SPACE_RESOURCE: {
      data.spaceResource = action.payload;
      return data;
    }
    default:
      return data;
  }
});
