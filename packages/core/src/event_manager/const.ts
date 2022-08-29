import { datasheetEvent } from './events/datasheet';
import { IEventListenerOptions } from './interface/event_manager.interface';

/**
 * 定义新事件前，先在下面声明
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
 * 监听事件时，可以传入选项参数。默认订阅全部事件，并且是在事件 op apply 到 store 之后才触发事件。
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

// 事件名和事件定义类之间的映射关系
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

