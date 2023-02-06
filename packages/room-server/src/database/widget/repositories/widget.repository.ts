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
import { WidgetEntity } from '../entities/widget.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(WidgetEntity)
export class WidgetRepository extends Repository<WidgetEntity> {
  selectNodeIdByWidgetId(widgetId: string): Promise<{ nodeId: string } | undefined> {
    return this.findOne({
      select: ['nodeId'],
      where: [{ widgetId, isDeleted: false }],
    });
  }

  selectStorageByWidgetId(widgetId: string): Promise<WidgetEntity | undefined> {
    return this.findOne({
      select: ['storage'],
      where: [{ widgetId, isDeleted: false }],
    });
  }

  selectWidgetIdsByNodeIdAndIsDeleted(nodeId: string, isDeleted?: boolean): Promise<WidgetEntity[]> {
    return this.find({
      select: ['widgetId'],
      where: [{ nodeId, isDeleted }],
    });
  }

  /**
   * Query revisions corresponding to multiple widgets
   */
  public async getRevisionByWdtIds(widgetIds: string[]): Promise<IResourceRevision[]> {
    return await this.createQueryBuilder()
      .select('widget_id', 'resourceId')
      .addSelect('revision')
      .where('widget_id IN (:...widgetIds)', { widgetIds })
      .andWhere('is_deleted = 0')
      .getRawMany<IResourceRevision>();
  }

  getNodeIdAndRevision(widgetId: string): Promise<{ nodeId: string; revision: number } | undefined> {
    return this.findOne({
      select: ['nodeId', 'revision'],
      where: [{ widgetId }],
    });
  }
}
