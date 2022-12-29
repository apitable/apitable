import { IDatasheetClient, IDatasheetMap, IDatasheetMainSimple } from 'interface';
import { REFRESH_USED_DATASHEET, REFRESH_USED_DATASHEET_CLIENT, REFRESH_USED_DATASHEET_SIMPLE } from '../../constant';

export interface IStoreRefreshDatasheetMapAction {
  type: typeof REFRESH_USED_DATASHEET;
  payload: IDatasheetMap;
}

export const refreshUsedDatasheetAction = (payload: IDatasheetMap): IStoreRefreshDatasheetMapAction => ({
  type: REFRESH_USED_DATASHEET,
  payload
});

export interface IStoreRefreshDatasheetClientAction {
  type: typeof REFRESH_USED_DATASHEET_CLIENT;
  payload: { datasheetId: string, client: IDatasheetClient };
}

export const refreshUsedDatasheetClientAction = (payload: { datasheetId: string, client: IDatasheetClient }): IStoreRefreshDatasheetClientAction => ({
  type: REFRESH_USED_DATASHEET_CLIENT,
  payload
});

export interface IStoreRefreshDatasheetSimpleAction {
  type: typeof REFRESH_USED_DATASHEET_SIMPLE;
  payload: IDatasheetMainSimple;
}

// As an update action for data other than snapshot.
export const refreshUsedDatasheetSimpleAction = (
  payload: IDatasheetMainSimple
): IStoreRefreshDatasheetSimpleAction => ({
  type: REFRESH_USED_DATASHEET_SIMPLE,
  payload
});

