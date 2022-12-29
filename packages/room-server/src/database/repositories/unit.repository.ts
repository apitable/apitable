import { EntityRepository, In, Not, Repository } from 'typeorm';
import { UnitTypeEnum } from '../../shared/enums';
import { UnitEntity } from '../entities/unit.entity';

/**
 * Operations on table `unit`
 * 
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitEntity)
export class UnitRepository extends Repository<UnitEntity> {
  selectUnitMembersByIdsIncludeDeleted(unitIds: string[]): Promise<UnitEntity[]> {
    return this.find({ select: ['id', 'unitType', 'unitRefId'], where: { id: In(unitIds), unitType: Not(UnitTypeEnum.TAG) }});
  }

  selectCountByIdAndSpaceId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }

  selectIdByRefIdAndSpaceId(refId: string, spaceId: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { unitRefId: refId, spaceId, isDeleted: false }});
  }
}
