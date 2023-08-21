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

import { ApiTipConstant, IUserValue, MemberType } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { UnitInfo } from 'database/interfaces';
import { pull } from 'lodash';
import { EnvConfigKey } from 'shared/common';
import { UnitTypeEnum } from 'shared/enums';
import { ApiException } from 'shared/exception';
import { IOssConfig, IUnitMemberRefIdMap } from 'shared/interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { UnitInfoDto } from 'unit/dtos/unit.info.dto';
import { UnitEntity } from 'unit/entities/unit.entity';
import { UnitTeamMemberRefEntity } from 'unit/entities/unit.team.member.ref.entity';
import { UnitRoleMemberRepository } from 'unit/repositories/unit.role.member.repository';
import { UnitTeamMemberRefRepository } from 'unit/repositories/unit.team.member.ref.repository';
import { UserService } from 'user/services/user.service';
import { UnitBaseInfoDto } from '../dtos/unit.base.info.dto';
import { UnitRepository } from '../repositories/unit.repository';
import { UnitMemberService } from './unit.member.service';
import { UnitTeamService } from './unit.team.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepo: UnitRepository,
    private readonly unitTeamMemberRefRepository: UnitTeamMemberRefRepository,
    private readonly unitRoleMemberRepository: UnitRoleMemberRepository,
    private readonly memberService: UnitMemberService,
    private readonly teamService: UnitTeamService,
    private readonly envConfigService: EnvConfigService,
    private readonly userService: UserService,
  ) {
  }

  /**
   * Batch obtain unit infos
   */
  public async getUnitInfo(spaceId: string, unitIds: string[]): Promise<UnitInfo[]> {
    const unitInfos = await this.unitRepo.selectUnitInfosBySpaceIdAndUnitIds(spaceId, unitIds);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    const needSignatureOldUrlMap = new Map();
    const afterUnitInfos = unitInfos.reduce((pre, cur) => {
      if (cur.avatar && !cur.avatar.startsWith('http')) {
        needSignatureOldUrlMap.set(cur.uuid, cur.avatar);
        cur.avatar = oss.host + '/' + cur.avatar;
      }
      cur.isMemberNameModified = Number(cur.isMemberNameModified) === 1;
      pre.push(cur);
      return pre;
    }, []);
    const attachmentTokens: string[] = Array.from(needSignatureOldUrlMap.values());


    if (!oss.ossSignatureEnabled || !attachmentTokens.length){
      return afterUnitInfos;
    }

    const signatureMap = await this.userService.getSignatureMap(attachmentTokens);

    // Loop Replace URL
    afterUnitInfos.forEach((dto: UnitInfo) => {
      if (needSignatureOldUrlMap.has(dto.uuid)){
        dto.avatar = signatureMap.get(needSignatureOldUrlMap.get(dto.uuid))!;
      }
    });
    return afterUnitInfos;
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
      this.memberService.getMembersBaseInfo(unitMemberRefIdMap[MemberType.Member]!),
      this.teamService.getTeamsByIdsIncludeDeleted(unitMemberRefIdMap[MemberType.Team]!),
    ]);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    const needSignatureOldUrlMap = new Map();
    const unitInfos = units.reduce<UnitInfoDto[]>((pre, cur) => {
      const tmp = cur.unitType === MemberType.Member ? members[cur.unitRefId] : teams[cur.unitRefId];
      if (tmp) {
        if (tmp.avatar && !tmp.avatar.startsWith('http')) {
          needSignatureOldUrlMap.set(tmp.userId, tmp.avatar);
        }
        const avatar = tmp.avatar ? (tmp.avatar.startsWith('http') ? tmp.avatar : oss.host + '/' + tmp.avatar) : '';
        pre.push({
          avatar,
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

    const attachmentTokens: string[] = Array.from(needSignatureOldUrlMap.values());


    if (!oss.ossSignatureEnabled || !attachmentTokens.length){
      return unitInfos;
    }

    const signatureMap = await this.userService.getSignatureMap(attachmentTokens);

    // Loop Replace URL
    unitInfos.forEach(dto => {
      if (needSignatureOldUrlMap.has(dto.uuid)){
        dto.avatar = signatureMap.get(needSignatureOldUrlMap.get(dto.uuid))!;
      }
    });
    return unitInfos;
  }

  /**
   * get All members by unitIds, include members from member, team and role
   */
  public async getMembersByUnitIds(spaceId: string, unitIds: string[]): Promise<{ unitId: UnitInfoDto[] }[]> {
    const units = await this.getUnitInfoByIdsIncludeDeleted(unitIds);
    const unitMemberRefIdMap = this.getMemberRefIdMapFromUnities(units);
    const roleMembers = await this.unitRoleMemberRepository.selectByRoleIds(unitMemberRefIdMap[MemberType.Role]!);
    const memberIds = unitMemberRefIdMap[MemberType.Member]!;
    // get teamIds from roles while role.unitType is UnitType.Team
    const teamIds: string[] = [...unitMemberRefIdMap[MemberType.Team]!.map(t => String(t))];
    roleMembers.forEach(roleMember => {
      if (roleMember.unitType === MemberType.Team) {
        teamIds.push(String(roleMember.unitRefId));
      } else if (roleMember.unitType === MemberType.Member) {
        memberIds.push(roleMember.unitRefId);
      }
    });
    // get sub teamIds by teams
    const { teamIdSubTeamIdsMap, subTeams } = await this.teamService.getTeamIdSubTeamIdsMapBySpaceIdAndParentIds(spaceId, teamIds);
    teamIds.push(...subTeams);
    const teamMembers = await this.unitTeamMemberRefRepository.selectByTeamIds(teamIds);
    teamMembers.forEach(teamMember => {
      memberIds.push(teamMember.memberId);
    });
    const members = await this.memberService.getMemberBasicInfo(memberIds);
    const memberUnits = await this.getUnitsByUnitRefIds(memberIds);
    return units.reduce<{ unitId: UnitInfoDto[] }[]>((pre, cur) => {
      if (!pre[cur.id]) pre[cur.id] = [];
      if (cur.unitType === MemberType.Member) {
        // Process individual members in roles
        this.processMember(cur.unitRefId, members, memberUnits, pre, cur.id);
      } else if (cur.unitType === MemberType.Team) {
        // Process team members
        this.processTeamMembers(teamMembers, members, memberUnits, teamIdSubTeamIdsMap, cur.unitRefId, cur.id, pre);
      } else if (cur.unitType === MemberType.Role) {
        const unitRoleMembers = roleMembers.filter(t => t.roleId === cur.unitRefId);
        for (const roleMember of unitRoleMembers) {
          if (roleMember.unitType === MemberType.Member) {
            // Process individual members in roles
            this.processMember(roleMember.unitRefId, members, memberUnits, pre, cur.id);
          } else if (roleMember.unitType === MemberType.Team) {
            // Process team members in roles
            this.processTeamMembers(teamMembers, members, memberUnits, teamIdSubTeamIdsMap, roleMember.unitRefId, cur.id, pre);
          }
        }
      }
      return pre;
    }, []);
  }

  /**
   * Process team members and add their information to the result array.
   */
  private processTeamMembers(
    teamMembers: UnitTeamMemberRefEntity[],
    members: { [memberId: number]: IUserValue },
    memberUnits: UnitEntity[],
    teamIdSubTeamIdsMap: { [teamId: string]: string[] },
    unitRefId: number,
    curId: string,
    pre: { unitId: UnitInfoDto[] }[]
  ): void {
    const unitTeamMembers = teamMembers.filter(t => t.teamId === unitRefId);

    if (teamIdSubTeamIdsMap[unitRefId]) {
      // Process sub team members
      teamIdSubTeamIdsMap[unitRefId]?.forEach(subTeamId => {
        const subTeamMembers = teamMembers.filter(t => String(t.teamId) === subTeamId);
        subTeamMembers.forEach(subTeamMember => {
          this.processMember(subTeamMember.memberId, members, memberUnits, pre, curId);
        });
      });
    }

    unitTeamMembers.forEach(teamMember => {
      this.processMember(teamMember.memberId, members, memberUnits, pre, curId);
    });
  }

  /**
   * Process a member and add its information to the result array.
   */
  private processMember(
    memberId: number,
    members: { [memberId: number]: IUserValue },
    memberUnits: UnitEntity[],
    pre: { unitId: UnitInfoDto[] }[],
    cursorUnitId: string
  ): void {
    const user = members[memberId];
    const unit = memberUnits.find(t => t.unitRefId === memberId);
    if (user && unit) {
      pre[cursorUnitId].push({
        name: user.name,
        unitId: unit.id,
        userId: user.userId,
      });
    }
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
   * get units by unit ref Ids
   */
  public async getUnitsByUnitRefIds(unitRefIds: number[]): Promise<UnitEntity[]> {
    return await this.unitRepo.selectUnitsByUnitRefIds(unitRefIds);
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
    const needSignatureOldUrlMap = new Map();
    users.map(user => {
      const member = memberMap[user.id];
      if (user.avatar && !user.avatar.startsWith('http')) {
        needSignatureOldUrlMap.set(user.id, user.avatar);
      }
      const avatar = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : oss.host + '/' + user.avatar) : '';
      // key is ID of user table
      userMap.set(user.id, {
        avatar,
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
    const attachmentTokens: string[] = Array.from(needSignatureOldUrlMap.values());


    if (!oss.ossSignatureEnabled || !attachmentTokens.length){
      return userMap;
    }

    const signatureMap = await this.userService.getSignatureMap(attachmentTokens);

    // Loop Replace URL
    userMap.forEach((value, key) => {
      if (needSignatureOldUrlMap.has(key)){
        value.avatar = signatureMap.get(needSignatureOldUrlMap.get(key))!;
      }
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

  public async getIdByUnitIdAndSpaceIdAndUnitType(unitId: string, spaceId: string, unitType: UnitTypeEnum): Promise<string | undefined> {
    const result = await this.unitRepo.selectIdByUnitIdAndSpaceIdAndUnitType(unitId, spaceId, unitType);
    if (result) return result.id;
    return undefined;
  }

  public async checkUnitIdsExists(unitIds: string[], spaceId: string, unitType: UnitTypeEnum): Promise<void> {
    const result = await this.unitRepo.selectUnitIdsByUnitIdsAndSpaceIdAndUnitType(unitIds, spaceId, unitType);
    if (result) {
      pull(unitIds, ...result.map((i) => i.unitId));
    }
    if (unitIds.length) {
      switch (unitType) {
        case UnitTypeEnum.TEAM:
          throw ApiException.tipError(ApiTipConstant.api_org_member_team_error, { unitId: unitIds.join(', ') });
        case UnitTypeEnum.ROLE:
          throw ApiException.tipError(ApiTipConstant.api_org_member_role_error, { unitId: unitIds.join(', ') });
        default:
          throw ApiException.tipError(ApiTipConstant.api_param_unit_not_exists);
      }
    }
  }
}
