import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtModule } from './ot.module';
import { ApiUsageRepository } from '../fusion/repositories/api.usage.repository';
import { DatasheetRecordRepository } from '../database/repositories/datasheet.record.repository';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { JavaModule } from 'shared/services/java/java.module';
import { ResourceServiceModule } from './resource.service.module';
import { UnitServiceModule } from './unit.service.module';
import { UserServiceModule } from './user.service.module';
import { FusionApiFilter } from '../fusion/filter/fusion.api.filter';
import { FusionApiRecordService } from '../fusion/services/fusion.api.record.service';
import { FusionApiService } from '../fusion/services/fusion.api.service';

@Module({
  imports: [TypeOrmModule.forFeature([DatasheetRecordRepository])],
  providers: [FusionApiRecordService],
  exports: [FusionApiRecordService],
  })
export class FusionApiRecordServiceModule {
}

@Module({
  imports: [
  TypeOrmModule.forFeature([ApiUsageRepository]),
  UnitServiceModule,
  DatasheetServiceModule,
  CommandServiceModule,
  OtModule,
  JavaModule,
  ResourceServiceModule,
  UserServiceModule,
  FusionApiRecordServiceModule,
  ],
  providers: [FusionApiService, FusionApiFilter, FusionApiTransformer],
  exports: [FusionApiService, FusionApiFilter, FusionApiTransformer],
  })
export class FusionApiServiceModule {
}

