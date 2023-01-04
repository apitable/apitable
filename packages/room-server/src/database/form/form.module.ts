import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from 'database/command/command.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { EventModule } from 'database/event/event.module';
import { NodeModule } from 'database/node/node.module';
import { OtModule } from 'database/ot/ot.module';
import { ResourceModule } from 'database/resource/resource.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';

@Module({
  imports: [ResourceModule, CommandModule, NodeModule, EventModule, DatasheetModule, 
    forwardRef(()=>OtModule)],
  controllers: [FormController],
  providers: [FormService, FusionApiTransformer],
})
export class FormModule {}
