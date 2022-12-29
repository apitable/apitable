import { IResourceOpsCollect, IReduxState, IError } from '@apitable/core';
import { Store } from 'redux';
import { DatasheetEventType } from './event.type.enum';

export type IDatasheetEventHandler = IDatasheetDataChangeEventHandler | IDatasheetCommandExecutedEventHandler;

export type IDatasheetEvent = IDatasheetDataChangeEvent | IDatasheetCommandExecutedEvent;

export interface IDatasheetDataChangeEventHandler {
  type: DatasheetEventType.DataChange;
  handle(event: IDatasheetDataChangeEvent): Promise<void>;
}

export interface IDatasheetCommandExecutedEventHandler {
  type: DatasheetEventType.CommandExecuted;
  handle(event: IDatasheetCommandExecutedEvent): Promise<void>;
}

export type IDatasheetDataChangeEvent = INewRecordsEvent;

export interface INewRecordsEvent {
  type: DatasheetEventType.DataChange;
}

export type IDatasheetCommandExecutedEvent =
  | {
      type: DatasheetEventType.CommandExecuted;
      store: Store<IReduxState>;
      collectedResourceOps: IResourceOpsCollect[];
      setExtra(extra: any): void;
    }
  | {
      type: DatasheetEventType.CommandExecuted;
      error: IError;
    };
