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

import {IReduxState, Selectors, ICollaborator, ResourceType, IUserInfo} from 'core';
import { IWidgetDatasheetState, IWidgetPermission, IWidgetState, IDatasheetMap } from 'interface';
import { DEFAULT_WIDGET_PERMISSION } from './slice/permission/reducer';

export const getWidgetErrorCode = (state: IReduxState, widgetId: string) => {
  const widgetSnapshot = Selectors.getWidgetSnapshot(state, widgetId);
  if (!widgetSnapshot) {
    return;
  }
  const datasheetId = widgetSnapshot.datasheetId;
  const sourceId = widgetSnapshot.sourceId;
  return sourceId?.startsWith('mir') ? Selectors.getMirrorErrorCode(state, sourceId) : Selectors.getDatasheetErrorCode(state, datasheetId);
};

/**
  * init widgetState;
  * @param state
  * @param widgetId
  */
export const initRootWidgetState = (state: IReduxState, widgetId: string, opt?: { foreignDatasheetIds?: string[]}): IWidgetState => {
  const widget = Selectors.getWidget(state, widgetId)!;
  const datasheetId = widget.snapshot.datasheetId!;
  const mirrorId = widget.snapshot?.sourceId;

  const bindDatasheet = widgetDatasheetSelector(state, datasheetId);
  const mirrorPack = mirrorId ? Selectors.getMirrorPack(state, mirrorId) : undefined;
  const datasheetMap: IDatasheetMap = bindDatasheet ? { [datasheetId]: bindDatasheet } : {};

  const foreignDatasheetIds = opt?.foreignDatasheetIds || [];
  foreignDatasheetIds.forEach(dstId => {
    if (dstId === datasheetId) {
      return;
    }
    const datasheet = widgetDatasheetSelector(state, dstId, true);
    if (datasheet) {
      datasheetMap[dstId] = datasheet;
    }
  });

  return {
    widget,
    datasheetMap,
    unitInfo: state.unitInfo,
    pageParams: state.pageParams,
    mirrorMap: mirrorPack ? { [mirrorId!]: mirrorPack } : undefined,
    user: {
      ...state.user.info,
      info: state.user.info ?? undefined
    } as IUserInfo,
    errorCode: getWidgetErrorCode(state, widgetId) || null,
    permission: aggregationWidgetPermission(state, widgetId),
    collaborators: aggregationWidgetCollaborators(state)
  };
};

/**
  * Aggregate widget permissions.
  * @param state
  * @param widgetId
  */
export const aggregationWidgetPermission = (state: IReduxState, widgetId: string): IWidgetPermission => {
  const widget = Selectors.getWidget(state, widgetId);
  if (!widget) {
    return DEFAULT_WIDGET_PERMISSION;
  }
  const datasheetId = widget.snapshot.datasheetId;
  const sourceId = widget.snapshot.datasheetId;
  const mirrorId = sourceId?.startsWith('mir') ? widget.snapshot?.sourceId : undefined;
  const datasheetPermission = Selectors.getPermissions(state, datasheetId, undefined, mirrorId);
  // If in the dashboard, node permissions are required.
  const onDashboard = Boolean(state.pageParams.dashboardId);
  return {
    storage: {
      editable: onDashboard ? Selectors.getDashboardPermission(state).editable : datasheetPermission.editable
    },
    datasheet: datasheetPermission
  };
};

/**
  * Aggregate widget collaborators.
  * Change according to the node you are currently at.
  * @param state
  */
export const aggregationWidgetCollaborators = (state: IReduxState): ICollaborator[] => {
  const { dashboardId, datasheetId, mirrorId } = state.pageParams;
  const resourceId = dashboardId || mirrorId || datasheetId;
  let resourceType: ResourceType;
  if (dashboardId) {
    resourceType = ResourceType.Dashboard;
  } else if (mirrorId) {
    resourceType = ResourceType.Mirror;
  } else if (datasheetId) {
    resourceType = ResourceType.Datasheet;
  } else {
    return [];
  }
  return Selectors.getResourceCollaborator(state, resourceId!, resourceType) || [];
};

/**
  * Get the datasheet state required by the widget in one go.
  */
export const widgetDatasheetSelector = (state: IReduxState, datasheetId: string, foreign?: boolean): IWidgetDatasheetState | null => {
  const datasheetPack = state.datasheetMap[datasheetId];
  if (!datasheetPack) {
    return null;
  }
  const datasheet = datasheetPack.datasheet;
  if (!datasheet) {
    return null;
  }
  //  Part of the data is approximately equal to no data, can not be calculated, logarithmic table filter will report an error.
  if (!foreign && datasheet.isPartOfData) {
    return null;
  }
  const { snapshot, permissions, name, description } = datasheet;
  const { selection, viewDerivation } = datasheetPack.client!;
  return {
    connected: true,
    datasheet: {
      id: datasheetId,
      description,
      datasheetName: name,
      datasheetId,
      permissions,
      snapshot,
      fieldPermissionMap: datasheetPack.fieldPermissionMap,
    },
    client: {
      selection,
      viewDerivation
    }
  };
};
