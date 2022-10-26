import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtModule } from 'modules/ot/ot.module';
import { ApiUsageRepository } from 'modules/repository/api.usage.repository';
import { DatasheetRecordRepository } from 'modules/repository/datasheet.record.repository';
import { CommandServiceModule } from 'modules/services/command/command.service.module';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { JavaModule } from 'modules/services/java/java.module';
import { ResourceServiceModule } from 'modules/services/resource/resource.service.module';
import { UnitServiceModule } from 'modules/services/unit/unit.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { FieldModule } from './field.module';
import { FusionApiFilter } from './filter/fusion.api.filter';
import { FusionApiRecordService } from './impl/fusion.api.record.service';
import { FusionApiService } from './impl/fusion.api.service';

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

