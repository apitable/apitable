import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { UnitModule } from 'database/unit/unit.module';
import { UserModule } from 'database/user/user.module';
import { NodeDescRepository } from './repositories/node.desc.repository';
import { NodeRelRepository } from './repositories/node.rel.repository';
import { NodeRepository } from './repositories/node.repository';
import { NodeShareSettingRepository } from './repositories/node.share.setting.repository';
import { NodeDescriptionService } from './services/node.description.service';
import { NodePermissionService } from './services/node.permission.service';
import { NodeService } from './services/node.service';
import { NodeShareSettingService } from './services/node.share.setting.service';
import { IsNodeExistConstraint } from './validations/validation.constraint';

@Module({
  imports: [
    UserModule,
    UnitModule,
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetRepository,
      ResourceMetaRepository,
    ]),
  ],
  controllers: [],
  providers: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    IsNodeExistConstraint,
  ],
  exports: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    IsNodeExistConstraint,
  ]
})
export class NodeModule {}
