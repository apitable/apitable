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

import { IApiWrapper, ICollaborator, IMirror, IMirrorClient, IReduxState, IServerMirror, ITemporaryView } from 'exports/store/interfaces';
import { getMirror, getMirrorLoading, getMirrorSourceInfo } from 'modules/database/store/selectors/resource/mirror';
import { getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { deleteNode } from 'modules/space/store/actions/catalog_tree';
import { StatusCode } from 'config';
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { fetchMirrorDataPack, fetchMirrorInfo, fetchShareMirrorDataPack, fetchShareMirrorInfo } from '../../../../api/mirror_api';
import * as ActionConstants from 'modules/shared/store/action_constants';
import { batchActions } from 'redux-batched-actions';
import { CACHE_TEMPORARY_VIEW, UPDATE_MIRROR_INFO, UPDATE_MIRROR_NAME } from 'modules/shared/store/action_constants';
import { datasheetErrorCode, fetchDatasheetPackSuccess } from 'modules/database/store/actions/resource/datasheet';

interface IFetchMirrorSuccess {
  response: AxiosResponse<IApiWrapper & { data: IServerMirror }>;
  mirrorId: string;
  dispatch: Dispatch;
  getState: () => IReduxState;
}

export const fetchMirrorInfoApi = (mirrorId: string, shareId?: string, _templateId?: string) => {
  let requestMethod = fetchMirrorInfo;
  if (shareId) {
    requestMethod = () => fetchShareMirrorInfo(shareId, mirrorId);
  }
  return requestMethod(mirrorId);
};

export const fetchMirrorDataPackApi = (mirrorId: string, shareId?: string, recordIds?: string[]) => {
  let requestMethod = fetchMirrorDataPack;
  if (shareId) {
    requestMethod = () => fetchShareMirrorDataPack(shareId, mirrorId);
  }
  return requestMethod(mirrorId, recordIds);
};

export function fetchMirrorPack(
  mirrorId: string,
  successCb?: (props?: IFetchMirrorSuccess) => void,
  _overwrite?: boolean,
  extra?: { recordIds: string[] },
  failCb?: () => void,
) {
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const mirror = getMirror(state, mirrorId);
    const { shareId, templateId } = state.pageParams;
    const mirrorLoading = getMirrorLoading(state, mirrorId);
    const datasheet = getDatasheet(state, getMirrorSourceInfo(state, mirrorId)?.datasheetId);
    if (mirrorLoading) {
      return;
    }
    if (!mirror || datasheet?.isPartOfData) {
      return fetchMirrorInfoApi(mirrorId, shareId, templateId)
        .then(response => {
          // if (!response.data.success && state.catalogTree.treeNodesMap[mirrorId]) {
          //   // dispatch(deleteNode({ nodeId: mirrorId, parentId: state.catalogTree.treeNodesMap[mirrorId].parentId }));
          //   // return Promise.reject();
          // }
          return Promise.resolve({ mirrorId, response, dispatch, getState });
        })
        .catch(e => {
          dispatch(setMirrorErrorCode(mirrorId, StatusCode.COMMON_ERR));
          throw e;
        })
        .then(async props => {
          const { recordIds } = extra || {};
          await fetchSuccess(props, recordIds, successCb, failCb);
        });
    }
    successCb && successCb();
    return;
  };
}

export const setMirrorErrorCode = (mirrorId: string, code: number | null) => {
  return {
    type: ActionConstants.MIRROR_ERROR_CODE,
    payload: code,
    mirrorId,
  };
};

const fetchSuccess = (
  { dispatch, getState, response, mirrorId }: { dispatch: any; getState: () => IReduxState; response: any; mirrorId: string },
  recordIds?: string[],
  successCb?: (props?: IFetchMirrorSuccess) => void,
  failCb?: () => void,
) => {
  const { data, success, code } = response.data;
  if (success) {
    const _batchActions: any[] = [
      setMirror(
        {
          ...data.mirror,
          sourceInfo: data.sourceInfo,
          snapshot: data.snapshot,
        },
        data.mirror.id,
      ),
    ];

    const state = getState();
    const shareId = state.pageParams.shareId;
    const sourceDatasheetId = data.sourceInfo.datasheetId;
    const datasheet = getDatasheet(state, sourceDatasheetId);
    if (!datasheet || datasheet.isPartOfData) {
      fetchMirrorDataPackApi(mirrorId, shareId, recordIds)
        .then(response => {
          return Promise.resolve({
            datasheetId: sourceDatasheetId,
            responseBody: response.data,
            dispatch,
            getState,
            isPartOfData: Boolean(recordIds),
          });
        })
        .catch(e => {
          if (state.catalogTree.treeNodesMap[sourceDatasheetId]) {
            dispatch(deleteNode({ nodeId: sourceDatasheetId, parentId: state.catalogTree.treeNodesMap[sourceDatasheetId]!.parentId }));
          }
          dispatch(datasheetErrorCode(sourceDatasheetId, StatusCode.COMMON_ERR));
          throw e;
        })
        .then(props => {
          fetchDatasheetPackSuccess(props as any);
          props.responseBody.success ? successCb && successCb() : failCb && failCb();
        }, e => {
          console.error('fetchMirrorDataPackApi error', e);
        });
    } else {
      successCb && successCb();
    }
    dispatch(batchActions(_batchActions));
    return;
  }
  dispatch(setMirrorErrorCode(mirrorId, code));
  failCb && failCb();
};

export const setMirrorLoading = (status: boolean, mirrorId: string): ISetMirrorLoadingAction => {
  return {
    type: ActionConstants.SET_MIRROR_LOADING,
    payload: status,
    mirrorId: mirrorId,
  };
};

export const setMirror = (data: IMirror, mirrorId: string): ISetMirrorDataAction => {
  return {
    type: ActionConstants.SET_MIRROR_DATA,
    payload: data,
    mirrorId: mirrorId,
  };
};

export const resetMirror = (mirrorId: string) => {
  return {
    type: ActionConstants.RESET_MIRROR,
    mirrorId: mirrorId,
  };
};

export interface IResetMirror {
  type: typeof ActionConstants.RESET_MIRROR;
  mirrorId: string;
}

export interface ISetMirrorLoadingAction {
  type: typeof ActionConstants.SET_MIRROR_LOADING;
  payload: boolean;
  mirrorId: string;
}

export interface ISetMirrorDataAction {
  type: typeof ActionConstants.SET_MIRROR_DATA;
  payload: IMirror;
  mirrorId: string;
}

export const setMirrorClient = (client: Partial<IMirrorClient>): ISetMirrorClientAction => {
  return {
    type: ActionConstants.SET_MIRROR_CLIENT,
    payload: client,
  };
};

export const activeMirrorCollaborator = (payload: ICollaborator, resourceId: string) => {
  return {
    type: ActionConstants.MIRROR_ACTIVE_COLLABORATOR,
    mirrorId: resourceId,
    payload,
  };
};

export const deactivateMirrorCollaborator = (payload: { socketId: string }, resourceId: string) => {
  return {
    type: ActionConstants.MIRROR_DEACTIVATE_COLLABORATOR,
    mirrorId: resourceId,
    payload,
  };
};

export interface ISetMirrorClientAction {
  type: typeof ActionConstants.SET_MIRROR_CLIENT;
  payload: Partial<IMirrorClient>;
}

export const updateMirrorName = (newName: string, mirrorId: string) => {
  return {
    type: UPDATE_MIRROR_NAME,
    mirrorId,
    payload: newName,
  };
};

export const updateMirror = (mirrorId: string, data: Partial<IMirror>) => {
  return {
    type: UPDATE_MIRROR_INFO,
    mirrorId,
    payload: data,
  };
};

export interface IUpdateMirrorInfoAction {
  type: typeof ActionConstants.UPDATE_MIRROR_INFO;
  mirrorId: string;
  payload: Partial<IMirror>;
}

export interface IUpdateMirrorName {
  type: typeof ActionConstants.UPDATE_MIRROR_NAME;
  mirrorId: string;
  payload: string;
}

export interface ISetMirrorClientAction {
  type: typeof ActionConstants.SET_MIRROR_CLIENT;
  payload: Partial<IMirrorClient>;
}

export const cacheTemporaryView = (viewProperty: ITemporaryView, mirrorId: string) => {
  return {
    type: CACHE_TEMPORARY_VIEW,
    payload: viewProperty,
    mirrorId,
  };
};
