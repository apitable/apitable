import { ISubAdminListData, IPermissionGroup, ISpaceResource } from '../interface';
import * as actions from '../action_constants';
import { Api } from 'api';
import { ConfigConstant } from '../../config';

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
  return dispatch => {
    Api.getlistRole(JSON.stringify({ ...pageObjectParams, pageNo })).then(res => {
      const { success, data } = res.data;
      success && dispatch(updateSubAdminListData(data));
    });
  };
}

export function getMainAdminInfo() {
  return dispatch => {
    Api.getMainAdminInfo().then(res => {
      const { success, data } = res.data;
      success && dispatch(updateMainAdminInfo(data));
    });
  };
}

export function spaceResource() {
  return dispatch => {
    Api.getSpaceResource().then(res => {
      const { success, data } = res.data;
      success && dispatch(updateSpaceResource(data));
    });
  };
}
