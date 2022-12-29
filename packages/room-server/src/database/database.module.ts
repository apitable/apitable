import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'shared/shared.module';
// import { UserServiceModule } from '../_modules/user.service.module';
import { AttachmentController } from './controllers/attachment.controller';
import { DatasheetController } from './controllers/datasheet.controller';
import { DatasheetRepository } from './repositories/datasheet.repository';
import { NodeDescRepository } from './repositories/node.desc.repository';
import { NodeRelRepository } from './repositories/node.rel.repository';
import { NodeRepository } from './repositories/node.repository';
import { NodeShareSettingRepository } from './repositories/node.share.setting.repository';
import { ResourceMetaRepository } from './repositories/resource.meta.repository';
import { UnitMemberRepository } from './repositories/unit.member.repository';
import { UnitRepository } from './repositories/unit.repository';
import { UnitTagRepository } from './repositories/unit.tag.repository';
import { UnitTeamRepository } from './repositories/unit.team.repository';
import { UserRepository } from './repositories/user.repository';
import { AlarmDynamicModule } from './services/alarm/alarm.dynamic.module';
import { NodeDescriptionService } from './services/node/node.description.service';
import { NodePermissionService } from './services/node/node.permission.service';
import { NodeService } from './services/node/node.service';
import { NodeShareSettingService } from './services/node/node.share.setting.service';
import { UnitMemberService } from './services/unit/unit.member.service';
import { UnitService } from './services/unit/unit.service';
import { UnitTagService } from './services/unit/unit.tag.service';
import { UnitTeamService } from './services/unit/unit.team.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    SharedModule,
    AlarmDynamicModule.forRoot(),
    // DatasheetServiceModule,
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      DatasheetRepository,
      ResourceMetaRepository,
    ]),
    // HttpModule.registerAsync({
    //   useClass: HttpConfigService,
    //   }),
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
  ],
  providers: [
    UserService,
    NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService, 
    UnitService, UnitMemberService, UnitTagService, UnitTeamService
  ],
  controllers: [DatasheetController, AttachmentController],
  exports: [AlarmDynamicModule.forRoot()]
})
export class DatabaseModule {}
