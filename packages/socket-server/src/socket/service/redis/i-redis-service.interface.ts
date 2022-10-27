export interface IRedisService {
  /**
   * store socket id in redis
   * @param userId
   * @param socketId
   */
  saveUserSocketId(userId: string, socketId: string): Promise<[Error | null, any][]>;

  /**
   * save value to cache
   * @param key
   * @param value
   * @param ex
   */
  saveValue(key: string, value: string, ex: number | string);

  /**
   * remove cached socket id
   * @param userId
   * @param socketId
   */
  removeUserSocketId(userId: string, socketId: string);

  /**
   * get cached data
   *
   * @param key
   */
  getValue(key: string);

  /**
   * get cached data in batches
   *
   * @param keys
   */
  getValues(keys: string[]): Promise<any[] | null>;

  /**
   * get set type data
   *
   * @param key
   */
  getSet(key: string): Promise<any[]>;

  /**
   * get the status of redis
   */
  getStatus();

  /**
   * Save the socket information of the server for sending confirmation messages
   *
   * @param prefix
   * @param key
   * @param value socket connection user id
   */
  saveSocket(prefix: string, key: string, value: string);

  /**
   * Get the socket connection corresponding to the ip Address
   *
   * @param prefix
   */
  getSockets(prefix: string): Promise<Record<string, string>>;

  /**
   * delete socket information
   *
   * @param prefix
   * @param key
   */
  removeSocket(prefix: string, key: string);
}
