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

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IResourceMeta, ResourceType } from '@apitable/core';
import { WidgetService } from 'database/widget/services/widget.service';
import { IResourceInfo } from '../interfaces/resource.interface';
import { NodeService } from 'node/services/node.service';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';

/**
 * Meta service for all resources (including datasheets, widgets, etc)
 */
@Injectable()
export class MetaService {
  constructor(
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
    @Inject(forwardRef(() => DatasheetService))
    private readonly datasheetService: DatasheetService,
    private readonly widgetService: WidgetService,
    private readonly resourceMetaRepository: ResourceMetaRepository,
  ) { }

  async getResourceInfo(resourceId: string, resourceType: ResourceType): Promise<IResourceInfo> {
    switch (resourceType) {
      case ResourceType.Datasheet:
        const revision = await this.getRevisionByDstId(resourceId);
        return { resourceRevision: revision, nodeId: resourceId };
      case ResourceType.Form:
      case ResourceType.Dashboard:
      case ResourceType.Mirror:
        const resourceRevision = await this.nodeService.getRevisionByResourceId(resourceId);
        return { resourceRevision, nodeId: resourceId };
      case ResourceType.Widget:
        const widget = await this.widgetService.getWidgetInfo(resourceId);
        return { nodeId: widget?.nodeId, resourceRevision: Number(widget?.revision) };
      default:
        break;
    }
    return {};
  }

  public async selectMetaByResourceId(resourceId: string): Promise<IResourceMeta> {
    return await this.resourceMetaRepository.selectMetaByResourceId(resourceId);
  }

  public async updateMetaDataByResourceId(resourceId: string, userId: string, metaData: IResourceMeta) {
    return await this.resourceMetaRepository.updateMetaDataByResourceId(resourceId, userId, metaData);
  }

  public async updateMetaAndRevision(resourceId: string, userId: string, metaData: IResourceMeta, revision: number) {
    return await this.resourceMetaRepository.updateMetaAndRevision(resourceId, userId, metaData, revision);
  }

  public async selectRevisionByResourceId(resourceId: string): Promise<{ revision: number } | undefined> {
    return await this.resourceMetaRepository.selectRevisionByResourceId(resourceId);
  }

  public async getRevisionByDstId(dstId: string): Promise<number | undefined> {
    const rawData = await this.datasheetService.getRevisionByDstId(dstId);
    return rawData && Number(rawData.revision);
  }
}
