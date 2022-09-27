import { NotificationRo } from 'src/model/ro/notification/notification.ro';
import { AuthenticatedSocket } from 'src/interface/socket/authenticated-socket.interface';
import { WatchSpaceRo } from 'src/model/ro/notification/watch-space.ro';
import { NodeChangeRo } from 'src/model/ro/notification/node-change.ro';

export interface INotificationService {
  /**
   * 广播消息通知
   * @param message
   */
  broadcastNotify(message: NotificationRo, client: AuthenticatedSocket): any;

  /**
   * 监听空间站内部消息
   *
   * @param message 参数
   * @param client socket连接
   * @return
   * @author Zoe Zheng
   * @date 2020/7/6 4:30 下午
   */
  watchSpace(message: WatchSpaceRo, client: AuthenticatedSocket): Promise<boolean>;

  /**
   * 节点发生变化通知
   *
   * @param message 参数
   * @param client socket连接
   * @return
   * @author Zoe Zheng
   * @date 2020/7/7 10:20 上午
   */
  nodeChange(message: NodeChangeRo, client: AuthenticatedSocket): boolean;

  /**
   * 离开空间
   * @param message 参数
   * @param client socket连接
   * @return
   * @author Zoe Zheng
   * @date 2020/7/13 11:08 上午
   */
  leaveSpace(message: WatchSpaceRo, client: AuthenticatedSocket): Promise<boolean>;

  /**
   * node browsed event
   * @param nodeId node id
   * @param uuid user uuid
   * @return boolean
   */
   nodeBrowsed(nodeId: string, uuid: string): Promise<boolean>;
}
