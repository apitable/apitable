import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from 'modules/repository/datasheet.repository';
import { NodeDescRepository } from 'modules/repository/node.desc.repository';
import { NodeRelRepository } from 'modules/repository/node.rel.repository';
import { NodeRepository } from 'modules/repository/node.repository';
import { NodeShareSettingRepository } from 'modules/repository/node.share.setting.repository';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { NodeService } from 'modules/services/node/node.service';
import { RestModule } from '../../rest/rest.module';
import { UnitServiceModule } from '../unit/unit.service.module';
import { UserServiceModule } from '../user/user.service.module';
import { NodeDescriptionService } from './node.description.service';
import { NodePermissionService } from './node.permission.service';
import { NodeShareSettingService } from './node.share.setting.service';

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
