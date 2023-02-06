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

import { IResourceRevision } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { ServerException } from '../../../shared/exception';
import { ResourceException } from '../../../shared/exception/resource.exception';
import { WidgetRepository } from '../repositories/widget.repository';

@Injectable()
export class WidgetService {
  constructor(
    private readonly widgetRepository: WidgetRepository,
  ) { }

  async getNodeIdByWidgetId(widgetId: string): Promise<string> {
    const rawData = await this.widgetRepository.selectNodeIdByWidgetId(widgetId);
    if (!rawData?.nodeId) {
      throw new ServerException(ResourceException.WIDGET_NOT_EXIST);
    }
    return rawData.nodeId;
  }

  async getWidgetInfo(widgetId: string): Promise<{ nodeId: string; revision: number } | undefined> {
    return await this.widgetRepository.getNodeIdAndRevision(widgetId);
  }

  async getStorageByWidgetId(widgetId: string): Promise<{ [key: string]: any }> {
    const rawData = await this.widgetRepository.selectStorageByWidgetId(widgetId);
    if (!rawData?.storage) {
      throw new ServerException(ResourceException.WIDGET_NOT_EXIST);
    }
    return rawData.storage;
  }

  async getDelWidgetIdsByNodeId(nodeId: string): Promise<string[]> {
    const raws = await this.widgetRepository.selectWidgetIdsByNodeIdAndIsDeleted(nodeId, true);
    return raws.map(item => item.widgetId);
  }

  async getRevisionByWdtIds(widgetIds: string[]): Promise<IResourceRevision[]> {
    return await this.widgetRepository.getRevisionByWdtIds(widgetIds);
  }
}

