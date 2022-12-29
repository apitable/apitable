import { DynamicModule, Module } from '@nestjs/common';
import { DatasheetRecordAlarmBaseService } from 'database/services/alarm/datasheet.record.alarm.base.service';
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
    const alarmEnterpriseModulePath = path.join(__dirname, '../../../enterprise/database/alarm');
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
