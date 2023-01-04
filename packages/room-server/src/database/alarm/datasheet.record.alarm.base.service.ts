/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable } from '@nestjs/common';
import { RecordAlarmStatus } from 'shared/enums/record.alarm.enum';
import { DatasheetRecordAlarmEntity } from './entities/datasheet.record.alarm.entity';
import { EntityManager } from 'typeorm';
import { ICommonData } from '../ot/interfaces/ot.interface';

@Injectable()
export abstract class DatasheetRecordAlarmBaseService {

  public async getCurrentActivatedRecordAlarms(_intervalSecond: number): Promise<DatasheetRecordAlarmEntity[] | null> {
    return await Promise.resolve([]);
  }

  public async batchUpdateStatusOfRecordAlarms(_alarmIds: string[], _status: RecordAlarmStatus) {
    await Promise.resolve();
  }

  async handleRecordAlarms(
    _manager: EntityManager,
    _commonData: ICommonData,
    _resultSet: { [key: string]: any },
  ) {
    await Promise.resolve();
  }

}
