import { IRecordCellValue } from '@apitable/core';
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetRecordEntity)
export class DatasheetRecordRepository extends Repository<DatasheetRecordEntity> {
  selectIdsByDstIdAndRecordIds(dstId: string, recordIds: string[]): Promise<string[] | null> {
    return this.find({
      select: ['recordId'],
      where: [{ dstId, recordId: In(recordIds), isDeleted: false }],
    }).then(entities => {
      return entities.map(entity => entity.recordId);
    });
  }

  selectRecordsDataByDstId(dstId: string): Promise<{ recordId: string; data: IRecordCellValue }[] | undefined> {
    return this.find({
      select: ['recordId', 'data'],
      where: [{ dstId, isDeleted: false }],
    });
  }

  selectRecordsDataByDstIdIgnoreDeleted(dstId: string): Promise<{ recordId: string; data: IRecordCellValue }[] | undefined> {
    return this.find({
      select: ['recordId', 'data'],
      where: [{ dstId }],
    });
  }

  selectRevisionHistoryByDstIdAndRecordId(dstId: string, recordId: string): Promise<{ revisionHistory: string } | undefined> {
    return this.createQueryBuilder('vdr')
      .select('vdr.revision_history', 'revisionHistory')
      .where('vdr.dst_id = :dstId', { dstId })
      .andWhere('vdr.record_id = :recordId', { recordId })
      .andWhere('vdr.is_deleted = 0')
      .getRawOne<{ revisionHistory: string }>();
  }

  selectLinkRecordIdsByRecordIdAndFieldId(dstId: string, recordId: string, fieldId: string) {
    const path = `$.${fieldId}`;
    return this.query(
      `
       SELECT vdr.data->?  as linkRecordIds
       FROM vika_datasheet_record vdr
       WHERE vdr.dst_id = ? AND vdr.record_id = ? AND vdr.is_deleted = 0 limit 1
      `,
      [path, dstId, recordId],
    );
  }
}
