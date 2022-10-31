import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService } from 'shared/cache/cache.config.service';
import { ApiRequestMiddleware } from 'shared/middleware/api.request.middleware';
import { NodeRateLimiterMiddleware } from 'shared/middleware/node.rate.limiter.middleware';
import { QueueWorkerModule } from '../_modules/queue.worker.module';
import { ApiUsageRepository } from './repositories/api.usage.repository';
import { UnitMemberRepository } from '../database/repositories/unit.member.repository';
import { RestModule } from '../_modules/rest.module';
import { DatasheetServiceModule } from '../_modules/datasheet.service.module';
import { FusionApiServiceModule } from '../_modules/fusion.api.service.module';
import { NodeServiceModule } from '../_modules/node.service.module';
import { FusionApiController } from './fusion.api.controller';
import { SharedModule } from 'shared/shared.module';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UnitRepository } from 'database/repositories/unit.repository';
import { UnitTagRepository } from 'database/repositories/unit.tag.repository';
import { UnitTeamRepository } from 'database/repositories/unit.team.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { UserServiceModule } from '_modules/user.service.module';
import { DeveloperRepository } from 'database/repositories/developer.repository';
import { DeveloperService } from 'database/services/developer/developer.service';

/**
 * 数表模块
 * 这是数表所有相关操作的模块
 */
@Module({
  imports: [
  TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository]),
  SharedModule,
  FusionApiServiceModule,
  DatasheetServiceModule,
  NodeServiceModule,
  RestModule,
  CacheModule.registerAsync({
    useClass: CacheConfigService,
    }),
  TypeOrmModule.forFeature([UnitMemberRepository, ApiUsageRepository]),
  QueueWorkerModule,
  TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
  UserServiceModule,
  ],
  controllers: [FusionApiController],
  providers: [DeveloperService, UnitService, UnitMemberService, UnitTagService, UnitTeamService],
  })
export class FusionApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRequestMiddleware, NodeRateLimiterMiddleware).forRoutes(FusionApiController);
  }
}
