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
   * There are new active collaborators
   */
  ACTIVATE_COLLABORATOR = 'ACTIVATE_COLLABORATOR',

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
