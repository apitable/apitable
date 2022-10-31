import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../database/repositories/datasheet.repository';
import { NodeDescRepository } from '../database/repositories/node.desc.repository';
import { NodeRelRepository } from '../database/repositories/node.rel.repository';
import { NodeRepository } from '../database/repositories/node.repository';
import { NodeShareSettingRepository } from '../database/repositories/node.share.setting.repository';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { NodeService } from 'database/services/node/node.service';
import { RestModule } from './rest.module';
import { UnitServiceModule } from './unit.service.module';
import { UserServiceModule } from './user.service.module';
import { NodeDescriptionService } from '../database/services/node/node.description.service';
import { NodePermissionService } from '../database/services/node/node.permission.service';
import { NodeShareSettingService } from '../database/services/node/node.share.setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      DatasheetRepository,
      ResourceMetaRepository,
    ]),
    UserServiceModule,
    UnitServiceModule,
    RestModule,
  ],
  providers: [NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService],
  exports: [NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService],
})
export class NodeServiceModule {}
