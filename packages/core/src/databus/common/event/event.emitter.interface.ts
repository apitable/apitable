import { IDatasheetEventHandler } from './event.handler.interface';
import { IDatasheetEvent } from './event.interface';
import { DatasheetEventType } from './event.type.enum';

/**
 * An event emitter is able to handle DataBus events.
 */
export interface IEventEmitter {
  /**
   * Add an event handler.
   *
   * @returns `true` if the event handler was successfully added. `false` if the same handler was previously added.
   */
  addEventHandler(handler: IDatasheetEventHandler): boolean;

  /**
   * Remove an event handler.
   *
   * @returns `true` if the event handler was successfully removed. `false` if the handler did not exist in the datasheet.
   */
  removeEventHandler(handler: IDatasheetEventHandler & { type: DatasheetEventType }): boolean;

  /**
   * Remove all event handles of a specific type.
   */
  removeEventHandlers(type: DatasheetEventType): void;

  /**
   * Fire an event, invoking corresponding event handlers.
   */
  fireEvent(event: IDatasheetEvent): Promise<void>;
}
