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

import { EntityRepository, getConnection, In, Repository } from 'typeorm';
import { UserBaseInfoDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

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
   * TODO(Troy): stop using multiple joins query and break it in several small queries instead(refactor: multiple joins query is prohibited #2848)
   * TODO(Troy): use DTO instead of any
   * @param spaceId 
   * @param uuids 
   * @returns 
   */
  async selectUserInfoBySpaceIdAndUuids(spaceId: string, uuids: string[]): Promise<any[]> {
    const queryRunner = getConnection().createQueryRunner();
    const tableNamePrefix = this.manager.connection.options.entityPrefix;
    // todo(itou): replace dynamic sql
    const users: any[] = await queryRunner.query(
      `
          SELECT
            vu.uuid userId,
            vu.uuid uuid,
            vu.color avatarColor,
            vu.nick_name nickName,
            vui.id unitId, 
            vui.unit_id originalUnitId,
            vui.is_deleted isDeleted,
            vui.unit_type type,
            IFNULL(vum.member_name,vu.nick_name) name,
            vu.avatar avatar,
            vum.is_active isActive,
            IFNULL(vu.is_social_name_modified, 2) > 0  AS isNickNameModified,
            IFNULL(vum.is_social_name_modified, 2) > 0 AS isMemberNameModified
          FROM ${tableNamePrefix}user vu
          LEFT JOIN ${tableNamePrefix}unit_member vum ON vum.user_id = vu.id AND vum.space_id = ?
          LEFT JOIN ${tableNamePrefix}unit vui ON vui.unit_ref_id = vum.id
          WHERE uuid IN (?)
        `,
      [spaceId, uuids],
    );
    await queryRunner.release();
    return users;
  }

  /**
   * Query user info by user ID array
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 6:10 PM
   */
  public async selectUserBaseInfoByIds(userIds: number[]): Promise<UserBaseInfoDto[]> {
    return await this.find({
      select: ['id', 'uuid', 'avatar', 'nikeName', 'color', 'isSocialNameModified'],
      where: [{
        id: In(userIds),
        isDeleted: false
      }]
    });
  }

  selectUserBaseInfoByIdsWithDeleted(userIds: string[]): Promise<UserEntity[]> {
    return this.find({ select: ['id', 'uuid', 'avatar', 'nikeName', 'color', 'isSocialNameModified'], where: [{ id: In(userIds) }] });
  }
}
