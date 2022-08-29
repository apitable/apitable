export enum RequestTypes {
  /**
   * 建立长连接通道
   */
  WATCH_ROOM = 'WATCH_ROOM',

  /**
   * 离开协作ROOM
   */
  LEAVE_ROOM = 'LEAVE_ROOM',

  /**
   * RESOURCE 加入 ROOM
   */
  RESOURCE_JOIN_ROOM = 'RESOURCE_JOIN_ROOM',

  /**
   * RESOURCE 离开 ROOM
   */
  RESOURCE_LEAVE_ROOM = 'RESOURCE_LEAVE_ROOM',

  /**
   * ROOM 发送 changeset
   */
  CLIENT_ROOM_CHANGE = 'CLIENT_ROOM_CHANGE',

  /**
   * NEST 服务的 ROOM 消息 
   */
  NEST_ROOM_CHANGE = 'NEST_ROOM_CHANGE',

  /**
   * 发送 changeset
   */
  USER_CHANGES = 'USER_CHANGES',

  /**
   * 拉取缺失版本的 changeset
   */
  NEW_CHANGES = 'NEW_CHANGES',

  /**
   * 更新自己的光标
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * 自己从一个表切换到另外一个表
   */
  SWITCH_DATASHEET = 'SWITCH_DATASHEET',
}

export enum NotificationTypes {
  /**
   * 监听消息
   */
  NOTIFY = 'NOTIFY',
  /**
   *  进入空间
   */
  WATCH_SPACE = 'WATCH_SPACE',
  /**
   * 节点变更
   */
  NODE_CHANGE = 'NODE_CHANGE',
  /**
   *  离开空间
   */
  LEAVE_SPACE = 'LEAVE_SPACE',
}
