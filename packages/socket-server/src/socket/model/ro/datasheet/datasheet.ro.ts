import { BroadcastTypes } from 'socket/enum/broadcast-types.enum';

export class FieldPermissionChange {
  uuids: string[];
  role: string;
  permission: any;
}

export class FieldPermissionChangeRo {
    event: BroadcastTypes;
    datasheetId: string;
    fieldId: string;
    operator: string;
    changeTime: number;
    setting: any;
    changes: FieldPermissionChange[];
}
