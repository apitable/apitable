import { AuthenticatedSocket } from '../../interface/socket/authenticated-socket.interface';
import { SocketRo } from '../../model/ro/socket.ro';

/**
 * <p>
 * nest-server 连接服务接口
 * </p>
 * @author Zoe zheng
 * @date 2020/6/29 5:57 下午
 */
export interface NestInterface {

  /**
   *
   * @param socket 保存当前连接的socket
   * @return
   * @author Zoe Zheng
   * @date 2020/7/21 2:10 下午
   */
  setSocket(socket: AuthenticatedSocket);

  /**
   * 获取 nest-server 连接的房间中的随机的 socketId
   *
   * @return
   * @author Zoe Zheng
   * @date 2020/6/29 5:58 下午
   */
  getSocketId(): string;

  /**
   *
   * @param event 事件
   * @param message 具体消息
   * @return boolean
   * @author Zoe Zheng
   * @date 2020/6/29 5:59 下午
   */
  notify(event: string, message: any): Promise<any | null>;

  /**
   * 移除本地缓存
   * @param socketId
   * @return
   * @author Zoe Zheng
   * @date 2020/7/18 4:39 下午
   */
  removeSocket(socket: AuthenticatedSocket);

  /**
   * 处理服务间的通知
   * @param socketRo
   * @return
   * @author Zoe Zheng
   * @date 2020/7/21 2:13 下午
   */
  handleHttpNotify(socketRo: SocketRo);

  /**
   * 发起httpNotify的请求
   * @param event
   * @param message
   * @return
   * @author Zoe Zheng
   * @date 2020/7/21 2:14 下午
   */
  httpNotify(event: string, message: any): Promise<any | null>;
}
