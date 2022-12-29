/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { produce } from 'immer';
import {
  ISpacePermissionManage, IUpdateMainAdminInfoAction, IUpdateSpaceResourceAction, IUpdateSubAdminListDataAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

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
}, defaultState);
