import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from 'database/repositories/datasheet.repository';
import { DeveloperRepository } from 'database/repositories/developer.repository';
import { NodeDescRepository } from 'database/repositories/node.desc.repository';
import { NodeRelRepository } from 'database/repositories/node.rel.repository';
import { NodeRepository } from 'database/repositories/node.repository';
import { NodeShareSettingRepository } from 'database/repositories/node.share.setting.repository';
import { ResourceMetaRepository } from 'database/repositories/resource.meta.repository';
import { UnitMemberRepository } from 'database/repositories/unit.member.repository';
import { UnitRepository } from 'database/repositories/unit.repository';
import { UnitTagRepository } from 'database/repositories/unit.tag.repository';
import { UnitTeamRepository } from 'database/repositories/unit.team.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { DeveloperService } from 'database/services/developer/developer.service';
import { NodeDescriptionService } from 'database/services/node/node.description.service';
import { NodePermissionService } from 'database/services/node/node.permission.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UserService } from 'database/services/user/user.service';
import { QueueWorkerModule } from 'enterprise/queue/queue.worker.module';
import {
  AttachmentField, AutoNumberField, CheckboxField, CreatedByField, CreatedTimeField, CurrencyField, DateTimeField, EmailField, FormulaField,
  LastModifiedByField, LastModifiedTimeField, LinkField, LookUpField, MemberField, MultiSelectField, NumberField, PercentField, PhoneField,
  RatingField, SingleSelectField, SingleTextField, TextField, UrlField,
} from 'fusion/field';
import { CacheConfigService } from 'shared/cache/cache.config.service';
import { ApiRequestMiddleware } from 'shared/middleware/api.request.middleware';
import { NodeRateLimiterMiddleware } from 'shared/middleware/node.rate.limiter.middleware';
import { SharedModule } from 'shared/shared.module';
import { FusionApiController } from './fusion.api.controller';
import { ApiUsageRepository } from './repositories/api.usage.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository]),
    SharedModule,
    // FusionApiServiceModule,
    // DatasheetServiceModule,
    // HttpModule.registerAsync({
    //   useClass: HttpConfigService,
    //   }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    TypeOrmModule.forFeature([UnitMemberRepository, ApiUsageRepository]),
    QueueWorkerModule,
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
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
  ],
  controllers: [FusionApiController],
  providers: [
    UserService,
    DeveloperService,
    UnitService,
    UnitMemberService,
    UnitTagService,
    UnitTeamService,
    NodeService,
    NodePermissionService,
    NodeShareSettingService,
    NodeDescriptionService,
    UnitService,
    UnitMemberService,
    UnitTagService,
    UnitTeamService,
    // field service
    AttachmentField,
    AutoNumberField,
    CheckboxField,
    CreatedByField,
    CreatedTimeField,
    CurrencyField,
    DateTimeField,
    EmailField,
    FormulaField,
    LastModifiedByField,
    LastModifiedTimeField,
    LinkField,
    LookUpField,
    MemberField,
    MultiSelectField,
    NumberField,
    PercentField,
    PhoneField,
    RatingField,
    SingleSelectField,
    SingleTextField,
    TextField,
    UrlField,
  ],
})
export class FusionApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRequestMiddleware, NodeRateLimiterMiddleware).forRoutes(FusionApiController);
  }
}
