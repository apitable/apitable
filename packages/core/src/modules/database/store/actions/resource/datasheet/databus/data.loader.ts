import { AxiosResponse } from 'axios';
import { StatusCode } from 'config';
import { IDataLoader, ILoadDatasheetPackOptions, ILoadDatasheetPackResult } from 'databus/providers';
import { IApiWrapper, IReduxState, IServerDatasheetPack } from 'exports/store';
import { datasheetErrorCode, deleteNode, fetchDatasheetPackSuccess } from 'exports/store/actions';
import { fetchDatasheetPack, fetchEmbedDatasheetPack, fetchShareDatasheetPack, fetchTemplateDatasheetPack } from 'modules/database/api/datasheet_api';
import { DATAPACK_REQUEST } from 'modules/shared/store/action_constants';

function requestDatasheetPack(datasheetId: string) {
  return {
    type: DATAPACK_REQUEST,
    datasheetId,
  };
}

const fetchDatasheetApi = (datasheetId: string, shareId?: string, templateId?: string, embedId?: string, recordIds?: string | string[]) => {
  let requestMethod = fetchDatasheetPack;
  if (shareId) {
    requestMethod = () => fetchShareDatasheetPack(shareId, datasheetId);
  }
  if (templateId) {
    requestMethod = fetchTemplateDatasheetPack;
  }

  if (embedId) {
    requestMethod = () => fetchEmbedDatasheetPack(embedId, datasheetId);
  }

  return requestMethod(datasheetId, recordIds);
};

export class ClientDataLoader implements IDataLoader {
  async loadDatasheetPack(datasheetId: string, options: IClientLoadDatasheetPackOptions): Promise<ILoadDatasheetPackResult> {
    const { shareId, templateId, embedId, recordIds, dispatch, getState } = options;
    const state = getState();

    dispatch(requestDatasheetPack(datasheetId));
    let response: AxiosResponse<IApiWrapper & { data: IServerDatasheetPack }>;
    try {
      response = await fetchDatasheetApi(datasheetId, shareId, templateId, embedId, recordIds);
      if (!response.data.success && state.catalogTree.treeNodesMap[datasheetId]) {
        dispatch(deleteNode({ nodeId: datasheetId, parentId: state.catalogTree.treeNodesMap[datasheetId]!.parentId }));
      }
    } catch (e) {
      dispatch(datasheetErrorCode(datasheetId, StatusCode.COMMON_ERR));
      throw e;
    }

    // recordIds exits means that only part of recordsIds data is needed @boris
    fetchDatasheetPackSuccess({
      datasheetId,
      responseBody: response.data,
      dispatch,
      getState,
      isPartOfData: Boolean(recordIds),
    });
    if (response.data.success) {
      return { datasheetPack: response.data.data };
    }
    return { datasheetPack: null };
  }
}

export interface IClientLoadDatasheetPackOptions extends ILoadDatasheetPackOptions {
  shareId?: string;
  templateId?: string;
  embedId?: string;
  recordIds?: string | string[];
  dispatch: any;
  getState: () => IReduxState;
}
