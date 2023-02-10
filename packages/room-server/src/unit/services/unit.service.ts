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

import { MemberType } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { UnitInfo } from 'database/interfaces';
import { EnvConfigKey } from 'shared/common';
import { UnitTypeEnum } from 'shared/enums';
import { IOssConfig, IUnitMemberRefIdMap } from 'shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { UnitRepository } from '../repositories/unit.repository';
import { UnitMemberService } from './unit.member.service';
import { UnitTeamService } from './unit.team.service';
import { UserService } from 'user/services/user.service';
import { UnitBaseInfoDto } from '../dtos/unit.base.info.dto';
import { UnitInfoDto } from '../dtos/unit.info.dto';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepo: UnitRepository,
    private readonly memberService: UnitMemberService,
    private readonly teamService: UnitTeamService,
    private readonly envConfigService: EnvConfigService,
    private readonly userService: UserService,
  ) {}

  /**
   * Batch obtain unit infos
   */
  public async getUnitInfo(spaceId: string, unitIds: string[]): Promise<UnitInfo[]> {
    const unitInfos = await this.unitRepo.selectUnitInfosBySpaceIdAndUnitIds(spaceId, unitIds);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return unitInfos.reduce((pre, cur) => {
      if (cur.avatar && !cur.avatar.startsWith('http')) {
        cur.avatar = oss.host + '/' + cur.avatar;
      }
      cur.isMemberNameModified = Number(cur.isMemberNameModified) === 1;
      pre.push(cur);
      return pre;
    }, []);
  }

  /**
   * @param unitIds
   * @return Promise<UnitEntity[]>
   * @author Zoe Zheng
   * @date 2020/7/30 5:52 PM
   */
  private async getUnitInfoByIdsIncludeDeleted(unitIds: string[]): Promise<UnitBaseInfoDto[]> {
    if (!unitIds.length) return [];
    return await this.unitRepo.selectUnitMembersByIdsIncludeDeleted(unitIds);
  }

  /**
   * @param unitIds
   * @return
   * @author Zoe Zheng
   * @date 2020/7/30 5:53 PM
   */
  public async getUnitMemberInfoByIds(unitIds: string[]): Promise<UnitInfoDto[]> {
    const units = await this.getUnitInfoByIdsIncludeDeleted(unitIds);
    const unitMemberRefIdMap = this.getMemberRefIdMapFromUnities(units);
    const [members, teams] = await Promise.all([
      this.memberService.getMembersBaseInfo(unitMemberRefIdMap[MemberType.Member]),
      this.teamService.getTeamsByIdsIncludeDeleted(unitMemberRefIdMap[MemberType.Team]),
    ]);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return units.reduce<UnitInfoDto[]>((pre, cur) => {
      const tmp = cur.unitType === MemberType.Member ? members[cur.unitRefId] : teams[cur.unitRefId];
      if (tmp) {
        pre.push({
          avatar: tmp.avatar ? oss.host + '/' + tmp.avatar : '',
          isActive: tmp?.isActive!,
          isDeleted: tmp?.isDeleted!,
          isNickNameModified: tmp?.isNickNameModified!,
          isMemberNameModified: tmp?.isMemberNameModified!,
          nickName: tmp.nickName!,
          avatarColor: tmp.avatarColor!,
          name: tmp.name,
          type: cur.unitType,
          unitId: cur.id,
          userId: tmp.userId,
          uuid: tmp.userId,
        });
      }
      return pre;
    }, []);
  }

  /**
   * Group by type and refId in unitEntities
   *
   * @param unitEntities
   * @return IUnitMemberRefIdMap
   * @author Zoe Zheng
   * @date 2020/7/30 5:11 PM
   */
  private getMemberRefIdMapFromUnities(unitEntities: UnitBaseInfoDto[]): IUnitMemberRefIdMap {
    const memberIds: number[] = [];
    const teamIds: number[] = [];
    const roleIds: number[] = [];
    unitEntities.forEach(unit => {
      if (unit.unitType === MemberType.Member) {
        memberIds.push(unit.unitRefId);
      }
      if (unit.unitType === MemberType.Team) {
        teamIds.push(unit.unitRefId);
      }
      if (unit.unitType === MemberType.Role) {
        roleIds.push(unit.unitRefId);
      }
    });
    return { [MemberType.Member]: memberIds, [MemberType.Team]: teamIds, [MemberType.Role]: roleIds };
  }

  public async getCountBySpaceIdAndId(unitId: string, spaceId: string): Promise<number> {
    return await this.unitRepo.selectCountByIdAndSpaceId(unitId, spaceId);
  }

  /**
   *
   * @param unitName
   * @param unitType
   * @param spaceId
   * @return Promise<string | null>
   * @author Zoe Zheng
   * @date 2020/9/9 1:41 AM
   */
  public async getIdByNameAndType(unitName: string, unitType: UnitTypeEnum, spaceId: string): Promise<string | null> {
    let refId;
    if (UnitTypeEnum.TEAM === unitType) {
      refId = await this.teamService.getIdBySpaceIdAndName(spaceId, unitName);
    }
    if (UnitTypeEnum.MEMBER === unitType) {
      refId = await this.memberService.getIdBySpaceIdAndName(spaceId, unitName);
    }
    if (refId) {
      return this.getIdByRefIdAndSpaceId(refId, spaceId);
    }
    return null;
  }

  private async getIdByRefIdAndSpaceId(refId: string, spaceId: string): Promise<string | null> {
    const entity = await this.unitRepo.selectIdByRefIdAndSpaceId(refId, spaceId);
    if (entity) return entity.id;
    return null;
  }

  public async getUnitMemberInfoByUserIds(spaceId: string, userIds: string[], excludeDeleted = true): Promise<Map<string, UnitInfoDto>> {
    const userMap = new Map<string, UnitInfoDto>();
    if (!userIds.length) return userMap;
    const users = excludeDeleted
      ? await this.userService.selectUserBaseInfoByIds(userIds as any[])
      : await this.userService.selectUserBaseInfoByIdsWithDeleted(userIds);
    const memberMap = await this.memberService.getMembersBaseInfoBySpaceIdAndUserIds(spaceId, userIds, excludeDeleted);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    users.map(user => {
      const member = memberMap[user.id];
      // key is ID of user table
      userMap.set(user.id, {
        avatar: user.avatar ? oss.host + '/' + user.avatar : '',
        isActive: member?.isActive!,
        isDeleted: member?.isDeleted!,
        isNickNameModified: user.isSocialNameModified !== 0,
        isMemberNameModified: member?.isMemberNameModified!,
        name: member ? member.memberName : user.nikeName!,
        nickName: user.nikeName!,
        avatarColor: user.color!,
        type: UnitTypeEnum.MEMBER,
        // NOTE here userId is uuid
        userId: user.uuid!,
        unitId: member?.unitId!,
        uuid: user.uuid!,
      });
    });
    return userMap;
  }

  async getIdByUserIdAndSpaceId(userId: string, spaceId: string): Promise<string | undefined> {
    const memberId = await this.memberService.getIdBySpaceIdAndUserId(spaceId, userId);
    if (!memberId) {
      return undefined;
    }
    return this.unitRepo.selectIdByRefIdAndSpaceId(memberId, spaceId).then(o => o?.id);
  }
}
