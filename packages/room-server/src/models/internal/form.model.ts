import { IServerFormPack, IFormSnapshot, ISourceDatasheetInfo, IPermissions } from '@vikadata/core';
import { FieldPermissionMap } from './datasheet.model';
import { NodeInfo } from './node.model';

export class NodeRelInfo {
  datasheetId: string;
  viewId: string;
  datasheetName: string;
  datasheetIcon: string;
  datasheetRevision: number;
  relNodeId?: string;
  datasheetPermissions?: IPermissions;
}

export class FormDataPack extends FieldPermissionMap implements IServerFormPack {
  sourceInfo: ISourceDatasheetInfo;
  snapshot: IFormSnapshot;
  form: NodeInfo;
}