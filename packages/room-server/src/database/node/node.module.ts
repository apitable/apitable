import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeDescRepository } from './repositories/node.desc.repository';
import { NodeRelRepository } from './repositories/node.rel.repository';
import { NodeRepository } from './repositories/node.repository';
import { NodeShareSettingRepository } from './repositories/node.share.setting.repository';
import { NodeDescriptionService } from './services/node.description.service';
import { NodePermissionService } from './services/node.permission.service';
import { NodeService } from './services/node.service';
import { NodeShareSettingService } from './services/node.share.setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
    ]),
  ],
  controllers: [],
  providers: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
  ],
  exports: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
  ]
})
export class NodeModule {}
