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
import { UnitTagRepository } from '../repositories/unit.tag.repository';

/**
 * unitTag related operations
 * 
 * @author Zoe zheng
 * @date 2020/7/30 6:32 PM
 */
@Injectable()
export class UnitTagService {
  constructor(private readonly unitTagRepo: UnitTagRepository) {}

  async getIdBySpaceIdAndName(spaceId: string, tagName: string): Promise<string | null> {
    const rawData = await this.unitTagRepo.selectIdBySpaceIdAndName(spaceId, tagName);
    if (rawData) return rawData.id;
    return null;
  }

  getCountBySpaceIdAndId(id: string, spaceId: string): Promise<number> {
    return this.unitTagRepo.selectCountByIdAndSpaceId(id, spaceId);
  }
}
