import { Selectors, StoreActions } from '@apitable/core';
import { addDatasheet, eventMessage, mainMessage, widgetDatasheetSelector } from '@apitable/widget-sdk';
import { store } from 'pc/store';

interface IPatchDatasheetProps {
  datasheetId: string;
  widgetId: string;
  messageId?: string;
  overWrite?: boolean;
}

const FetchStatus = new Map();

const syncDatasheet = (widgetId: string, datasheetId: string, messageId?: string) => {
  const state = store.getState();
  const datasheetPack = Selectors.getDatasheetPack(state, datasheetId);
  const datasheet = Selectors.getDatasheet(state, datasheetId);
  if (datasheetPack && datasheet && !datasheet.isPartOfData) {
    mainMessage.syncAction(widgetId, addDatasheet(datasheetId, widgetDatasheetSelector(state, datasheetId)!), messageId);
    eventMessage.syncAction(addDatasheet(datasheetId, widgetDatasheetSelector(state, datasheetId)!), widgetId);
  }
};

export const patchDatasheet = ({ datasheetId, widgetId, messageId, overWrite }: IPatchDatasheetProps) => {
  if (!datasheetId) {
    return;
  }
  const state = store.getState();
  const datasheetPack = Selectors.getDatasheetPack(state, datasheetId);
  const datasheet = Selectors.getDatasheet(state, datasheetId);
  if (!overWrite && datasheetPack && datasheet && !datasheet.isPartOfData) {
    syncDatasheet(widgetId, datasheetId, messageId);
    return;
  }
  const key = datasheetId;
  FetchStatus.set(key, true);
  store.dispatch(
    StoreActions.fetchDatasheet(
      datasheetId,
      () => {
        FetchStatus.delete(key);
        syncDatasheet(widgetId, datasheetId, messageId);
      },
      overWrite,
      undefined,
      () => {
        FetchStatus.delete(key);
      },
    ),
  );
};
