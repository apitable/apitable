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

import { IDatasheetState } from './datasheet/datasheet';
import { IOperation } from 'engine';
import {
  CHANGE_WIDGET_PANEL_WIDTH, DASHBOARD_ACTIVE_COLLABORATOR, DASHBOARD_CONNECTED, DASHBOARD_DEACTIVATE_COLLABORATOR, DASHBOARD_ERROR_CODE,
  DASHBOARD_JOT_ACTION, DASHBOARD_ROOM_INFO_SYNC, DASHBOARD_UPDATE_REVISION, DATASHEET_ACTIVE_COLLABORATOR, DATASHEET_CONNECTED,
  DATASHEET_DEACTIVATE_COLLABORATOR, DATASHEET_ERROR_CODE, DATASHEET_JOT_ACTION, DATASHEET_ROOM_INFO_SYNC, DATASHEET_UPDATE_REVISION,
  FORM_ACTIVE_COLLABORATOR, FORM_CONNECTED, FORM_DEACTIVATE_COLLABORATOR, FORM_ERROR_CODE, FORM_JOT_ACTION, FORM_ROOM_INFO_SYNC, FORM_UPDATE_REVISION,
  MIRROR_ACTIVE_COLLABORATOR, MIRROR_CONNECTED, MIRROR_DEACTIVATE_COLLABORATOR, MIRROR_ERROR_CODE, MIRROR_JOT_ACTION, MIRROR_ROOM_INFO_SYNC,
  MIRROR_UPDATE_REVISION,
  SET_DASHBOARD_SYNCING,
  SET_DATASHEET_SYNCING, SET_FORM_SYNCING, SET_MIRROR_SYNCING, SWITCH_ACTIVE_PANEL, TOGGLE_WIDGET_PANEL, UPDATE_DASHBOARD, UPDATE_DATASHEET,
  UPDATE_MIRROR, WIDGET_JOT_ACTION, WIDGET_UPDATE_REVISION,
} from '../../../../shared/store/action_constants';
import { ResourceType } from 'types';
import { IDashboard, IDashboardPack } from './dashboard';
import { ICollaborator, IDatasheetPack, INodeMeta } from './datasheet';
import { IFormPack, IFormState } from './form';
import { IWidget, IWidgetPack } from './widget';
import { IMirrorPack } from 'modules/database/store/interfaces/resource/mirror';

export * from './dashboard';
export * from './datasheet';
export * from './form';
export * from './widget';
export * from './mirror';
export * from './theme';

export interface IResource {
  [ResourceType.Widget]: IWidgetPack;
  [ResourceType.Dashboard]: IDashboardPack;
  [ResourceType.Datasheet]: IDatasheetPack;
  [ResourceType.Form]: IFormPack;
  [ResourceType.Mirror]: IMirrorPack;
}

interface IJotPayloadForDatasheet {
  datasheetId: string;
  type: typeof DATASHEET_JOT_ACTION;
  payload: { operations: IOperation[] };
}

interface IJotPayloadForWidget {
  widgetId: string;
  type: typeof WIDGET_JOT_ACTION;
  payload: { operations: IOperation[] };
}

interface IJotPayloadForDashboard {
  dashboardId: string;
  type: typeof DASHBOARD_JOT_ACTION;
  payload: { operations: IOperation[] };
}

interface IJotPayloadForForm {
  formId: string;
  type: typeof FORM_JOT_ACTION;
  payload: { operations: IOperation[] };
}

interface IJotPayloadForMirror {
  mirrorId: string;
  type: typeof MIRROR_JOT_ACTION;
  payload: { operations: IOperation[] };
}

export type IJOTActionPayload = IJotPayloadForDatasheet | IJotPayloadForWidget | IJotPayloadForDashboard | IJotPayloadForForm | IJotPayloadForMirror;

interface IUpdateRevisionForDatasheet {
  type: typeof DATASHEET_UPDATE_REVISION;
  payload: number;
  datasheetId: string;
}

interface IUpdateRevisionForDashboard {
  type: typeof DASHBOARD_UPDATE_REVISION;
  payload: number;
  dashboardId: string;
}

interface IUpdateRevisionForWidget {
  type: typeof WIDGET_UPDATE_REVISION;
  payload: number;
  widgetId: string;
}

interface IUpdateRevisionForForm {
  type: typeof FORM_UPDATE_REVISION;
  payload: number;
  formId: string;
}

interface IUpdateRevisionForMirror {
  type: typeof MIRROR_UPDATE_REVISION;
  payload: number;
  mirrorId: string;
}

export type IUpdateRevision = IUpdateRevisionForDashboard | IUpdateRevisionForDatasheet | IUpdateRevisionForWidget | IUpdateRevisionForForm
  | IUpdateRevisionForMirror;

interface ISetDatasheetConnected {
  type: typeof DATASHEET_CONNECTED;
  datasheetId: string;
}

interface ISetDashboardConnected {
  type: typeof DASHBOARD_CONNECTED;
  dashboardId: string;
}

interface ISetFormConnected {
  type: typeof FORM_CONNECTED;
  formId: string;
}

interface ISetMirrorConnected {
  type: typeof MIRROR_CONNECTED;
  mirrorId: string;
}

export type ISetResourceConnected = ISetDashboardConnected | ISetFormConnected | ISetDatasheetConnected | ISetMirrorConnected;

interface IChangeDatasheetSyncStatus {
  type: typeof SET_DATASHEET_SYNCING;
  payload: boolean;
  datasheetId: string;
}

interface IChangeDashboardSyncStatus {
  type: typeof SET_DASHBOARD_SYNCING;
  payload: boolean;
  dashboardId: string;
}

interface IChangeFormSyncStatus {
  type: typeof SET_FORM_SYNCING;
  payload: boolean;
  formId: string;
}

interface IChangeMirrorSyncStatus {
  type: typeof SET_MIRROR_SYNCING;
  payload: boolean;
  mirrorId: string;
}

export type IChangeResourceSyncingStatus = IChangeDatasheetSyncStatus | IChangeFormSyncStatus | IChangeDashboardSyncStatus | IChangeMirrorSyncStatus;

interface IRoomInfoSyncForDatasheet {
  type: typeof DATASHEET_ROOM_INFO_SYNC;
  payload: ICollaborator[];
  datasheetId: string;
}

interface IRoomInfoSyncForDashboard {
  type: typeof DASHBOARD_ROOM_INFO_SYNC;
  payload: ICollaborator[];
  dashboardId: string;
}

interface IRoomInfoSyncForForm {
  type: typeof FORM_ROOM_INFO_SYNC;
  payload: ICollaborator[];
  formId: string;
}

interface IRoomInfoSyncForMirror {
  type: typeof MIRROR_ROOM_INFO_SYNC;
  payload: ICollaborator[];
  mirrorId: string;
}

export type IRoomInfoSync = IRoomInfoSyncForDashboard | IRoomInfoSyncForForm | IRoomInfoSyncForDatasheet | IRoomInfoSyncForMirror;

interface IResourceErrCodeForDatasheet {
  type: typeof DATASHEET_ERROR_CODE,
  payload: number | null,
  datasheetId: string,
}

interface IResourceErrCodeForForm {
  type: typeof FORM_ERROR_CODE,
  payload: number | null,
  formId: string,
}

interface IResourceErrCodeForDashboard {
  type: typeof DASHBOARD_ERROR_CODE,
  payload: number | null,
  dashboardId: string,
}

interface IResourceErrCodeForMirror {
  type: typeof MIRROR_ERROR_CODE,
  payload: number | null,
  mirrorId: string,
}

export type IResourceErrCode = IResourceErrCodeForDatasheet | IResourceErrCodeForForm | IResourceErrCodeForDashboard | IResourceErrCodeForMirror;

interface IUpdateDatasheet {
  type: typeof UPDATE_DATASHEET,
  payload: Partial<INodeMeta>,
  datasheetId: string,
}

interface IUpdateDashboard {
  type: typeof UPDATE_DASHBOARD,
  payload: Partial<INodeMeta>,
  dashboardId: string,
}

interface IUpdateMirror {
  type: typeof UPDATE_MIRROR,
  payload: Partial<INodeMeta>,
  mirrorId: string,
}

export type IUpdateResource = IUpdateDatasheet | IUpdateDashboard | IUpdateMirror;

export interface IActiveDatasheetCollaboratorAction {
  type: typeof DATASHEET_ACTIVE_COLLABORATOR;
  datasheetId: string;
  payload: ICollaborator;
}

export interface IActiveDashboardCollaboratorAction {
  type: typeof DASHBOARD_ACTIVE_COLLABORATOR;
  dashboardId: string;
  payload: ICollaborator;
}

export interface IActiveFormCollaboratorAction {
  type: typeof FORM_ACTIVE_COLLABORATOR;
  FormId: string;
  payload: ICollaborator;
}

export interface IActiveMirrorCollaboratorAction {
  type: typeof MIRROR_ACTIVE_COLLABORATOR;
  mirrorId: string;
  payload: ICollaborator;
}

export type IActiveCollaboratorAction =
  IActiveDatasheetCollaboratorAction | IActiveFormCollaboratorAction | IActiveDashboardCollaboratorAction | IActiveMirrorCollaboratorAction;

export interface IDeActiveDatasheetCollaborator {
  type: typeof DATASHEET_DEACTIVATE_COLLABORATOR;
  datasheetId: string;
  payload: { socketId: string };
}

export interface IDeActiveDashboardCollaborator {
  type: typeof DASHBOARD_DEACTIVATE_COLLABORATOR;
  dashboardId: string;
  payload: { socketId: string };
}

export type IResourceState = IDatasheetState | IDashboard | IFormState | IWidget;

export interface IDeActiveFormCollaborator {
  type: typeof FORM_DEACTIVATE_COLLABORATOR;
  formId: string;
  payload: { socketId: string };
}

export interface IDeActiveMirrorCollaborator {
  type: typeof MIRROR_DEACTIVATE_COLLABORATOR;
  mirrorId: string;
  payload: { socketId: string };
}

export type IDeActiveCollaborator =
  IDeActiveDatasheetCollaborator | IDeActiveFormCollaborator | IDeActiveDashboardCollaborator | IDeActiveMirrorCollaborator;

export interface IToggleDatasheetWidgetPanel {
  type: typeof TOGGLE_WIDGET_PANEL,
  payload: boolean,
  datasheetId: string,
}

export interface IToggleMirrorWidgetPanel {
  type: typeof TOGGLE_WIDGET_PANEL,
  payload: boolean,
  mirrorId: string,
}

export type IToggleWidgetPanelAction = IToggleDatasheetWidgetPanel | IToggleMirrorWidgetPanel;

export interface IChangeDatasheetWidgetPanelWidth {
  type: typeof CHANGE_WIDGET_PANEL_WIDTH,
  payload: number,
  datasheetId: string,
}

export interface IChangeMirrorWidgetPanelWidth {
  type: typeof CHANGE_WIDGET_PANEL_WIDTH,
  payload: number,
  mirrorId: string,
}

export type IChangeWidgetPanelWidth = IChangeMirrorWidgetPanelWidth | IChangeDatasheetWidgetPanelWidth;

export interface ISwitchDatasheetActivePanel {
  type: typeof SWITCH_ACTIVE_PANEL,
  payload: string | null,
  datasheetId: string,
}

export interface ISwitchMirrorActivePanel {
  type: typeof SWITCH_ACTIVE_PANEL,
  payload: string | null,
  mirrorId: string,
}

export type ISwitchActivePanel = ISwitchDatasheetActivePanel | ISwitchMirrorActivePanel;
