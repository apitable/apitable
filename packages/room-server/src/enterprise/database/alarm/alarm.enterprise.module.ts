import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRecordAlarmRepository } from './repositories/datasheet.record.alarm.repository';
import { DatasheetRecordAlarmBaseService } from 'database/services/alarm/datasheet.record.alarm.base.service';
import { DatasheetRecordAlarmService } from './services/datasheet.record.alarm.service';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
    forwardRef(() => SharedModule),
    TypeOrmModule.forFeature([
      DatasheetRecordAlarmRepository,
    ]),
  ],
  providers: [
    {
      provide: DatasheetRecordAlarmBaseService,
      useClass: DatasheetRecordAlarmService
    },
  ],
  exports: [
    {
      provide: DatasheetRecordAlarmBaseService,
      useClass: DatasheetRecordAlarmService
    }, 
  ]
})
export class AlarmEnterpriseModule { }
