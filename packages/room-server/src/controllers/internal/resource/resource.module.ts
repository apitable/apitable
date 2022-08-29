import { Module } from '@nestjs/common';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { ResourceServiceModule } from 'modules/services/resource/resource.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { ResourceController } from './resource.controller';
import { OtModule } from 'modules/ot/ot.module';

@Module({
  imports: [
    UserServiceModule,
    ResourceServiceModule,
    NodeServiceModule,
    DatasheetServiceModule,
    OtModule
  ],
  controllers: [ResourceController],
})
export class ResourceModule {}
