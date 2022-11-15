import { DatasheetRecordAlarmEntity } from '../../../../database/entities/datasheet.record.alarm.entity';
import { RecordAlarmStatus } from 'shared/enums/record.alarm.enum';
import { isEmpty } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DatasheetRecordAlarmEntity)
export class DatasheetRecordAlarmRepository extends Repository<DatasheetRecordAlarmEntity> {
  
  async selectRecordAlarmByStatusAndTimeRange(
    status: RecordAlarmStatus,
    startTime: Date,
    endTime: Date
  ): Promise<DatasheetRecordAlarmEntity[] | null> {
    return await this.createQueryBuilder('alarm')
      .where('alarm.status = :status', { status: status })
      .andWhere('alarm.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('alarm.alarmAt <= :endTime', { endTime: endTime })
      .andWhere('alarm.alarmAt > :startTime', { startTime: startTime })
      .getMany();
  }

  async selectRecordAlarmByRecordIdsAndFieldIds(
    dstId: string,
    recordIds: string[],
    fieldIds: string[]
  ): Promise<DatasheetRecordAlarmEntity[]> {
    return await this.createQueryBuilder('alarm')
      .where('alarm.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('alarm.dstId = :dstId', { dstId: dstId })
      .andWhere('alarm.recordId IN(:...recordIds)', { recordIds: recordIds })
      .andWhere('alarm.fieldId IN(:...fieldIds)', { fieldIds: fieldIds })
      .getMany();
  }

  async updateRecordAlarmStatusByIds(alarmIds: string[], status: RecordAlarmStatus) {
    if (isEmpty(alarmIds)) return;

    await this.createQueryBuilder()
      .update(DatasheetRecordAlarmEntity)
      .set({ status: status })
      .where('alarmId IN(:...ids)', { ids: alarmIds })
      .andWhere('isDeleted = :isDeleted', { isDeleted: false })
      .execute();
  }

  async batchCreateRecordAlarms(alarms: DatasheetRecordAlarmEntity[]) {
    if (isEmpty(alarms)) return;

    await this.createQueryBuilder()
      .insert()
      .into(DatasheetRecordAlarmEntity)
      .values(alarms)
      .updateEntity(false)
      .execute();
  }

  async deleteRecordAlarmsByIds(alarmIds: string[], deletedBy: string) {
    if (isEmpty(alarmIds)) return;

    await this.createQueryBuilder()
      .update(DatasheetRecordAlarmEntity)
      .set({ isDeleted: true, updatedBy: deletedBy })
      .where('isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('alarmId IN (:alarmIds)', { alarmIds: alarmIds })
      .execute();
  }
}
