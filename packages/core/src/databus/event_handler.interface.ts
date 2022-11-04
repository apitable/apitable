import { ICollaCommandExecuteResult } from "command_manager";
import { DatasheetEventType } from "./event_type.enum"

export type IDatasheetEventHandler = IDatasheetDataChangeEventHandler | IDatasheetCommandExecutedEventHandler

export type IDatasheetEvent = IDatasheetDataChangeEvent | IDatasheetCommandExecutedEvent

export interface IDatasheetDataChangeEventHandler {
  type: DatasheetEventType.DataChange;
  handle(event: IDatasheetDataChangeEvent): Promise<void>;
}

export interface IDatasheetCommandExecutedEventHandler {
  type: DatasheetEventType.CommandExecuted;
  handle(event: IDatasheetCommandExecutedEvent): Promise<void>;
}

export type IDatasheetDataChangeEvent = INewRecordsEvent

export interface INewRecordsEvent {
  type: DatasheetEventType.DataChange;
}

export interface IDatasheetCommandExecutedEvent {
  type: DatasheetEventType.CommandExecuted;
  extra: unknown,
  execResult: ICollaCommandExecuteResult<unknown>;
}