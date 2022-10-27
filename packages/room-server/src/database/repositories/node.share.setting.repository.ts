import { NodeShareSettingEntity } from '../entities/node.share.setting.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NodeShareSettingEntity)
export class NodeShareSettingRepository extends Repository<NodeShareSettingEntity> {

  /**
   * 根据分享ID获取分享设置
   */
  selectByShareId(shareId: string): Promise<NodeShareSettingEntity | undefined> {
    return this.findOne({ where: [{ shareId }] });
  }

  /**
   * 根据节点ID获取分享设置
   */
  selectByNodeId(nodeId: string): Promise<NodeShareSettingEntity | undefined> {
    return this.findOne({ where: [{ nodeId }] });
  }
}
