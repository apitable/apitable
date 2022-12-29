import { Injectable } from '@nestjs/common';
import { ResourceType } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { DatasheetChangesetEntity } from '../../entities/datasheet.changeset.entity';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { ChangesetView } from '../../interfaces';
import { DatasheetChangesetRepository } from '../../repositories/datasheet.changeset.repository';
import { ResourceChangesetRepository } from '../../repositories/resource.changeset.repository';
import { ResourceService } from 'database/services/resource/resource.service';
import { Logger } from 'winston';
import { NodeService } from '../node/node.service';

/**
 * Changeset service for all resources (including datasheets, widgets, etc)
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
   * Get maximum revision of changesets, may be null
   */
  async getMaxRevision(resourceId: string, resourceType: ResourceType): Promise<number | null> {
    if (resourceType === ResourceType.Datasheet) {
      return await this.nodeService.getRevisionByDstId(resourceId);
    }
    // non-datasheet resource
    return await this.nodeService.getReversionByResourceId(resourceId);
  }

  /**
   * Obtain changeset list by revisions
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
   * Check if the message exists
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

  async getChangesetList(resourceId: string, resourceType: ResourceType, startRevision: number, endRevision: number): Promise<ChangesetView[]> {
    this.logger.info(`[${resourceId}] Obtain changesets by revisions`);

    const spaceId = await this.resourceService.getSpaceIdByResourceId(resourceId);

    const rawResult = await this.getChangesetOrderList(resourceId, resourceType, startRevision, endRevision);

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
   * Obtain changeset list by revisions, whose order follows that of revisions.
   */
  private async getChangesetOrderList(resourceId: string, resourceType: ResourceType, startRevision: number, endRevision: number): Promise<any[]> {
    this.logger.info(`revision list: ${startRevision} to ${endRevision}`);
    if (resourceType === ResourceType.Datasheet) {
      return await this.datasheetChangesetRepository.getChangesetOrderList(resourceId, startRevision, endRevision);
    }
    return await this.resourceChangesetRepository.getChangesetOrderList(resourceId, startRevision, endRevision);
  }

}
