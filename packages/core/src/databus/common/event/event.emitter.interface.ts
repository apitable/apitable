import { IDatasheetEventHandler } from './event.handler.interface';
import { IDatasheetEvent } from './event.interface';
import { DatasheetEventType } from './event.type.enum';

export interface IEventEmitter {
  /**
   * Add an event handler to the datasheet.
   *
   * @returns `true` if the event handler was successfully added. `false` if the same handler was previously added.
   */
  addEventHandler(handler: IDatasheetEventHandler): boolean;

  /**
   * Remove an event handler from the datasheet.
   *
   * @returns `true` if the event handler was successfully removed. `false` if the handler did not exist in the datasheet.
   */
  removeEventHandler(handler: IDatasheetEventHandler & { type: DatasheetEventType }): boolean;

  /**
   * Remove all event handles of a specific type from the datasheet.
   */
  removeEventHandlers(type: DatasheetEventType): void;

  /**
   * Fire an event in the datasheet, invoking corresponding event handlers. The data saver will be invoked
   * if the event is a CommandExecuted event. The data save is always invoked before all event handlers.
   */
  fireEvent(event: IDatasheetEvent): Promise<void>;
}
