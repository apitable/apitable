import { ILabs, IMirrorMap, IPageParams, IShareInfo, IUnitInfo, IUserInfo, Selectors } from '@vikadata/core';
import { store } from 'pc/store';
import {
  IDatasheetClient, IDatasheetMainSimple, mainWidgetMessage, IWidgetDashboardState, iframeWidgetDashboardSelector
} from '@vikadata/widget-sdk';
import { updateCache } from './visible_rows_base';
import { getDependenceDstIds } from 'pc/common/billing';

let client: IDatasheetClient = {
  selection: undefined,
  collaborators: undefined,
  activeRowInfo: undefined
};

let labs: ILabs = [];

let pageParams: IPageParams = {};

let unitInfo: IUnitInfo = {
  unitMap: null,
  userMap: null
};

let share: IShareInfo = {};

let dashboard: IWidgetDashboardState | null | undefined = null;

let mirrorMap: IMirrorMap = {};

const datasheetSimple: { [key: string]: IDatasheetMainSimple } = {};

const datasheetPartOfDataMap: { [key: string]: boolean | undefined } = {};

let userInfo: IUserInfo | null = null; 

store.subscribe(function widgetClient() {
  // 未开启小程序 iframe 的时候不用进入后面判断
  if (!mainWidgetMessage.enable) {
    return;
  }
  const state = store.getState();
  const datasheetMap = state.datasheetMap;

  // 同步 client
  const preClient = client;
  const stateClient = Selectors.getDatasheetClient(state);
  client = {
    activeRowInfo: stateClient?.activeRowInfo,
    selection: stateClient?.selection || undefined,
    collaborators: stateClient?.collaborators
  };
  if (!Object.keys(client).every(key => client[key] === preClient[key])) {
    mainWidgetMessage.syncClient(client);
  }

  // 同步 labs
  const preLabs = labs;
  labs = state.labs;
  if (labs !== preLabs) {
    mainWidgetMessage.syncLabs(labs);
  }

  // 同步 pageParams
  const prePageParams = pageParams;
  pageParams = state.pageParams;
  if (pageParams !== prePageParams) {
    mainWidgetMessage.syncPageParams(pageParams);
  }

  // 同步 unitInfo
  const preUnitInfo = unitInfo;
  unitInfo = state.unitInfo;
  if (unitInfo !== preUnitInfo) {
    mainWidgetMessage.syncUnitInfo(unitInfo);
  }

  // 同步 share
  const preShare = share;
  share = state.share;
  if (share !== preShare) {
    mainWidgetMessage.syncShare(share);
  }

  // 同步 dashboard
  const preDashboard = dashboard;
  const dashboardPack = Selectors.getDashboardPack(state);
  dashboard = iframeWidgetDashboardSelector(dashboardPack);
  if (dashboard?.permissions !== preDashboard?.permissions) {
    mainWidgetMessage.syncDashboard({ permissions: dashboard?.permissions });
  }
  if (dashboard?.collaborators !== preDashboard?.collaborators) {
    mainWidgetMessage.syncDashboard({ collaborators: dashboard?.collaborators });
  }

  // 同步 mirrorMap
  const preMirrorMap = mirrorMap;
  mirrorMap = state.mirrorMap;
  Object.keys(mirrorMap).every(mirrorId => {
    if (mirrorMap[mirrorId] !== preMirrorMap[mirrorId]) {
      mainWidgetMessage.syncMirrorMap({ [mirrorId]: mirrorMap[mirrorId] });
      return false;
    }
    return true;
  });

  // 同步 userInfo
  const preUserInfo = userInfo;
  userInfo = state.user.info;
  if (userInfo && preUserInfo !== userInfo) {
    mainWidgetMessage.syncUserInfo(userInfo);
  }

  // 同步除了 snapshot 之外的数据
  const datasheetSimpleUpdate: IDatasheetMainSimple = {};
  Object.keys(state.datasheetMap).some(key => {
    const { fieldPermissionMap, datasheet, loading } = state.datasheetMap[key];
    if (loading) {
      return false;
    }
    const preDatasheet = datasheetSimple[key];
    if (!preDatasheet) {
      datasheetSimple[key] = {
        fieldPermissionMap: fieldPermissionMap,
        datasheetName: datasheet?.name,
        permissions: datasheet?.permissions,
        activeView: datasheet?.activeView,
        datasheetId: datasheet?.id
      };
      return false;
    }
    if (fieldPermissionMap !== preDatasheet.fieldPermissionMap) {
      datasheetSimpleUpdate['fieldPermissionMap'] = fieldPermissionMap;

    }
    if (datasheet?.name && datasheet?.name !== preDatasheet.datasheetName) {
      datasheetSimpleUpdate['datasheetName'] = datasheet?.name;
    }
    if (datasheet?.permissions && datasheet.permissions !== preDatasheet.permissions) {
      datasheetSimpleUpdate['permissions'] = datasheet.permissions;
    }
    if (datasheet?.activeView && datasheet.activeView !== preDatasheet.activeView) {
      datasheetSimpleUpdate['activeView'] = datasheet.activeView;
    }
    if (datasheet?.isPartOfData !== preDatasheet.isPartOfData) {
      datasheetSimpleUpdate['isPartOfData'] = datasheet?.isPartOfData;
    }
    if (Object.keys(datasheetSimpleUpdate).length) {
      datasheetSimpleUpdate['datasheetId'] = key;
      datasheetSimple[key] = {
        ...preDatasheet,
        ...datasheetSimpleUpdate
      };
      return true;
    }
    return false;
  });
  if (Object.keys(datasheetSimpleUpdate).length) {
    const datasheetId = datasheetSimpleUpdate.datasheetId;
    const dstIds = Array.from(new Set([...getDependenceDstIds(state, datasheetId!), datasheetId!]));
    mainWidgetMessage.datasheetSimpleUpdate(dstIds, { [datasheetSimpleUpdate.datasheetId!]: datasheetSimpleUpdate });
  }

  // 同步其他关联表数据（只在其他关联表第一次 loading 完成之后触发）
  const preDatasheetPartOfDataMap = datasheetPartOfDataMap;
  Object.keys(datasheetMap).forEach(datasheetId => {
    const { loading, datasheet } = datasheetMap[datasheetId];
    if (!loading && datasheet?.isPartOfData !== preDatasheetPartOfDataMap[datasheetId]) {
      const dstIds = getDependenceDstIds(state, datasheetId);
      const map = {
        [datasheetId]: datasheetMap[datasheetId]
      };
      dstIds.forEach(dstId => {
        map[dstId] = datasheetMap[dstId];
        /** 关联表加载完成之后，发送给小程序 */
        mainWidgetMessage.loadOtherDatasheetInit(dstId, { [datasheetId]: datasheetMap[datasheetId] });
      });
      mainWidgetMessage.loadOtherDatasheetInit(datasheetId, map);
      updateCache(datasheetId);
    }

    datasheetPartOfDataMap[datasheetId] = datasheet?.isPartOfData;
  });

});

