import { OPEventCellUpdated } from './cell_updated';
import { OPEventFieldUpdated } from './field_updated';
import { OPEventRecordCreated } from './record_created';
import { OPEventRecordDeleted } from './record_deleted';
import { OPEventRecordCommentUpdated, OPEventRecordMetaUpdated, OPEventRecordUpdated } from './record_updated';

export const datasheetEvent = {
  // Cell
  OPEventCellUpdated,
  // OPEventMemberCellAdd,
  // OPEventMemberCellUpdate,
  // field
  OPEventFieldUpdated,
  // Record
  OPEventRecordDeleted,
  OPEventRecordUpdated,
  OPEventRecordCommentUpdated,
  OPEventRecordMetaUpdated,
  OPEventRecordCreated,
};