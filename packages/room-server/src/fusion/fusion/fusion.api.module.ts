import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheConfigService } from 'cache/cache.config.service';
import { ApiRequestMiddleware } from 'middleware/api.request.middleware';
import { NodeRateLimiterMiddleware } from 'middleware/node.rate.limiter.middleware';
import { QueueWorkerModule } from 'modules/queue/queue.worker.module';
import { ApiUsageRepository } from 'modules/repository/api.usage.repository';
import { UnitMemberRepository } from 'modules/repository/unit.member.repository';
import { RestModule } from 'modules/rest/rest.module';
import { AttachmentModule } from 'modules/services/attachment/attachment.module';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { DeveloperServiceModule } from 'modules/services/developer/developer.service.module';
import { FusionApiServiceModule } from '../fusion.api.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { UnitServiceModule } from 'modules/services/unit/unit.service.module';
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
