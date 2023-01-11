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

import { DynamicModule, Module } from '@nestjs/common';
import { DatasheetRecordAlarmBaseService } from 'database/alarm/datasheet.record.alarm.base.service';
import path from 'path';
import * as fs from 'fs';

@Module({
  providers: [
    {
      provide: DatasheetRecordAlarmBaseService,
      useClass: class AlarmService extends DatasheetRecordAlarmBaseService {}
    },
  ],
  exports: [
    {
      provide: DatasheetRecordAlarmBaseService,
      useClass: class AlarmService extends DatasheetRecordAlarmBaseService {}
    },
  ]
})
export class AlarmDynamicModule { 
  static forRoot(): DynamicModule {
    const alarmEnterpriseModulePath = path.join(__dirname, '../../enterprise/database/alarm');
    const isEnterpriseLevel: boolean = fs.existsSync(alarmEnterpriseModulePath);
    if (isEnterpriseLevel) {
      const { AlarmEnterpriseModule } = require(`${alarmEnterpriseModulePath}/alarm.enterprise.module`);
      return {
        module: AlarmEnterpriseModule,
      };
    }
    return { 
      module: AlarmDynamicModule,
    }; 

  }
}
