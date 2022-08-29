import { Injectable } from '@nestjs/common';
import { ResourceType } from '@vikadata/core';
import { InjectLogger } from 'common';
import { DatasheetChangesetEntity } from 'entities/datasheet.changeset.entity';
import { ResourceChangesetEntity } from 'entities/resource.changeset.entity';
import { ChangesetView } from 'models';
import { DatasheetChangesetRepository } from 'modules/repository/datasheet.changeset.repository';
import { ResourceChangesetRepository } from 'modules/repository/resource.changeset.repository';
import { ResourceService } from 'modules/services/resource/resource.service';
import { Logger } from 'winston';
import { NodeService } from '../node/node.service';

/**
 * 所有资源（包括数表、组件...） 的 Changeset Service
 */
@Injectable()
export class ChangesetService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly resourceService: ResourceService,
    private readonly datasheetChangesetRepository: DatasheetChangesetRepository,
    private readonly resourceChangesetRepository: ResourceChangesetRepository,
  ) {}

  /**
   * 获取资源变更集的最大版本
   * 可能为null
   *
   * @param resourceId    资源ID
   * @param resourceType  资源类型
   */
  async getMaxRevision(resourceId: string, resourceType: ResourceType): Promise<number | null> {
    if (resourceType === ResourceType.Datasheet) {
      return await this.nodeService.getRevisionByDstId(resourceId);
    }
    // 非数表资源
    return await this.nodeService.getReversionByResourceId(resourceId);
  }

  /**
   * 查询变更集列表
   *
   * @param resourceId    资源ID
   * @param resourceType  资源类型
   * @param revisions     版本列表
   */
  async getByRevisions(
    resourceId: string,
    resourceType: ResourceType,
    revisions: number[],
  ): Promise<(DatasheetChangesetEntity | ResourceChangesetEntity)[]> {
    if (resourceType === ResourceType.Datasheet) {
      return await this.datasheetChangesetRepository.selectByDstIdAndRevisions(resourceId, revisions);
    }
    return await this.resourceChangesetRepository.getByResourceIdAndRevisions(resourceId, revisions);
  }

  /**
   * 查询消息是否存在
   *
   * @param resourceId    资源ID
   * @param resourceType  资源类型
   * @param messageId     消息ID
   */
  async countByResourceIdAndMessageId(resourceId: string, resourceType: ResourceType, messageId: string): Promise<boolean> {
    let count;
    if (resourceType === ResourceType.Datasheet) {
      count = await this.datasheetChangesetRepository.countByDstIdAndMessageId(resourceId, messageId);
    } else {
      count = await this.resourceChangesetRepository.countByResourceIdAndMessageId(resourceId, messageId);
    }
    return count > 0;
  }

  async getChangesetList(resourceId: string, resourceType: ResourceType, revisions: string | number[]): Promise<ChangesetView[]> {
    this.logger.info(`[${resourceId}]根据版本查询变更集`);

    const spaceId = await this.resourceService.getSpaceIdByResourceId(resourceId);

    const rawResult = await this.getChangesetOrderList(resourceId, resourceType, revisions);

    return rawResult.reduce<ChangesetView[]>((pre, cur) => {
      pre.push({
        userId: cur.userId,
        spaceId,
        messageId: cur.messageId,
        revision: +cur.revision,
        resourceId: cur.resourceId,
        resourceType,
        operations: typeof cur.operations === 'string' ? JSON.parse(cur.operations) : cur.operations,
        createdAt: Date.parse(cur.createdAt.toString()),
      });
      return pre;
    }, []);
  }

  /**
   * 按顺序查询changeset
   *
   * @param resourceId 来源ID
   * @param resourceType 来源类型
   * @param revisions 版本列表
   */
  async getChangesetOrderList(resourceId: string, resourceType: ResourceType, revisions: string | number[]): Promise<any[]> {
    this.logger.info(`revision list: ${revisions}`);
    if (resourceType === ResourceType.Datasheet) {
      return await this.datasheetChangesetRepository.getChangesetOrderList(resourceId, revisions);
    }
    return await this.resourceChangesetRepository.getChangesetOrderList(resourceId, revisions);
  }

}
