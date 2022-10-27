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
   * 批量获取组织单元信息
   * @param spaceId 空间ID
   * @param unitIds 组织单元ID列表
   */
  async getUnitInfo(spaceId: string, unitIds: string[]): Promise<UnitInfo[]> {
    const queryRunner = getConnection().createQueryRunner();
    const unitInfo = await queryRunner.query(
      `
          SELECT vu.id unitId, vu.unit_type type, vu.is_deleted isDeleted,
          COALESCE(vut.team_name, vum.member_name, vur.role_name) name, u.avatar avatar,
          IFNULL(vum.is_social_name_modified, 2) > 0 AS isMemberNameModified,
          vum.is_active isActive, u.uuid userId, u.uuid uuid
          FROM vika_unit vu
          LEFT JOIN vika_unit_team vut ON vu.unit_ref_id = vut.id
          LEFT JOIN vika_unit_member vum ON vu.unit_ref_id = vum.id
          LEFT JOIN vika_unit_role vur ON vu.unit_ref_id = vur.id
          LEFT JOIN vika_user u ON vum.user_id = u.id
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
   * 根据ID获取基本信息
   * @param unitIds
   * @return Promise<UnitEntity[]>
   * @author Zoe Zheng
   * @date 2020/7/30 5:52 下午
   */
  public async getUnitInfoByIdsIncludeDeleted(unitIds: string[]): Promise<UnitEntity[]> {
    if (!unitIds.length) return [];
    return await this.unitRepo.selectUnitMembersByIdsIncludeDeleted(unitIds);
  }

  /**
   * 根据ID获取组织单元基本信息
   * @param unitIds
   * @return
   * @author Zoe Zheng
   * @date 2020/7/30 5:53 下午
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
   *  根据 unitEntities 里面的type和refId分类
   * @param unitEntities
   * @return IUnitMemberRefIdMap
   * @author Zoe Zheng
   * @date 2020/7/30 5:11 下午
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
   * @date 2020/9/9 1:41 上午
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
   * 根据用户ID获取组织单元基本信息
   *
   * @param spaceId
   * @param userIds users表的ID
   * @param excludeDeleted 排除删除
   * @return Promise<{ [userId: string]: UnitBaseInfoDto } | null
   * @author Zoe Zheng
   * @date 2021/4/13 5:28 下午
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
      // key是user表的ID
      userMap.set(user.id, {
        avatar: user.avatar ? oss.host + '/' + user.avatar : '',
        isActive: member?.isActive,
        isDeleted: member?.isDeleted,
        isNickNameModified: user.isSocialNameModified !== 0,
        isMemberNameModified: member?.isMemberNameModified,
        name: member ? member.memberName : user.nikeName,
        type: UnitTypeEnum.MEMBER,
        // 这里是uuid
        userId: user.uuid,
        unitId: member?.unitId,
        uuid: user.uuid,
      });
    });
    return userMap;
  }
}
