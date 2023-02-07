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

/**
 * Broadcast message types
 */
export enum BroadcastTypes {

  /**
   * Other users in the room have operated changeset
   * Because it is the server that takes the initiative to push it to him as opposed to the client, it starts with `Server`
   */
  SERVER_ROOM_CHANGE = 'SERVER_ROOM_CHANGE',

  /**
   * There are newly activated collaboration (multi) people
   */
  ACTIVATE_COLLABORATORS = 'ACTIVATE_COLLABORATORS',

  /**
   * There are collaborators who are de-activated
   */
  DEACTIVATE_COLLABORATOR = 'DEACTIVATE_COLLABORATOR',

  /**
   * Some users have updated the cursor
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * Node sharing is turned off
   */
  NODE_SHARE_DISABLED = 'NODE_SHARE_DISABLED',

  /**
   * Field permission enabled
   */
  FIELD_PERMISSION_ENABLE = 'FIELD_PERMISSION_ENABLE',

  /**
   * Field permission changes
   */
  FIELD_PERMISSION_CHANGE = 'FIELD_PERMISSION_CHANGE',

  /**
   * Field permission off
   */
  FIELD_PERMISSION_DISABLE = 'FIELD_PERMISSION_DISABLE',

  /**
   * Field configuration property changes
   */
   FIELD_PERMISSION_SETTING_CHANGE = 'FIELD_PERMISSION_SETTING_CHANGE',
}
