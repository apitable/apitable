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

import { IReduxState, IResource } from '../../../../../exports/store/interfaces';
import { ResourceType } from 'types';
import { assertNever } from 'utils';
import { collaboratorSocketSelector } from '../collaborators';
import { getDashboard, getDashboardClient, getDashboardPermission } from './dashboard';
import { getDatasheet, getPermissions, getWidgetPanels, getWidgetPanelStatus } from './datasheet';
import { getWidget } from './widget';
import { getForm, getFormClient, getFormPermission } from './form';
import {
  getMirror, getMirrorCollaborator, getMirrorPermission, getWidgetPanelStatusWithMirror, getWidgetPanelsWithMirror
} from 'modules/database/store/selectors/resource/mirror';

export * from './mirror';
export * from './dashboard';
export * from './datasheet';
export * from './form';
export * from './widget';
export * from './theme';

// pass right `type`, can auto complete type,  for example:
// const s = getResourcePack(undefined as any, undefined as any, ResourceType.Widget);
// `s` can be judge as `IDatasheetPack`
// TODO: still not find out how fix the error of function return. set them `as any`.
// in the future, we can use judge the right return type.
export function getResourcePack<K extends keyof IResource>(state: IReduxState, id: string, type: K): IResource[K] | null {
  switch (type) {
    case ResourceType.Widget: {
      return state.widgetMap[id] as any;
    }
    case ResourceType.Form: {
      return state.formMap[id] as any;
    }
    case ResourceType.Dashboard: {
      return state.dashboardMap[id] as any;
    }
    case ResourceType.Datasheet: {
      return state.datasheetMap[id] as any;
    }
    case ResourceType.Mirror: {
      return state.mirrorMap[id] as any;
    }
  }
  return null;
}

export const getResourceCollaborator = (state: IReduxState, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Form: {
      return getFormClient(state)?.collaborators;
    }
    case ResourceType.Dashboard: {
      return getDashboardClient(state)?.collaborators;
    }
    case ResourceType.Datasheet: {
      return collaboratorSocketSelector(state, resourceId);
    }
    case ResourceType.Mirror: {
      return getMirrorCollaborator(state, resourceId);
    }
  }
  return null;
};

export const getResourceRevision = (state: IReduxState, id: string, type: ResourceType) => {
  switch (type) {
    case ResourceType.Datasheet: {
      const datasheet = getDatasheet(state, id);
      return datasheet?.revision;
    }
    case ResourceType.Widget: {
      const widget = getWidget(state, id);
      return widget?.revision;
    }
    case ResourceType.Form: {
      const form = getForm(state, id);
      return form?.revision;
    }
    case ResourceType.Dashboard: {
      const dashboard = getDashboard(state, id);
      return dashboard?.revision;
    }
    case ResourceType.Mirror: {
      const mirror = getMirror(state, id);
      return mirror?.revision;
    }
  }
  assertNever(type);
};

export const getResourceNetworking = (
  state: IReduxState, resourceId: string, resourceType: ResourceType,
) => {
  if (!resourceId) {
    return;
  }
  const resourcePack = getResourcePack(state, resourceId, resourceType);
  if (!resourcePack) {
    return;
  }
  return {
    loading: resourcePack.loading,
    connected: resourcePack.connected,
    syncing: resourcePack.syncing,
    errorCode: resourcePack.errorCode,
  };
};

export const getResourcePermission = (state: IReduxState, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Datasheet: {
      return getPermissions(state, resourceId);
    }
    case ResourceType.Form: {
      return getFormPermission(state, resourceId);
    }
    case ResourceType.Dashboard: {
      return getDashboardPermission(state);
    }
    case ResourceType.Mirror: {
      return getMirrorPermission(state, resourceId)!;
    }
    default: {
      return getPermissions(state, resourceId);
    }
  }
};

export const getResourceWidgetPanelStatus = (state: IReduxState, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Datasheet: {
      return getWidgetPanelStatus(state, resourceId);
    }
    case ResourceType.Mirror: {
      return getWidgetPanelStatusWithMirror(state, resourceId)!;
    }
    default: {
      return getWidgetPanelStatus(state, resourceId);
    }
  }
};

export const getResourceWidgetPanels = (state: IReduxState, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Datasheet: {
      return getWidgetPanels(state, resourceId);
    }
    case ResourceType.Mirror: {
      return getWidgetPanelsWithMirror(state, resourceId)!;
    }
    default: {
      return getWidgetPanels(state, resourceId);
    }
  }
};

export const getResourceActiveWidgetPanel = (state: IReduxState, resourceId: string, resourceType: ResourceType) => {
  const panels = getResourceWidgetPanels(state, resourceId, resourceType);

  if (!panels) {
    return panels;
  }

  const widgetPanelStatus = getResourceWidgetPanelStatus(state, resourceId, resourceType);
  const activePanelId = widgetPanelStatus?.activePanelId;
  const panelOpening = widgetPanelStatus?.opening;

  if (!panelOpening) {
    return;
  }

  if (activePanelId) {
    return panels.find(item => item.id === activePanelId) || panels[0];
  }

  return panels[0];
};
