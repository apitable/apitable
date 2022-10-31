import { IChangeset } from 'engine/ot/interface';
import { OP2Event } from 'event_manager/op2event';
import { IReduxState } from 'store';
import { IEventInstance, IOPEvent } from './event.interface';
import { IEventManager } from './event_manager.interface';

export interface IOPEventManagerOptions {
  op2Event: OP2Event;
  /**
   * How to get state
   */
  getState: (resourceMap?: any) => IReduxState | Promise<IReduxState>;
  options: {
    // Whether to enable virtual events
    enableVirtualEvent?: boolean;
    // Whether to enable combined events
    enableCombEvent?: boolean;
    // Whether to enable event completion
    enableEventComplete?: boolean;
  }
}
type IEvents = IEventInstance<IOPEvent>[];
export interface IOPEventManager extends IEventManager {
  // The following two methods have the same processing logic, the difference is when getState
  // The room layer needs to check the database asynchronously; 
  // the front end is a direct synchronous operation, otherwise the state will be inconsistent.
  asyncHandleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): Promise<IEvents>
  handleChangesets(changesets: Omit<IChangeset, 'messageId'>[]): IEvents
}