import { IPermissions } from '../catalog_tree';
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

// 服务端数据结构
export interface IServerFormPack {
  sourceInfo: ISourceDatasheetInfo;
  snapshot: IFormSnapshot;
  form: INodeMeta;
}
