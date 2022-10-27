/**
 * <p>
 * 广播的消息类型
 * </p>
 * @author Zoe zheng
 * @date 2020/6/23 4:33 下午
 */
export enum BroadcastTypes {

  /**
   * 房间内其他用户操作了 changeset
   * 因为相对于客户端来说，是服务端主动推给他的，所以以 Server 开头
   */
  SERVER_ROOM_CHANGE = 'SERVER_ROOM_CHANGE',

  /**
   * 有新激活协作人
   */
  ACTIVATE_COLLABORATOR = "ACTIVATE_COLLABORATOR",

  /**
   * 有新激活协作（多）人
   */
  ACTIVATE_COLLABORATORS = "ACTIVATE_COLLABORATORS",

  /**
   * 有协作人被取消激活
   */
  DEACTIVATE_COLLABORATOR = "DEACTIVATE_COLLABORATOR",

  /**
   * 有用户更新了光标
   */
  ENGAGEMENT_CURSOR = 'ENGAGEMENT_CURSOR',

  /**
   * 节点分享被关闭
   */
  NODE_SHARE_DISABLED = 'NODE_SHARE_DISABLED',

  /**
   * 字段权限开启
   */
  FIELD_PERMISSION_ENABLE = 'FIELD_PERMISSION_ENABLE',

  /**
   * 字段权限变更
   */
  FIELD_PERMISSION_CHANGE = 'FIELD_PERMISSION_CHANGE',

  /**
   * 字段权限关闭
   */
  FIELD_PERMISSION_DISABLE = 'FIELD_PERMISSION_DISABLE',

  /**
   * 字段配置属性变更
   */
   FIELD_PERMISSION_SETTING_CHANGE = 'FIELD_PERMISSION_SETTING_CHANGE',
}
