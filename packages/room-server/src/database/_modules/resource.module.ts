import { Module } from '@nestjs/common';
import { NodeServiceModule } from './node.service.module';
import { ResourceServiceModule } from './resource.service.module';
import { UserServiceModule } from './user.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { ResourceController } from '../controllers/resource.controller';
import { OtModule } from './ot.module';

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
