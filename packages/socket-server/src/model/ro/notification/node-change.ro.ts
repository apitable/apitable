/**
 * <p>
 * 节点变更的基本消息
 * </p>
 * @author Zoe zheng
 * @date 2020/7/6 4:25 下午
 */
export class NodeChangeRo {
  readonly spaceId: string;
  readonly type: string;
  /**
   * 客户端操作方socketId,用于过滤消息
   */
  readonly socketId: string;
  readonly data: any;
  readonly uuid?: string;
}
