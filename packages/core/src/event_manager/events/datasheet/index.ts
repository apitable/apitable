import { OPEventCellUpdated } from './cell_updated';
import { OPEventFieldUpdated } from './field_updated';
import { OPEventRecordCreated } from './record_created';
import { OPEventRecordDeleted } from './record_deleted';
import { OPEventRecordCommentUpdated, OPEventRecordMetaUpdated, OPEventRecordUpdated } from './record_updated';

export const datasheetEvent = {
  // 单元格
  OPEventCellUpdated,
  // OPEventMemberCellAdd,
  // OPEventMemberCellUpdate,
  // 字段
  OPEventFieldUpdated,
  // 记录
  OPEventRecordDeleted,
  OPEventRecordUpdated,
  OPEventRecordCommentUpdated,
  OPEventRecordMetaUpdated,
  OPEventRecordCreated,
};