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

import { UserEntity } from '../entities/user.entity';
import { EntityRepository, In, Repository } from 'typeorm';

/**
 * Operations on table `developer`
 * 
 * @author Zoe zheng
 * @date 2020/7/24 3:15 PM
 */
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  /**
   * Query user info by user ID
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 PM
   */
  selectUserBaseInfoById(userId: string): Promise<UserEntity | undefined> {
    return this.findOne({
      select: ['id', 'uuid', 'nikeName', 'avatar', 'locale'],
      where: [{ id: userId, isDeleted: false }],
    });
  }

  selectUserIdByUuid(uuid: string): Promise<string | undefined> {
    return this.findOne({
      select: ['id'],
      where: [{ uuid, isDeleted: false }],
    }).then(result => result?.id);
  }

  /**
   * Query user info by user ID array
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 PM
   */
  selectUserBaseInfoByIds(userIds: number[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds), isDeleted: false }] });
  }

  selectUserBaseInfoByIdsWithDeleted(userIds: string[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'isSocialNameModified'], where: [{ id: In(userIds) }] });
  }
}
