import { datasheetEvent } from './events/datasheet';
import { IEventListenerOptions } from './interface/event_manager.interface';

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

/**
 * When listening for events, you can pass in option parameters. 
 * By default, all events are subscribed, and the event is triggered after the event op apply to the store.
 */
export const defaultEventListenerOptions: IEventListenerOptions = {
  realType: EventRealTypeEnums.ALL,
  sourceType: EventSourceTypeEnums.ALL,
  beforeApply: false,
};

export const REMOTE_NEW_CHANGES = 'REMOTE_NEW_CHANGES';
export const EMPTY_ARRAY = [];
export const DEFAULT_EVENT_MANAGER_OPTIONS = {
  enableVirtualEvent: false,
  enableCombEvent: false,
  enableEventComplete: false
};

// Mapping relationship between event name and event definition class
export const EventNameClsMap = {
  // cell
  [OPEventNameEnums.CellUpdated]: datasheetEvent.OPEventCellUpdated,
  // field
  [OPEventNameEnums.FieldUpdated]: datasheetEvent.OPEventFieldUpdated,
  // record
  [OPEventNameEnums.RecordCommentUpdated]: datasheetEvent.OPEventRecordCommentUpdated,
  [OPEventNameEnums.RecordMetaUpdated]: datasheetEvent.OPEventRecordMetaUpdated,
  [OPEventNameEnums.RecordCreated]: datasheetEvent.OPEventRecordCreated,
  [OPEventNameEnums.RecordDeleted]: datasheetEvent.OPEventRecordDeleted,
  [OPEventNameEnums.RecordUpdated]: datasheetEvent.OPEventRecordUpdated,
};

