/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@nestjs/common';
import { ResourceType } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { DatasheetChangesetEntity } from '../../datasheet/entities/datasheet.changeset.entity';
import { ResourceChangesetEntity } from '../entities/resource.changeset.entity';
import { ChangesetView } from '../../interfaces';
import { ResourceChangesetRepository } from '../repositories/resource.changeset.repository';
import { Logger } from 'winston';
import { NodeService } from 'node/services/node.service';
import { ResourceService } from './resource.service';
import { DatasheetChangesetService } from 'database/datasheet/services/datasheet.changeset.service';
import { MetaService } from './meta.service';

/**
 * Changeset service for all resources (including datasheets, widgets, etc)
 */
@Injectable()
export class ChangesetService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly resourceService: ResourceService,
    private readonly resourceMetaService: MetaService,
    private readonly datasheetChangesetService: DatasheetChangesetService,
    private readonly resourceChangesetRepository: ResourceChangesetRepository,
  ) {}

  /**
   * Get maximum revision of changesets, may be null
   */
  async getMaxRevision(resourceId: string, resourceType: ResourceType): Promise<number | null | undefined> {
    if (resourceType === ResourceType.Datasheet) {
      return await this.resourceMetaService.getRevisionByDstId(resourceId);
    }
    // non-datasheet resource
    return await this.nodeService.getRevisionByResourceId(resourceId);
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
      return await this.datasheetChangesetService.selectByDstIdAndRevisions(resourceId, revisions);
    }
    return await this.resourceChangesetRepository.getByResourceIdAndRevisions(resourceId, revisions);
  }

  /**
   * Check if the message exists
   */
  async countByResourceIdAndMessageId(resourceId: string, resourceType: ResourceType, messageId: string): Promise<boolean> {
    let count;
    if (resourceType === ResourceType.Datasheet) {
      count = await this.datasheetChangesetService.countByDstIdAndMessageId(resourceId, messageId);
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
      return await this.datasheetChangesetService.getChangesetOrderList(resourceId, startRevision, endRevision);
    }
    return await this.resourceChangesetRepository.getChangesetOrderList(resourceId, startRevision, endRevision);
  }

}
