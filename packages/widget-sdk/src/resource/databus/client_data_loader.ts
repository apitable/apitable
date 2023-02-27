import { AxiosResponse } from 'axios';
import { StatusCode, databus, IApiWrapper, IReduxState, IServerDatasheetPack, StoreActions } from '@apitable/core';

export class ClientDataLoader implements databus.IDataLoader {
  async loadDatasheetPack(datasheetId: string, options: IClientLoadDatasheetPackOptions): Promise<databus.ILoadDatasheetPackResult> {
    const { shareId, templateId, embedId, recordIds, dispatch, getState, needLoad } = options;

    if (!needLoad) {
      return {
        datasheetPack: {} as any,
      };
    }

    const state = getState();

    dispatch(StoreActions.requestDatasheetPack(datasheetId));
    let response: AxiosResponse<IApiWrapper & { data: IServerDatasheetPack }>;
    try {
      response = await StoreActions.fetchDatasheetApi(datasheetId, shareId, templateId, embedId, recordIds);
      if (!response.data.success && state.catalogTree.treeNodesMap[datasheetId]) {
        dispatch(StoreActions.deleteNode({ nodeId: datasheetId, parentId: state.catalogTree.treeNodesMap[datasheetId]!.parentId }));
      }
    } catch (e) {
      dispatch(StoreActions.datasheetErrorCode(datasheetId, StatusCode.COMMON_ERR));
      throw e;
    }

    if (response.data.success) {
      return { datasheetPack: response.data.data };
    }

    dispatch(StoreActions.datasheetErrorCode(datasheetId, response.data.code));
    return { datasheetPack: null };
  }
}

export interface IClientLoadDatasheetPackOptions extends databus.ILoadDatasheetPackOptions {
  shareId?: string;
  templateId?: string;
  embedId?: string;
  recordIds?: string | string[];
  dispatch: any;
  getState: () => IReduxState;
  needLoad: boolean;
}
