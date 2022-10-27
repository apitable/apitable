import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtModule } from '../database/_modules/ot.module';
import { ApiUsageRepository } from './repositories/api.usage.repository';
import { DatasheetRecordRepository } from '../database/repositories/datasheet.record.repository';
import { CommandServiceModule } from '../database/_modules/command.service.module';
import { DatasheetServiceModule } from '../database/_modules/datasheet.service.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { JavaModule } from 'shared/services/java/java.module';
import { ResourceServiceModule } from '../database/_modules/resource.service.module';
import { UnitServiceModule } from '../database/_modules/unit.service.module';
import { UserServiceModule } from '../database/_modules/user.service.module';
import { FieldModule } from './field.module';
import { FusionApiFilter } from './filter/fusion.api.filter';
import { FusionApiRecordService } from './services/fusion.api.record.service';
import { FusionApiService } from './services/fusion.api.service';

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
    FieldModule,
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

