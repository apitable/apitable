import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService } from 'shared/cache/cache.config.service';
import { ApiRequestMiddleware } from 'shared/middleware/api.request.middleware';
import { NodeRateLimiterMiddleware } from 'shared/middleware/node.rate.limiter.middleware';
import { QueueWorkerModule } from 'shared/services/queue/queue.worker.module';
import { ApiUsageRepository } from './repositories/api.usage.repository';
import { UnitMemberRepository } from '../database/repositories/unit.member.repository';
import { RestModule } from 'shared/services/rest/rest.module';
import { AttachmentModule } from '../database/_modules/attachment.module';
import { DatasheetServiceModule } from '../database/_modules/datasheet.service.module';
import { DeveloperServiceModule } from '../database/_modules/developer.service.module';
import { FusionApiServiceModule } from './fusion.api.service.module';
import { NodeServiceModule } from '../database/_modules/node.service.module';
import { UnitServiceModule } from '../database/_modules/unit.service.module';
import { FusionApiController } from './fusion.api.controller';

/**
 * 数表模块
 * 这是数表所有相关操作的模块
 */
@Module({
  imports: [
    FusionApiServiceModule,
    DeveloperServiceModule,
    DatasheetServiceModule,
    UnitServiceModule,
    AttachmentModule,
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
