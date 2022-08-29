/**
 * record/changeset的来源类型
 */
export enum SourceTypeEnum {
  /**
   * 神奇表单
   */
  FORM = 0,
  /**
   * 开放平台api
   */
  OPEN_API = 1,
  /**
   * 关联关系的影响（节点的复制/删除）
   */
  RELATION_EFFECT = 2,
  /**
   * 镜像
   */
  MIRROR = 3,
}
