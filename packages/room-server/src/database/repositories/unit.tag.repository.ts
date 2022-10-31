import { UnitTagEntity } from '../entities/unit.tag.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * Operations on table `vika_unit_tag`
 * 
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitTagEntity)
export class UnitTagRepository extends Repository<UnitTagEntity> {
  selectIdBySpaceIdAndName(spaceId: string, tagName: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { tagName, spaceId }});
  }

  selectCountByIdAndSpaceId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }
}
