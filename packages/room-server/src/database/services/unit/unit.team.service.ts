import { Injectable } from '@nestjs/common';
import { IUserValue, MemberType } from '@apitable/core';
import { UnitTeamRepository } from '../../repositories/unit.team.repository';

/**
 * <p>
 * unitTeam相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 6:31 下午
 */
@Injectable()
export class UnitTeamService {
  constructor(private readonly teamRepo: UnitTeamRepository) { }

  /**
   * 根据teamIds获取对应的名称
   * @param teamIds
   * @return IUnitTeamBaseInfoMap
   * @author Zoe Zheng
   * @date 2020/7/30 5:39 下午
   */
  public async getTeamsByIdsIncludeDeleted(teamIds: number[]): Promise<{ [teamId: string]: IUserValue }> {
    if (teamIds.length > 0) {
      const teams = await this.teamRepo.selectTeamsByIdsIncludeDeleted(teamIds);
      return teams.reduce<{ [teamId: string]: IUserValue }>((pre, cur) => {
        pre[cur.id] = { name: cur.teamName, uuid: '', userId: '', type: MemberType.Team, isDeleted: cur.isDeleted };
        return pre;
      }, {});
    }
    return {};
  }

  async getIdBySpaceIdAndName(spaceId: string, teamName: string): Promise<string | null> {
    const entity = await this.teamRepo.selectIdBySpaceIdAndName(spaceId, teamName);
    if (entity) return entity.id;
    return null;
  }
}
