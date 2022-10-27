import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtModule } from './ot.module';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { EventServiceModule } from './event.service.module';
import { FusionApiServiceModule } from '../../fusion/fusion.api.service.module';
import { NodeServiceModule } from './node.service.module';
import { FormService } from '../services/form/form.service';

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
