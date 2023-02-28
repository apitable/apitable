import { ISnapshot } from '@apitable/core';
import { IDatasheetClient, IDatasheetMain, IWidgetDatasheetState } from 'interface/store';
import { createMockPermissions } from './mock_permission';

export const DEFAULT_DATASHEET_ID = 'dstMock';
export const DEFAULT_DATASHEET_NAME = 'datasheet1';
export const DEFAULT_DATASHEET_DESCRIPTION = 'description';

export function mockWidgetSdkDatasheetPack(props: Partial<IWidgetDatasheetState> = {}): IWidgetDatasheetState {
  const {
    connected = true,
    datasheet = mockWidgetSdkDatasheet(),
    client = mockClient()
  } = props;
  return {
    connected,
    datasheet,
    client,
  };
}

export function mockWidgetSdkDatasheet(props: Partial<IDatasheetMain> = {}): IDatasheetMain {
  const {
    datasheetId = DEFAULT_DATASHEET_ID,
    datasheetName = DEFAULT_DATASHEET_NAME,
    description = DEFAULT_DATASHEET_DESCRIPTION,
    permissions = createMockPermissions(),
    snapshot = mockSnapshot(),
    fieldPermissionMap,
    isPartOfData
  } = props;
  return {
    id: datasheetId,
    description,
    datasheetId,
    datasheetName,
    permissions,
    snapshot,
    fieldPermissionMap,
    isPartOfData,
  };
}

export function mockSnapshot(props: Partial<ISnapshot> = {}): ISnapshot {
  const {
    meta = {
      fieldMap: {},
      views: [],
      primaryFieldId: '',
    },
    datasheetId = DEFAULT_DATASHEET_ID,
    recordMap = {}
  } = props;
  return {
    meta,
    datasheetId, 
    recordMap
  };
}

export function mockClient(props: Partial<IDatasheetClient> = {}): IDatasheetClient {
  const { viewDerivation = {}, selection } = props;
  return {
    viewDerivation,
    selection
  };
}
