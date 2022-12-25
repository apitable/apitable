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

import { DatasheetWidgetEntity } from '../entities/datasheet.widget.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetWidgetEntity)
export class DatasheetWidgetRepository extends Repository<DatasheetWidgetEntity> {
  async selectDstIdsByWidgetIds(widgetIds: string[]): Promise<string[] | null> {
    return await this.find({
      select: ['dstId'],
      where: [{ widgetId: In(widgetIds) }],
    }).then(entities => {
      return entities.map(entity => entity.dstId);
    });
  }

  async selectDstIdsByNodeId(nodeId: string): Promise<string[] | null> {
    const raws = await this.createQueryBuilder('vdw')
      .select('vdw.dst_id', 'dstId')
      .innerJoin(`${this.manager.connection.options.entityPrefix}widget`, 'vw', 'vdw.widget_id = vw.widget_id')
      .andWhere('vw.node_id = :nodeId', { nodeId })
      .andWhere('vw.is_deleted = 0')
      .getRawMany();
    return raws.reduce<string[]>((pre, cur) => {
      pre.push(cur.dstId);
      return pre;
    }, []);
  }
}
