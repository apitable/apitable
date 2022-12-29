import * as Player from './player';
import { SystemConfig } from '../../../config/system_config';
import { IEvent, _getEventName } from './player';

const Events = SystemConfig.player.events;

export {
  Player,
  IEvent,
  Events,
  _getEventName,
};
