import { Injectable } from '@nestjs/common';
import { RecordAlarmStatus } from 'shared/enums/record.alarm.enum';
import { DatasheetRecordAlarmEntity } from 'database/entities/datasheet.record.alarm.entity';
import { EntityManager } from 'typeorm';
import { ICommonData } from '../ot/ot.interface';

@Injectable()
export abstract class DatasheetRecordAlarmBaseService {

  public async getCurrentActivatedRecordAlarms(intervalSecond: number): Promise<DatasheetRecordAlarmEntity[] | null> {
    return await Promise.resolve([]);
  }

  public async batchUpdateStatusOfRecordAlarms(alarmIds: string[], status: RecordAlarmStatus) {
    await Promise.resolve();
  }

  async handleRecordAlarms(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any },
  ) {
    await Promise.resolve();
  }

}
