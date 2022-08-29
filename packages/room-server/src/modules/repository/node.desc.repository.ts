import { NodeDescEntity } from 'entities/node.desc.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(NodeDescEntity)
export class NodeDescRepository extends Repository<NodeDescEntity> {
  selectDescriptionByNodeId(nodeId: string): Promise<{ description: string } | undefined> {
    return this.createQueryBuilder('vnd')
      .select('vnd.description', 'description')
      .where('vnd.node_id = :nodeId', { nodeId })
      .getRawOne<{ description: string }>();
  }
}
