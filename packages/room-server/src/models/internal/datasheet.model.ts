import {
  IOperation, IRemoteChangeset, IRecordMap,
  IRecord, IServerDatasheetPack,
  IBaseDatasheetPack, ISnapshot, 
  IUserValue, IUnitValue, IFieldPermissionMap,
  IGetRecords, ResourceType, IViewPack, IViewProperty,
} from '@vikadata/core';
import { NodeInfo } from './node.model';

export class ChangesetView implements IRemoteChangeset {
  userId: string;
  spaceId: string;
  messageId: string;
  revision: number;
  resourceId: string;
  resourceType: ResourceType;
  operations: IOperation[];
  createdAt: number;
}

export class RecordMap implements IRecordMap {
  [recordId: string]: IRecord;
}

export class RecordsMapView implements IGetRecords {
  revision: number;
  recordMap?: IRecordMap;
}

export class UnitInfo implements IUnitValue {
  unitId: string;
  type: number;
  name: string;
  uuid?: string;
  userId?: string;
  avatar?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export class UserInfo implements IUserValue {
  uuid: string;
  userId: string;
  name: string;
  avatar?: string;
}

export class FieldPermissionMap {
  fieldPermissionMap? : IFieldPermissionMap;
}

export class DatasheetPack extends FieldPermissionMap implements IServerDatasheetPack {
  snapshot: ISnapshot;
  datasheet: NodeInfo;
  foreignDatasheetMap?: { [foreignDatasheetId: string]: IBaseDatasheetPack; };
  units?: (UserInfo | UnitInfo)[];
}

export class ViewPack implements IViewPack {
  view: IViewProperty;
  revision: number;
}
