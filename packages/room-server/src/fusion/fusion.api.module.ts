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
import { DeveloperServiceModule } from '../_modules/developer.service.module';
import { FusionApiServiceModule } from '../_modules/fusion.api.service.module';
import { NodeServiceModule } from '../_modules/node.service.module';
import { UnitServiceModule } from '../_modules/unit.service.module';
import { FusionApiController } from './fusion.api.controller';
import { SharedModule } from 'shared/shared.module';

/**
 * 数表模块
 * 这是数表所有相关操作的模块
 */
@Module({
  imports: [
  SharedModule,
  FusionApiServiceModule,
  DeveloperServiceModule,
  DatasheetServiceModule,
  UnitServiceModule,
  NodeServiceModule,
  RestModule,
  CacheModule.registerAsync({
    useClass: CacheConfigService,
    }),
  TypeOrmModule.forFeature([UnitMemberRepository, ApiUsageRepository]),
  QueueWorkerModule,
  ],
  controllers: [FusionApiController],
  })
export class FusionApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRequestMiddleware, NodeRateLimiterMiddleware).forRoutes(FusionApiController);
  }
}
