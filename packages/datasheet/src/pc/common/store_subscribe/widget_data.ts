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

import { ILabs, IMirrorMap, IPageParams, IShareInfo, IUnitInfo, IUserInfo, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import {
  IDatasheetClient, IDatasheetMainSimple, mainWidgetMessage, IWidgetDashboardState, iframeWidgetDashboardSelector
} from '@apitable/widget-sdk';
import { updateCache } from './visible_rows_base';
import { getDependenceDstIds } from 'pc/utils/dependence_dst';

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
  // You don't have to go to the back of the iframe if the applet is not open
  if (!mainWidgetMessage.enable) {
    return;
  }
  const state = store.getState();
  const datasheetMap = state.datasheetMap;

  // Sync client
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

  // Sync labs
  const preLabs = labs;
  labs = state.labs;
  if (labs !== preLabs) {
    mainWidgetMessage.syncLabs(labs);
  }

  // Sync pageParams
  const prePageParams = pageParams;
  pageParams = state.pageParams;
  if (pageParams !== prePageParams) {
    mainWidgetMessage.syncPageParams(pageParams);
  }

  // Sync unitInfo
  const preUnitInfo = unitInfo;
  unitInfo = state.unitInfo;
  if (unitInfo !== preUnitInfo) {
    mainWidgetMessage.syncUnitInfo(unitInfo);
  }

  // Sync share
  const preShare = share;
  share = state.share;
  if (share !== preShare) {
    mainWidgetMessage.syncShare(share);
  }

  // Sync dashboard
  const preDashboard = dashboard;
  const dashboardPack = Selectors.getDashboardPack(state);
  dashboard = iframeWidgetDashboardSelector(dashboardPack);
  if (dashboard?.permissions !== preDashboard?.permissions) {
    mainWidgetMessage.syncDashboard({ permissions: dashboard?.permissions });
  }
  if (dashboard?.collaborators !== preDashboard?.collaborators) {
    mainWidgetMessage.syncDashboard({ collaborators: dashboard?.collaborators });
  }

  // Sync mirrorMap
  const preMirrorMap = mirrorMap;
  mirrorMap = state.mirrorMap;
  Object.keys(mirrorMap).every(mirrorId => {
    if (mirrorMap[mirrorId] !== preMirrorMap[mirrorId]) {
      mainWidgetMessage.syncMirrorMap({ [mirrorId]: mirrorMap[mirrorId] });
      return false;
    }
    return true;
  });

  // Synchronize userInfo
  const preUserInfo = userInfo;
  userInfo = state.user.info;
  if (userInfo && preUserInfo !== userInfo) {
    mainWidgetMessage.syncUserInfo(userInfo);
  }

  // Syncing data other than snapshot
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
  const getDstIds = (dstId: string) => getDependenceDstIds?.(state, dstId) || [];

  if (Object.keys(datasheetSimpleUpdate).length) {
    const datasheetId = datasheetSimpleUpdate.datasheetId;
    const dstIds = Array.from(new Set([...getDstIds(datasheetId!), datasheetId!]));
    mainWidgetMessage.datasheetSimpleUpdate(dstIds, { [datasheetSimpleUpdate.datasheetId!]: datasheetSimpleUpdate });
  }

  // Synchronise data from other related tables (only triggered after the first load of other related tables has completed)
  const preDatasheetPartOfDataMap = datasheetPartOfDataMap;
  Object.keys(datasheetMap).forEach(datasheetId => {
    const { loading, datasheet } = datasheetMap[datasheetId];
    if (!loading && datasheet?.isPartOfData !== preDatasheetPartOfDataMap[datasheetId]) {
      const dstIds = getDstIds(datasheetId);
      const map = {
        [datasheetId]: datasheetMap[datasheetId]
      };
      dstIds.forEach(dstId => {
        map[dstId] = datasheetMap[dstId];
        /** Once the association table is loaded, send it to the applet */
        mainWidgetMessage.loadOtherDatasheetInit(dstId, { [datasheetId]: datasheetMap[datasheetId] });
      });
      mainWidgetMessage.loadOtherDatasheetInit(datasheetId, map);
      updateCache(datasheetId);
    }

    datasheetPartOfDataMap[datasheetId] = datasheet?.isPartOfData;
  });

});

