import { Injectable } from '@nestjs/common';
import { DatasheetRecordSourceEntity } from '../../entities/datasheet.record.source.entity';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IdWorker } from '../../../shared/helpers';
import { DatasheetRecordSourceRepository } from '../../repositories/datasheet.record.source.repository';

@Injectable()
export class DatasheetRecordSourceService {
  constructor(private repository: DatasheetRecordSourceRepository) {}

  async createRecordSource(userId: string, dstId: string, sourceId: string, recordIds: string[], type: SourceTypeEnum) {
    const entities: any[] = [];
    for (const recordId of recordIds) {
      entities.push({
        id: IdWorker.nextId().toString(),
        dstId,
        sourceId,
        recordId,
        type,
        createdBy: userId?.length ? userId : null,
      });
    }
    await this.repository.createQueryBuilder()
      .insert()
      .into(DatasheetRecordSourceEntity)
      .values(entities)
      // If not set to false, SELECT will be executed after insertion, efficiency is impacted
      .updateEntity(false)
      .execute();
  }

  async fetchRecordSourceStatus(userId: string, dstId: string, sourceId: string, type: number) {
    return await this.repository.findOne({ where: [{ dstId, createdBy: userId, sourceId, type }] });
  }
}
