// import { AxiosResponse } from 'axios';
import { StatusCode, databus, IApiWrapper, IReduxState, IServerDatasheetPack, StoreActions, IServerDashboardPack } from '@apitable/core';

export class ClientDataLoader implements databus.IDataLoader {
  async loadDatasheetPack(datasheetId: string, options: IClientLoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> {
    const { shareId, templateId, embedId, recordIds, dispatch, getState, needLoad } = options;

    if (!needLoad) {
      return {} as any;
    }

    const state = getState();

    dispatch(StoreActions.requestDatasheetPack(datasheetId));
    let response: {data: IApiWrapper & { data: IServerDatasheetPack }};
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
      return response.data.data;
    }

    dispatch(StoreActions.datasheetErrorCode(datasheetId, response.data.code));
    return null;
  }

  loadDashboardPack(_dashboardId: string): Promise<IServerDashboardPack | null> {
    return Promise.resolve(null);
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
