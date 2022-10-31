export enum RequestTypes {
  /**
   * Build long connection channels
   */
  WATCH_ROOM = 'WATCH_ROOM',

  /**
   * Leave collaboration ROOM
   */
  LEAVE_ROOM = 'LEAVE_ROOM',

  /**
   * RESOURCE JOIN ROOM
   *
   * @deprecated
   */
  RESOURCE_JOIN_ROOM = 'RESOURCE_JOIN_ROOM',

  /**
   * RESOURCE LEAVE ROOM
   *
   * @deprecated
   */
  RESOURCE_LEAVE_ROOM = 'RESOURCE_LEAVE_ROOM',

  /**
   * room send changeset
   */
  CLIENT_ROOM_CHANGE = 'CLIENT_ROOM_CHANGE',

  /**
   * nest-server send changeset (nest-server `fusion api` triggers)
   */
  NEST_ROOM_CHANGE = 'NEST_ROOM_CHANGE',

  /**
   * send changeset
   *
   * @deprecated
   */
  USER_CHANGES = 'USER_CHANGES',

  /**
   * Pull the missing version of changeset
   *
   * @deprecated
   */
  NEW_CHANGES = 'NEW_CHANGES',

  /**
   * Update your own cursor
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * Switch from one table to another by yourself
   *
   * @deprecated
   */
  SWITCH_DATASHEET = 'SWITCH_DATASHEET',
}

export enum NotificationTypes {
  /**
   * listen for messages
   */
  NOTIFY = 'NOTIFY',

  /**
   * into space
   */
  WATCH_SPACE = 'WATCH_SPACE',

  /**
   * node change
   */
  NODE_CHANGE = 'NODE_CHANGE',

  /**
   * node browsing event
   */
  NODE_BROWSED = 'NODE_BROWSED',
}
