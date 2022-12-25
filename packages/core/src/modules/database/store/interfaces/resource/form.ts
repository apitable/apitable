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

import { IPermissions } from '../../../../space/store/interfaces/catalog_tree';
import { IMeta, INodeMeta, IFieldPermissionMap, ICollaborator } from './datasheet/datasheet';

export interface IFormMap {
  [formId: string]: IFormPack;
}

export interface IFormPack {
  loading: boolean;
  connected: boolean;
  syncing: boolean;
  form: IFormState | null;
  client: IFormClient;
  errorCode: number | null;
}

export interface IFormState extends INodeMeta {
  sourceInfo: ISourceDatasheetInfo;
  snapshot: IFormSnapshot;
  fieldPermissionMap: IFieldPermissionMap
}

export interface ISourceDatasheetInfo {
  datasheetId: string;
  viewId: string;
  datasheetName: string;
  datasheetIcon: string;
  datasheetRevision: number;
  datasheetPermissions?: IPermissions;
}

export interface IFormSnapshot {
  meta: IMeta;
  formProps: IFormProps;
}

export interface IFormProps {
  showRecordHistory?: boolean;
  title?: string;
  description?: {
    html: string;
    content: any;
  };
  coverUrl?: string;
  logoUrl?: string;
  coverVisible?: boolean;
  logoVisible?: boolean;
  brandVisible?: boolean;
  indexVisible?: boolean;
  fullScreen?: boolean;
  fillAnonymous?: boolean;
  submitLimit?: number;
  hasSubmitted?: boolean;
  compactMode?: boolean;
}

export interface IFormClient {
  collaborators?: ICollaborator[];
}

export interface IResourceMeta {
  [key: string]: any;
}

/**
 * the data structure of server-side form 
 */
export interface IServerFormPack {
  sourceInfo: ISourceDatasheetInfo;
  snapshot: IFormSnapshot;
  form: INodeMeta;
}
