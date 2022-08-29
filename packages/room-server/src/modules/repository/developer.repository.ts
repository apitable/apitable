import { DeveloperEntity } from 'entities/developer.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * <p>
 * vika_developer数据库相关操作
 * </p>
 * @author Zoe zheng
 * @date 2020/7/24 3:15 下午
 */
@EntityRepository(DeveloperEntity)
export class DeveloperRepository extends Repository<DeveloperEntity> {
  /**
   * 根据apiKay查找userId
   * @param apiKey 开发者平台唯一令牌
   * @return user_id
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 下午
   */
  selectUserIdByApiKey(apiKey: string): Promise<{ userId: bigint } | undefined> {
    return this.findOne({ where: [{ apiKey }], select: ['userId'] });
  }
}
