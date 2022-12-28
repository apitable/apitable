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

import { omit } from 'lodash';
import { EntityRepository, In, Repository } from 'typeorm';
import { UnitMemberEntity } from '../entities/unit.member.entity';

/**
 * Operations on table `unit_member`
 *
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitMemberEntity)
export class UnitMemberRepository extends Repository<UnitMemberEntity> {
  selectMembersByIdsIncludeDeleted(memberIds: number[]): Promise<UnitMemberEntity[]> {
    return this.find({
      select: ['memberName', 'id', 'userId', 'mobile', 'spaceId', 'isActive', 'isDeleted', 'isSocialNameModified'],
      where: { id: In(memberIds) },
    });
  }

  selectIdBySpaceIdAndName(spaceId: string, memberName: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { spaceId, memberName, isDeleted: false }});
  }

  selectSpaceIdsByUserId(userId: string): Promise<string[]> {
    return this.find({ select: ['spaceId'], where: [{ userId, isDeleted: false }] }).then(entities => {
      return entities.map(entity => entity.spaceId);
    });
  }

  selectIdBySpaceIdAndUserId(spaceId: string, userId: string): Promise<UnitMemberEntity | undefined> {
    return this.findOne({ select: ['id'], where: [{ spaceId, userId, isDeleted: false }] });
  }

  selectCountByIdAndSpaceId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }

  async selectMembersBySpaceIdAndUserIds(
    spaceId: string,
    userIds: string[],
    excludeDeleted: boolean,
  ): Promise<{
    memberName: string; id: string; userId: string; isActive: number; isDeleted: boolean; isMemberNameModified?: boolean; unitId: string
  }[]> {
    const query = this.createQueryBuilder('vum')
      .leftJoin(`${this.manager.connection.options.entityPrefix}unit`, 'vu', 'vu.unit_ref_id = vum.id')
      .select('vum.member_name', 'memberName')
      .addSelect('vum.id', 'id')
      .addSelect('vum.user_id', 'userId')
      .addSelect('vum.is_active', 'isActive')
      .addSelect('vum.is_deleted', 'isDeleted')
      //  WeCom requires this field
      .addSelect('IFNULL(vum.is_social_name_modified, 2) > 0', 'isMemberNameModified')
      .addSelect('vu.id', 'unitId')
      .where('vum.space_id = :spaceId', { spaceId })
      .andWhere('vum.user_id IN (:...userIds)', { userIds })
      .andWhere('vu.unit_type = 3');
    if (excludeDeleted) {
      query.andWhere('vum.is_deleted = 0').andWhere('vu.is_deleted = 0');
    }
    const members = await query.getRawMany<{
      memberName: string; id: string; userId: string; isActive: number; isDeleted: boolean; isMemberNameModified: '0' | '1'; unitId: string
    }>();
    return members.reduce((pre, cur) => {
      const item: {
        memberName: string; id: string; userId: string; isActive: number; isDeleted: boolean; isMemberNameModified?: boolean; unitId: string
      } = omit(cur, 'isMemberNameModified');
      item.isMemberNameModified = Number(cur.isMemberNameModified) === 1;
      pre.push(item);
      return pre;
    }, [] as any[]);
  }
}
