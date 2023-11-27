/**
 * Before defining a new event, declare it below
 */
export enum OPEventNameEnums {
  FieldUpdated = 'FieldUpdated',
  CellUpdated = 'CellUpdated',
  RecordCreated = 'RecordCreated',
  RecordDeleted = 'RecordDeleted',
  RecordUpdated = 'RecordUpdated',
  RecordMetaUpdated = 'RecordMetaUpdated',
  RecordCommentUpdated = 'RecordCommentUpdated',
  FormSubmitted = 'FormSubmitted',
  RecordArchived = 'RecordArchived',
  RecordUnarchived = 'RecordUnarchived',
  ButtonClicked = 'ButtonClicked',
}

export enum EventRealTypeEnums {
  VIRTUAL = 'VIRTUAL',
  REAL = 'REAL',
  ALL = 'ALL',
}

export enum EventAtomTypeEnums {
  ATOM = 'ATOM',
  COMB = 'COMB',
}

export enum EventSourceTypeEnums {
  LOCAL = 'LOCAL',
  REMOTE = 'REMOTE',
  ALL = 'ALL',
}
