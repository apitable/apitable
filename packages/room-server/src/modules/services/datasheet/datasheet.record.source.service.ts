import { Injectable } from '@nestjs/common';
import { DatasheetRecordSourceEntity } from 'entities/datasheet.record.source.entity';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { IdWorker } from 'helpers';
import { DatasheetRecordSourceRepository } from 'modules/repository/datasheet.record.source.repository';

/**
 * Datasheet Record Source 服务
 *
 * @export
 * @class DatasheetRecordService
 */
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
      // 如果不设置为false，插入完成后会执行select语句，严重影响性能
      .updateEntity(false)
      .execute();
  }

  async fetchRecordSourceStatus(userId: string, dstId: string, sourceId: string, type: number) {
    return await this.repository.findOne({ where: [{ dstId, createdBy: userId, sourceId, type }] });
  }
}
