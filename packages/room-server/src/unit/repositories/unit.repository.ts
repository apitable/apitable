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

import { UnitTypeEnum } from 'shared/enums';
import { EntityRepository, getConnection, In, Repository } from 'typeorm';
import { UnitBaseInfoDto } from '../dtos/unit.base.info.dto';
import { UnitEntity } from '../entities/unit.entity';

/**
 * Operations on table `unit`
 *
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitEntity)
export class UnitRepository extends Repository<UnitEntity> {
  public async selectUnitMembersByIdsIncludeDeleted(unitIds: string[]): Promise<UnitBaseInfoDto[]> {
    return await this.find({ select: ['id', 'unitType', 'unitRefId'], where: { id: In(unitIds) }});
  }

  selectCountByIdAndSpaceId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }

  selectIdByRefIdAndSpaceId(refId: string, spaceId: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { unitRefId: refId, spaceId, isDeleted: false }});
  }

  public async selectUnitInfosBySpaceIdAndUnitIds(spaceId: string, unitIds: string[]) {
    const queryRunner = getConnection().createQueryRunner();
    const tableNamePrefix = this.manager.connection.options.entityPrefix;
    // todo(itou): replace dynamic sql
    const unitInfo: any[] = await queryRunner.query(
      `
          SELECT
            vu.id unitId,
            vu.unit_id originalUnitId,
            vu.unit_type type,
            vu.is_deleted isDeleted,
            COALESCE(vut.team_name, vum.member_name, vur.role_name) name,
            u.avatar avatar,
            u.color avatarColor,
            u.nick_name nickName,
            IFNULL(vum.is_social_name_modified, 2) > 0 AS isMemberNameModified,
            vum.is_active isActive,
            u.uuid userId,
            u.uuid uuid
          FROM ${tableNamePrefix}unit vu
          LEFT JOIN ${tableNamePrefix}unit_team vut ON vu.unit_ref_id = vut.id
          LEFT JOIN ${tableNamePrefix}unit_member vum ON vu.unit_ref_id = vum.id
          LEFT JOIN ${tableNamePrefix}unit_role vur ON vu.unit_ref_id = vur.id
          LEFT JOIN ${tableNamePrefix}user u ON vum.user_id = u.id
          WHERE vu.space_id = ? AND vu.id IN (?)
        `,
      [spaceId, unitIds],
    );
    await queryRunner.release();
    return unitInfo;
  }

  /**
   * get units by unit ref Ids
   */
  public async selectUnitsByUnitRefIds(unitRefIds: number[]): Promise<UnitEntity[]> {
    return await this.find({ select: ['id', 'unitType', 'unitRefId'], where: { unitRefId: In(unitRefIds) }});
  }

  selectIdByUnitIdAndSpaceIdAndUnitType(unitId: string, spaceId: string, unitType: UnitTypeEnum): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { unitId: unitId, spaceId, unitType: unitType, isDeleted: false }});
  }

  selectUnitIdsByUnitIdsAndSpaceIdAndUnitType(unitIds: string[], spaceId: string, unitType: UnitTypeEnum): Promise<{ unitId: string }[] | undefined> {
    return this.find({ select: ['unitId'], where: { unitId: In(unitIds), spaceId, unitType: unitType, isDeleted: false }});
  }
}
