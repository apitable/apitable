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

import { IOperation } from 'engine/ot';
import {
  CHANGE_WIDGET_PANEL_WIDTH, DASHBOARD_CONNECTED, DASHBOARD_JOT_ACTION, DASHBOARD_ROOM_INFO_SYNC, DASHBOARD_UPDATE_REVISION, DATASHEET_CONNECTED,
  DATASHEET_JOT_ACTION, DATASHEET_ROOM_INFO_SYNC, DATASHEET_UPDATE_REVISION, FORM_CONNECTED, FORM_JOT_ACTION, FORM_ROOM_INFO_SYNC,
  FORM_UPDATE_REVISION, MIRROR_CONNECTED, MIRROR_JOT_ACTION, MIRROR_ROOM_INFO_SYNC, MIRROR_UPDATE_REVISION, SET_DASHBOARD_SYNCING,
  SET_DATASHEET_SYNCING, SET_FORM_SYNCING,
  SET_MIRROR_SYNCING, SET_THEME, SWITCH_ACTIVE_PANEL, TOGGLE_WIDGET_PANEL, UPDATE_DASHBOARD, UPDATE_MIRROR, WIDGET_JOT_ACTION, WIDGET_UPDATE_REVISION,
} from '../../../../shared/store/action_constants';
import {
  IChangeResourceSyncingStatus, IChangeWidgetPanelWidth, ICollaborator, IJOTActionPayload, INodeMeta, IResourceErrCode, IRoomInfoSync,
  ISetResourceConnected, ISwitchActivePanel, IToggleWidgetPanelAction, IUpdateRevision, ThemeName,
} from '../../../../../exports/store/interfaces';
import { ResourceType } from 'types';
import {
  activeDashboardCollaborator, deactivateDashboardCollaborator, resetDashboard, setDashboardErrorCode, updateDashboardName,
} from './dashboard';
import {
  activeDatasheetCollaborator, datasheetErrorCode, deactivateDatasheetCollaborator, resetDatasheet, updateDatasheet, updateDatasheetName,
} from './datasheet';
import { activeFormCollaborator, deactivateFormCollaborator, formErrorCode, resetForm } from './form';
import { resetWidget } from './widget';
import {
  activeMirrorCollaborator,
  deactivateMirrorCollaborator,
  resetMirror,
  updateMirrorName,
} from 'modules/database/store/actions/resource/mirror';

export * from './dashboard';
export * from './datasheet';
export * from './form';
export * from './widget';
export * from './mirror';

export const applyJOTOperations = (operations: IOperation[], resourceType: ResourceType, resourceId: string): IJOTActionPayload => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        payload: { operations },
        type: DASHBOARD_JOT_ACTION,
        dashboardId: resourceId,
      } as IJOTActionPayload;
    }
    case ResourceType.Widget: {
      return {
        payload: { operations },
        type: WIDGET_JOT_ACTION,
        widgetId: resourceId,
      } as IJOTActionPayload;
    }
    case ResourceType.Form: {
      return {
        payload: { operations },
        type: FORM_JOT_ACTION,
        formId: resourceId,
      } as IJOTActionPayload;
    }
    case ResourceType.Mirror: {
      return {
        payload: { operations },
        type: MIRROR_JOT_ACTION,
        mirrorId: resourceId,
      } as IJOTActionPayload;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        payload: { operations },
        datasheetId: resourceId,
        type: DATASHEET_JOT_ACTION,
      } as IJOTActionPayload;
    }
  }

};

export const updateRevision = (revision: number, resourceId: string, resourceType: ResourceType): IUpdateRevision => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        payload: revision,
        type: DASHBOARD_UPDATE_REVISION,
        dashboardId: resourceId,
      } as IUpdateRevision;
    }
    case ResourceType.Widget: {
      return {
        payload: revision,
        type: WIDGET_UPDATE_REVISION,
        widgetId: resourceId,
      } as IUpdateRevision;
    }
    case ResourceType.Form: {
      return {
        payload: revision,
        type: FORM_UPDATE_REVISION,
        formId: resourceId,
      } as IUpdateRevision;
    }
    case ResourceType.Mirror: {
      return {
        payload: revision,
        type: MIRROR_UPDATE_REVISION,
        mirrorId: resourceId,
      } as IUpdateRevision;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        payload: revision,
        type: DATASHEET_UPDATE_REVISION,
        datasheetId: resourceId,
      } as IUpdateRevision;
    }
  }
};

export const setResourceConnect = (resourceId: string, resourceType: ResourceType): ISetResourceConnected => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        type: DASHBOARD_CONNECTED,
        dashboardId: resourceId,
      } as ISetResourceConnected;
    }
    case ResourceType.Form: {
      return {
        type: FORM_CONNECTED,
        formId: resourceId,
      } as ISetResourceConnected;
    }
    case ResourceType.Mirror: {
      return {
        type: MIRROR_CONNECTED,
        mirrorId: resourceId,
      } as ISetResourceConnected;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: DATASHEET_CONNECTED,
        datasheetId: resourceId,
      } as ISetResourceConnected;
    }
  }
};

export const changeResourceSyncingStatus = (resourceId: string, resourceType: ResourceType, status: boolean): IChangeResourceSyncingStatus => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        type: SET_DASHBOARD_SYNCING,
        payload: status,
        dashboardId: resourceId,
      } as IChangeResourceSyncingStatus;
    }
    case ResourceType.Form: {
      return {
        type: SET_FORM_SYNCING,
        payload: status,
        formId: resourceId,
      } as IChangeResourceSyncingStatus;
    }
    case ResourceType.Mirror: {
      return {
        type: SET_MIRROR_SYNCING,
        payload: status,
        mirrorId: resourceId,
      } as IChangeResourceSyncingStatus;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: SET_DATASHEET_SYNCING,
        payload: status,
        datasheetId: resourceId,
      } as IChangeResourceSyncingStatus;
    }
  }
};

export const roomInfoSync = (resourceId: string, resourceType: ResourceType, payload: ICollaborator[]): IRoomInfoSync => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        type: DASHBOARD_ROOM_INFO_SYNC,
        payload,
        dashboardId: resourceId,
      } as IRoomInfoSync;
    }
    case ResourceType.Form: {
      return {
        type: FORM_ROOM_INFO_SYNC,
        payload,
        formId: resourceId,
      } as IRoomInfoSync;
    }
    case ResourceType.Mirror: {
      return {
        type: MIRROR_ROOM_INFO_SYNC,
        payload,
        mirrorId: resourceId,
      } as IRoomInfoSync;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: DATASHEET_ROOM_INFO_SYNC,
        payload,
        datasheetId: resourceId,
      } as IRoomInfoSync;
    }
  }
};

export const resourceErrorCode = (code: number | null, resourceId: string, resourceType: ResourceType): IResourceErrCode => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return setDashboardErrorCode(resourceId, code) as IResourceErrCode;
    }
    case ResourceType.Form: {
      return formErrorCode(resourceId, code) as IResourceErrCode;
    }
    case ResourceType.Datasheet:
    default: {
      return datasheetErrorCode(resourceId, code) as IResourceErrCode;
    }
  }
};

export const updateResource = (data: Partial<INodeMeta>, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return {
        type: UPDATE_DASHBOARD,
        payload: data,
        dashboardId: resourceId,
      };
    }
    case ResourceType.Mirror: {
      return {
        type: UPDATE_MIRROR,
        payload: data,
        mirrorId: resourceId,
      };
    }
    case ResourceType.Datasheet:
    default: {
      return updateDatasheet(resourceId, data);
    }
  }
};

export const resetResource = (resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Widget: {
      return resetWidget([resourceId]);
    }
    case ResourceType.Form: {
      return resetForm(resourceId);
    }
    case ResourceType.Dashboard: {
      return resetDashboard(resourceId);
    }
    case ResourceType.Mirror: {
      return resetMirror(resourceId);
    }
    case ResourceType.Datasheet:
    default: {
      return resetDatasheet(resourceId);
    }
  }
};

export const updateResourceName = (newName: string, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return updateDashboardName(newName, resourceId);
    }
    case ResourceType.Datasheet:
      return updateDatasheetName(resourceId, newName);
    case ResourceType.Mirror:
      return updateMirrorName(newName, resourceId);
    default:
      return;
  }
};

export const activeCollaborator = (payload: ICollaborator, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return activeDashboardCollaborator(payload, resourceId);
    }
    case ResourceType.Mirror: {
      return activeMirrorCollaborator(payload, resourceId);
    }
    case ResourceType.Form: {
      return activeFormCollaborator(payload, resourceId);
    }
    case ResourceType.Datasheet:
    default: {
      return activeDatasheetCollaborator(payload, resourceId);
    }
  }
};

export const deactivateCollaborator = (payload: { socketId: string }, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Dashboard: {
      return deactivateDashboardCollaborator(payload, resourceId);
    }
    case ResourceType.Mirror: {
      return deactivateMirrorCollaborator(payload, resourceId);
    }
    case ResourceType.Form: {
      return deactivateFormCollaborator(payload, resourceId);
    }
    case ResourceType.Datasheet:
    default: {
      return deactivateDatasheetCollaborator(payload, resourceId);
    }
  }
};

export const toggleWidgetPanel = (resourceId: string, resourceType: ResourceType, status?: boolean) => {
  switch (resourceType) {
    case ResourceType.Mirror: {
      return {
        type: TOGGLE_WIDGET_PANEL,
        payload: status,
        mirrorId: resourceId,
      } as IToggleWidgetPanelAction;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: TOGGLE_WIDGET_PANEL,
        payload: status,
        datasheetId: resourceId,
      } as IToggleWidgetPanelAction;
    }
  }
};

export const changeWidgetPanelWidth = (width: number, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Mirror: {
      return {
        type: CHANGE_WIDGET_PANEL_WIDTH,
        payload: width,
        mirrorId: resourceId,
      } as IChangeWidgetPanelWidth;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: CHANGE_WIDGET_PANEL_WIDTH,
        payload: width,
        datasheetId: resourceId,
      } as IChangeWidgetPanelWidth;
    }
  }
};

export const switchActivePanel = (panelId: string | null, resourceId: string, resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Mirror: {
      return {
        type: SWITCH_ACTIVE_PANEL,
        payload: panelId,
        mirrorId: resourceId,
      } as ISwitchActivePanel;
    }
    case ResourceType.Datasheet:
    default: {
      return {
        type: SWITCH_ACTIVE_PANEL,
        payload: panelId,
        datasheetId: resourceId,
      } as ISwitchActivePanel;
    }
  }
};

export const setTheme = (theme: ThemeName) => {
  return {
    type: SET_THEME,
    payload: theme,
  };
};

