import { IDatasheetPermission } from 'core';
import {
  ICollaborator, IFieldPermissionMap, IPageParams, IPermissions, ISelection, ISnapshot, IUnitInfo,
  IWidget, IMirrorMap, IUserInfo
} from 'core';
import { IViewDerivation } from '@apitable/core';

/**
 * Permissions for widget creation, deletion, renaming, location change, etc. 
 * are dependent on the number table or dashboard where the applet is located. 
 * Permission judgments for these operations are handled at the top level.
 * The widget itself has only one permission, namely whether it can write data to the storage.
 * This permission is dynamically calculated based on the environment the widget is currently in.
 */
export interface IWidgetPermission {
  storage: {
    editable: boolean;
  },
  datasheet?: IDatasheetPermission;
}

export interface IDatasheetClient {
  selection?: ISelection | null;
  viewDerivation: {
    [viewId: string]: IViewDerivation;
  }
}

export interface IDatasheetMain {
  id: string;
  description: string;
  datasheetId: string;
  datasheetName: string;
  permissions: IPermissions;
  snapshot: ISnapshot;
  fieldPermissionMap?: IFieldPermissionMap,
  isPartOfData?: boolean;
}

export type IWidgetDatasheetState = {
  connected?: boolean;
  datasheet: IDatasheetMain | null;
  client: IDatasheetClient
};

export type IDatasheetMap = { [key: string]: IWidgetDatasheetState };

export interface IWidgetState {
  widget: IWidget | null;
  errorCode: number | null;
  datasheetMap: IDatasheetMap;
  unitInfo: IUnitInfo | null;
  pageParams?: IPageParams,
  mirrorMap?: IMirrorMap;
  user: IUserInfo | null;
  collaborators: ICollaborator[];
  // Current operating environment permissions.
  permission: IWidgetPermission;
}
