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

import { ISubAdminListData, IPermissionGroup, ISpaceResource } from 'exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { Api } from 'exports/api';
import { ConfigConstant } from 'config';

export function updateSubAdminListData(info: ISubAdminListData) {
  return {
    type: actions.UPDATE_SUB_ADMIN_LIST_DATA,
    payload: info,
  };
}

export function updateMainAdminInfo(list: IPermissionGroup[]) {
  return {
    type: actions.UPDATE_MAIN_ADMIN_INFO,
    payload: list,
  };
}
export function updateSpaceResource(resource: ISpaceResource) {
  return {
    type: actions.UPDATE_SPACE_RESOURCE,
    payload: resource,
  };
}
export function getSubAdminList(pageNo: number) {
  const pageObjectParams = {
    pageSize: ConfigConstant.SUB_ADMIN_LIST_PAGE_SIZE,
    order: ConfigConstant.ORDER_CREATE_TIME,
    sort: ConfigConstant.SORT_ASC,
  };
  return (dispatch: any) => {
    Api.getlistRole(JSON.stringify({ ...pageObjectParams, pageNo })).then(res => {
      const { success, data } = res.data;
      success && dispatch(updateSubAdminListData(data));
    }, err => {
      console.error('API.getlistRole error', err);
    });
  };
}

export function getMainAdminInfo() {
  return (dispatch: any) => {
    Api.getMainAdminInfo().then(res => {
      const { success, data } = res.data;
      success && dispatch(updateMainAdminInfo(data));
    }, err => {
      console.error('API.getMainAdminInfo', err);
    });
  };
}

export function spaceResource() {
  return (dispatch: any) => {
    Api.getSpaceResource().then(res => {
      const { success, data } = res.data;
      success && dispatch(updateSpaceResource(data));
    }, err => {
      console.error('API.getSpaceResource', err);
    });
  };
}
