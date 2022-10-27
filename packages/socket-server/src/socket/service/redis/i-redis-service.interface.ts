
export interface IRedisService {
  /**
   * 将socketId存入redis
   * @param userId
   * @return Promise<[(Error | null), any][]>
   * @author Shawn Deng
   * @date 2020/5/11 11:07 上午
   */
  saveUserSocketId(userId: string, socketId: string): Promise<[Error | null, any][]>;

  /**
   *
   * @param key
   * @param value
   * @param ex 超时时间毫秒
   * @return
   * @author Zoe Zheng
   * @date 2020/6/2 3:36 下午
   */
  saveValue(key: string, value: string, ex: number | string);

  /**
   * 移除socketId
   * @param userId
   * @param socketId
   * @return
   * @author Zoe Zheng
   * @date 2020/6/2 3:39 下午
   */
  removeUserSocketId(userId: string, socketId: string);

  /**
   * 获取数据
   *
   * @param key
   * @return
   * @author Zoe Zheng
   * @date 2020/6/9 11:59 下午
   */
  getValue(key: string);

  /**
   * 批量获取数据
   * @param keys 
   */
  getValues(keys: string[]): Promise<any[] | null>;

  /**
   * 获取 set 数据
   * @param key 
   */
  getSet(key: string): Promise<any[]>;

  /**
   *  获取redis的状态
   * @param
   * @return
   * @author Zoe Zheng
   * @date 2020/6/11 5:39 下午
   */
  getStatus();

  /**
   * 保存服务端的socket信息，用于发送确认消息
   * @param prefix
   * @param key
   * @param value socket连接用户ID
   * @return
   * @author Zoe Zheg
   * @date 2020/7/18 6:35 下午
   */
  saveSocket(prefix: string, key: string, value: string);

  /**
   * 获取对应ipAddress的socket连接
   * @param prefix
   * @return AuthenticatedSocket
   * @author Zoe Zheng
   * @date 2020/7/18 6:53 下午
   */
  getSockets(prefix: string): Promise<Record<string, string>>;

  /**
   * 删除对应socketId的实例
   *
   * @param prefix
   * @param key
   * @return
   * @author Zoe Zheng
   * @date 2020/7/18 6:54 下午
   */
  removeSocket(prefix: string, key: string);
}
