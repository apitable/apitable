import { DatasheetRecordSubscriptionEntity } from 'entities/datasheet.record.subscription.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetRecordSubscriptionEntity)
export class DatasheetRecordSubscriptionRepository extends Repository<DatasheetRecordSubscriptionEntity> {

  async selectRecordIdsByDstIdAndUserId(dstId: string, userId: string): Promise<string[]> {
    const entities = await this.find({
      select: ['recordId'],
      where: [{ dstId, createdBy: userId, isDeleted: false }],
    });
    return entities.map(entity => entity.recordId);
  }

  async selectByDstIdAndRecordId(dstId: string, recordId: string): Promise<DatasheetRecordSubscriptionEntity[]> {
    return await this.find({ dstId, recordId: recordId, isDeleted: false });
  }

  async selectByDstIdAndRecordIds(dstId: string, recordIds: string[]): Promise<DatasheetRecordSubscriptionEntity[]> {
    return await this.find({ dstId, recordId: In(recordIds), isDeleted: false });
  }

}
