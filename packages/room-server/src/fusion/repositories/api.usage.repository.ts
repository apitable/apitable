import { EntityRepository, InsertResult, Repository } from 'typeorm';
import { ApiUsageEntity } from '../entities/api.usage.entity';

@EntityRepository(ApiUsageEntity)
export class ApiUsageRepository extends Repository<ApiUsageEntity> {
  insertByEntity(entity: ApiUsageEntity): Promise<InsertResult> {
    return this.createQueryBuilder()
      .insert()
      .values(entity)
      .updateEntity(false)
      .execute();
  }
}
