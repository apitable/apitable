import { DeveloperEntity } from '../entities/developer.entity';
import { EntityRepository, Repository } from 'typeorm';

/**
 * Operations on table `developer`
 * 
 * @author Zoe zheng
 * @date 2020/7/24 3:15 PM
 */
@EntityRepository(DeveloperEntity)
export class DeveloperRepository extends Repository<DeveloperEntity> {
  /**
   * Find the user ID with the given API key
   * 
   * @author Zoe Zheng
   * @date 2020/7/24 3:18 PM
   */
  selectUserIdByApiKey(apiKey: string): Promise<{ userId: bigint } | undefined> {
    return this.findOne({ where: [{ apiKey }], select: ['userId'] });
  }
}
