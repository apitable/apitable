import { IResourceEventHandler } from './event.handler.interface';
import { IResourceEvent } from './event.interface';
import { ResourceEventType } from './event.type.enum';

/**
 * An event emitter is able to handle DataBus events.
 */
export interface IEventEmitter {
  /**
   * Add an event handler.
   *
   * @returns `true` if the event handler was successfully added. `false` if the same handler was previously added.
   */
  addEventHandler(handler: IResourceEventHandler): boolean;

  /**
   * Remove an event handler.
   *
   * @returns `true` if the event handler was successfully removed. `false` if the handler did not exist in the datasheet.
   */
  removeEventHandler(handler: IResourceEventHandler & { type: ResourceEventType }): boolean;

  /**
   * Remove all event handles of a specific type.
   */
  removeEventHandlers(type: ResourceEventType): void;

  /**
   * Fire an event, invoking corresponding event handlers.
   */
  fireEvent(event: IResourceEvent): Promise<void>;
}
