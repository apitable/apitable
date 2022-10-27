import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../repositories/datasheet.repository';
import { NodeDescRepository } from '../repositories/node.desc.repository';
import { NodeRelRepository } from '../repositories/node.rel.repository';
import { NodeRepository } from '../repositories/node.repository';
import { NodeShareSettingRepository } from '../repositories/node.share.setting.repository';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';
import { NodeService } from 'datasheet/services/node/node.service';
import { RestModule } from '../../shared/services/rest/rest.module';
import { UnitServiceModule } from './unit.service.module';
import { UserServiceModule } from './user.service.module';
import { NodeDescriptionService } from '../services/node/node.description.service';
import { NodePermissionService } from '../services/node/node.permission.service';
import { NodeShareSettingService } from '../services/node/node.share.setting.service';

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
