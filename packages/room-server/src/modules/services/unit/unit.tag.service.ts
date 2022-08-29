import { Injectable } from '@nestjs/common';
import { UnitTagRepository } from 'modules/repository/unit.tag.repository';

/**
 * <p>
 * unitTag相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/30 6:32 下午
 */
@Injectable()
export class UnitTagService {
  constructor(private readonly unitTagRepo: UnitTagRepository) {}

  async getIdBySpaceIdAndName(spaceId: string, tagName: string): Promise<string | null> {
    const rawData = await this.unitTagRepo.selectIdBySpaceIdAndName(spaceId, tagName);
    if (rawData) return rawData.id;
    return null;
  }

  getCountBySpaceIdAndId(id: string, spaceId: string): Promise<number> {
    return this.unitTagRepo.selectCountByIdAndSpaceId(id, spaceId);
  }
}
