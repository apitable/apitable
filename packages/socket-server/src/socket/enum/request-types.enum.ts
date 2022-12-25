/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
