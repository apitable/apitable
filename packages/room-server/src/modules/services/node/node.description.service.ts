import { Injectable } from '@nestjs/common';
import { NodeDescRepository } from 'modules/repository/node.desc.repository';

@Injectable()
export class NodeDescriptionService {
  constructor(private readonly repository: NodeDescRepository) {}

  /**
   * 获取节点描述
   */
  async getDescription(nodeId: string): Promise<string | null> {
    const rawData = await this.repository.selectDescriptionByNodeId(nodeId);
    if (rawData) return rawData.description;
    return null;
  }
}
