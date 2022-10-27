import { NotificationRo } from 'src/socket/model/ro/notification/notification.ro';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { WatchSpaceRo } from 'src/socket/model/ro/notification/watch-space.ro';
import { NodeChangeRo } from 'src/socket/model/ro/notification/node-change.ro';

export interface INotificationService {
  /**
   * broadcast message notification
   * @param message
   */
  broadcastNotify(message: NotificationRo, client: AuthenticatedSocket): boolean;

  /**
   * incoming space station message
   *
   * @param message
   * @param client
   */
  watchSpace(message: WatchSpaceRo, client: AuthenticatedSocket): boolean;

  /**
   * node change message
   *
   * @param message
   * @param client
   */
  nodeChange(message: NodeChangeRo, client: AuthenticatedSocket): boolean;

  /**
   * node browsed event
   *
   * @param nodeId node id
   * @param uuid user uuid
   */
  nodeBrowsed(nodeId: string, uuid: string): Promise<boolean>;
}
