import { NodeShareSettingEntity } from '../entities/node.share.setting.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NodeShareSettingEntity)
export class NodeShareSettingRepository extends Repository<NodeShareSettingEntity> {

  /**
   * Obtain the sharing setting with a sharing ID
   */
  selectByShareId(shareId: string): Promise<NodeShareSettingEntity | undefined> {
    return this.findOne({ where: [{ shareId }] });
  }

  /**
   * Obtain the sharing setting with a node ID
   */
  selectByNodeId(nodeId: string): Promise<NodeShareSettingEntity | undefined> {
    return this.findOne({ where: [{ nodeId }] });
  }
}
