import { IWidget, WidgetPackageStatus, WidgetPackageType, WidgetReleaseType } from '@apitable/core';
import { IWidgetState } from 'interface/store';
import { DEFAULT_DATASHEET_ID, mockWidgetSdkDatasheetPack } from './mock_datasheet';
import { createMockPermissions } from './mock_permission';

export const defaultWidget: IWidget = {
  id: 'wdt2eD5iRkFmoShlVa',
  revision: 1,
  authorEmail: 'test@vikadata.com',
  authorIcon: 'https://s1.vika.cn/public/2022/06/14/57c66d361c0f4c2fa1b3eddc3aa9bea0',
  authorLink: 'https://vika.cn',
  authorName: 'vika',
  packageType: WidgetPackageType.Official,
  releaseType: WidgetReleaseType.Global,
  status: WidgetPackageStatus.Published,
  releaseCodeBundle: '',
  widgetPackageId: 'wpkgMavSIOOR9',
  widgetPackageName: 'vika',
  widgetPackageIcon: '',
  widgetPackageVersion: '0.0.1',
  sandbox: false,
  snapshot: {
    datasheetId: DEFAULT_DATASHEET_ID,
    sourceId: DEFAULT_DATASHEET_ID,
    widgetName: 'vika',
    storage: {}
  }
};

const defaultPermission = {
  storage: {
    editable: true
  },
  datasheet: createMockPermissions()
};

/**
 * Default a store.
 * @param props 
 * @returns 
 */
export function mockWidgetSdkStore(props: Partial<IWidgetState>): IWidgetState {
  const {
    widget = defaultWidget,
    errorCode = null,
    datasheetMap = {
      [DEFAULT_DATASHEET_ID]: mockWidgetSdkDatasheetPack()
    },
    unitInfo = null,
    pageParams = {
      datasheetId: DEFAULT_DATASHEET_ID
    },
    user = null,
    collaborators = [],
    permission = defaultPermission,
    mirrorMap = {},
  } = props;
  return {
    widget,
    errorCode,
    datasheetMap,
    unitInfo,
    pageParams,
    mirrorMap,
    user,
    collaborators,
    permission
  };
}