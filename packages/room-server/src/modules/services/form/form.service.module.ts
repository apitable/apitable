import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtModule } from 'modules/ot/ot.module';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { CommandServiceModule } from 'modules/services/command/command.service.module';
import { DatasheetServiceModule } from '../datasheet/datasheet.service.module';
import { EventServiceModule } from '../event/event.service.module';
import { FusionApiServiceModule } from '../../../fusion/fusion.api.service.module';
import { NodeServiceModule } from '../node/node.service.module';
import { FormService } from './form.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceMetaRepository]),
    NodeServiceModule,
    DatasheetServiceModule,
    CommandServiceModule,
    OtModule,
    FusionApiServiceModule,
    EventServiceModule
  ],
  providers: [FormService],
  exports: [FormService],
})
export class FormServiceModule { }
