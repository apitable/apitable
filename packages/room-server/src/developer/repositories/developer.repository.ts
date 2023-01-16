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

import { DeveloperEntity } from '../entities/developer.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * Operations on table `developer`
 * 
 * @author Zoe zheng
 * @date 2020/7/24 3:15 PM
 */
@EntityRepository(DeveloperEntity)
export class DeveloperRepository extends Repository<DeveloperEntity> {
  /**
   * Find the user ID with the given API key
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  async selectUserIdByApiKey(apiKey: string): Promise<{ userId: bigint } | undefined> {
    return await this.findOne({ where: [{ apiKey }], select: ['userId'] });
  }
}
