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
import { UserServiceModule } from './user.service.module';
import { NodeDescriptionService } from '../database/services/node/node.description.service';
import { NodePermissionService } from '../database/services/node/node.permission.service';
import { NodeShareSettingService } from '../database/services/node/node.share.setting.service';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UnitRepository } from 'database/repositories/unit.repository';
import { UnitMemberRepository } from 'database/repositories/unit.member.repository';
import { UnitTagRepository } from 'database/repositories/unit.tag.repository';
import { UnitTeamRepository } from 'database/repositories/unit.team.repository';
import { UserRepository } from 'database/repositories/user.repository';

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
  RestModule,
  TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
  UserServiceModule,
  ],
  providers: [NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService, 
  
  UnitService, UnitMemberService, UnitTagService, UnitTeamService
  ],
  exports: [NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService],
  })
export class NodeServiceModule {}
