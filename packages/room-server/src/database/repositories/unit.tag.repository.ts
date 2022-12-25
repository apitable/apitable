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

import { UnitTagEntity } from '../entities/unit.tag.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * Operations on table `unit_tag`
 * 
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitTagEntity)
export class UnitTagRepository extends Repository<UnitTagEntity> {
  selectIdBySpaceIdAndName(spaceId: string, tagName: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { tagName, spaceId }});
  }

  selectCountByIdAndSpaceId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }
}
