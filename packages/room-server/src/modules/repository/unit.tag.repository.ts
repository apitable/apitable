import { UnitTagEntity } from 'entities/unit.tag.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * <p>
 * vika_unit_tag数据库相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 4:09 下午
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
