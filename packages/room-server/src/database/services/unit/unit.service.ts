import { Injectable } from '@nestjs/common';
import { MemberType } from '@apitable/core';
import { UnitEntity } from '../../entities/unit.entity';
import { UnitTypeEnum } from '../../../shared/enums';
import { IOssConfig, IUnitMemberRefIdMap } from '../../../shared/interfaces';
import { UnitBaseInfoDto } from '../../dtos/unit.base.info.dto';
import { UnitRepository } from '../../repositories/unit.repository';
import { UserRepository } from '../../repositories/user.repository';
import { getConnection } from 'typeorm';
import { UnitInfo } from '../../interfaces';
import { UnitMemberService } from './unit.member.service';
import { UnitTagService } from './unit.tag.service';
import { UnitTeamService } from './unit.team.service';
import { EnvConfigKey } from '../../../shared/common';
import { EnvConfigService } from 'shared/services/config/env.config.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly unitRepo: UnitRepository,
    private readonly memberService: UnitMemberService,
    private readonly tagService: UnitTagService,
    private readonly teamService: UnitTeamService,
    private readonly envConfigService: EnvConfigService,
    private readonly userRepo: UserRepository,
  ) {}

  /**
   * Batch obtain unit infos
   */
  async getUnitInfo(spaceId: string, unitIds: string[]): Promise<UnitInfo[]> {
    const queryRunner = getConnection().createQueryRunner();
    const tableNamePrefix = this.userRepo.manager.connection.options.entityPrefix;
    const unitInfo = await queryRunner.query(
      `
          SELECT vu.id unitId, vu.unit_type type, vu.is_deleted isDeleted,
          COALESCE(vut.team_name, vum.member_name, vur.role_name) name, u.avatar avatar,
          IFNULL(vum.is_social_name_modified, 2) > 0 AS isMemberNameModified,
          vum.is_active isActive, u.uuid userId, u.uuid uuid
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
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return unitInfo.reduce((pre, cur) => {
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
  public async getUnitInfoByIdsIncludeDeleted(unitIds: string[]): Promise<UnitEntity[]> {
    if (!unitIds.length) return [];
    return await this.unitRepo.selectUnitMembersByIdsIncludeDeleted(unitIds);
  }

  /**
   * @param unitIds
   * @return
   * @author Zoe Zheng
   * @date 2020/7/30 5:53 PM
   */
  public async getUnitMemberInfoByIds(unitIds: string[]): Promise<UnitBaseInfoDto[]> {
    const units: UnitEntity[] = await this.getUnitInfoByIdsIncludeDeleted(unitIds);
    const unitMemberRefIdMap = this.getMemberRefIdMapFromUnities(units);
    const [members, teams] = await Promise.all([
      this.memberService.getMembersBaseInfo(unitMemberRefIdMap[MemberType.Member]),
      this.teamService.getTeamsByIdsIncludeDeleted(unitMemberRefIdMap[MemberType.Team]),
    ]);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    return units.reduce<UnitBaseInfoDto[]>((pre, cur) => {
      const tmp = cur.unitType === MemberType.Member ? members[cur.unitRefId] : teams[cur.unitRefId];
      if (tmp) {
        pre.push({
          avatar: tmp.avatar ? oss.host + '/' + tmp.avatar : '',
          isActive: tmp?.isActive,
          isDeleted: tmp?.isDeleted,
          isNickNameModified: tmp?.isNickNameModified,
          isMemberNameModified: tmp?.isMemberNameModified,
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
  private getMemberRefIdMapFromUnities(unitEntities: UnitEntity[]): IUnitMemberRefIdMap {
    const memberIds = [];
    const teamIds = [];
    const roleIds = [];
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

  async getCountBySpaceIdAndId(unitId: string, spaceId: string): Promise<number> {
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
  async getIdByNameAndType(unitName: string, unitType: UnitTypeEnum, spaceId: string): Promise<string | null> {
    let refId;
    if (UnitTypeEnum.TEAM === unitType) {
      refId = await this.teamService.getIdBySpaceIdAndName(spaceId, unitName);
    }
    if (UnitTypeEnum.TAG === unitType) {
      refId = await this.tagService.getIdBySpaceIdAndName(spaceId, unitName);
    }
    if (UnitTypeEnum.MEMBER === unitType) {
      refId = await this.memberService.getIdBySpaceIdAndName(spaceId, unitName);
    }
    if (refId) {
      return this.getIdByRefIdAndSpaceId(refId, spaceId);
    }
    return null;
  }

  async getIdByRefIdAndSpaceId(refId: string, spaceId: string): Promise<string | null> {
    const entity = await this.unitRepo.selectIdByRefIdAndSpaceId(refId, spaceId);
    if (entity) return entity.id;
    return null;
  }

  /**
   * @param userIds ID of users table
   * @return Promise<{ [userId: string]: UnitBaseInfoDto } | null
   * @author Zoe Zheng
   * @date 2021/4/13 5:28 PM
   */
  async getUnitMemberInfoByUserIds(spaceId: string, userIds: string[], excludeDeleted = true): Promise<Map<string, UnitBaseInfoDto>> {
    const userMap = new Map<string, UnitBaseInfoDto>();
    if (!userIds.length) return userMap;
    const users = excludeDeleted
      ? await this.userRepo.selectUserBaseInfoByIds(userIds as any[])
      : await this.userRepo.selectUserBaseInfoByIdsWithDeleted(userIds);
    const memberMap = await this.memberService.getMembersBaseInfoBySpaceIdAndUserIds(spaceId, userIds, excludeDeleted);
    const oss = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    users.map(user => {
      const member = memberMap[user.id];
      // key is ID of user table
      userMap.set(user.id, {
        avatar: user.avatar ? oss.host + '/' + user.avatar : '',
        isActive: member?.isActive,
        isDeleted: member?.isDeleted,
        isNickNameModified: user.isSocialNameModified !== 0,
        isMemberNameModified: member?.isMemberNameModified,
        name: member ? member.memberName : user.nikeName,
        type: UnitTypeEnum.MEMBER,
        // NOTE here userId is uuid
        userId: user.uuid,
        unitId: member?.unitId,
        uuid: user.uuid,
      });
    });
    return userMap;
  }
}
