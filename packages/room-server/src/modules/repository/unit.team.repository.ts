import { UnitTeamEntity } from 'entities/unit.team.entity';
import { EntityRepository, In, Repository } from 'typeorm';

/**
 * <p>
 * vika_unit_team数据库相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 4:09 下午
 */
@EntityRepository(UnitTeamEntity)
export class UnitTeamRepository extends Repository<UnitTeamEntity> {
  selectTeamsByIdsIncludeDeleted(teamIds: number[]): Promise<UnitTeamEntity[]> {
    return this.find({ select: ['id', 'teamName', 'groupId'], where: { id: In(teamIds) }});
  }

  selectIdBySpaceIdAndName(spaceId: string, teamName: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { teamName, spaceId, isDeleted: false }});
  }

  selectCountBySpaceIdAndId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }
}
