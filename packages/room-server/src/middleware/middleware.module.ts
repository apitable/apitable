import { Module, ValidationPipe } from '@nestjs/common';
import { ApiAuthGuard } from 'middleware/guard/api.auth.guard';
import { NodePermissionGuard } from 'middleware/guard/node.permission.guard';
import { FieldPipe } from 'middleware/pipe/field.pipe';
import { QueryPipe } from 'middleware/pipe/query.pipe';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { DeveloperServiceModule } from 'modules/services/developer/developer.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { ApiRequestMiddleware } from './api.request.middleware';
import { NodeRateLimiterMiddleware } from './node.rate.limiter.middleware';
import { ResourceDataInterceptor } from './resource.data.interceptor';

/**
 * <p>
 * 中间件模块，包括pipe/middleware/guard
 * </p>
 * @author Zoe zheng
 * @date 2020/7/24 4:39 下午
 */
@Module({
  imports: [DeveloperServiceModule, DatasheetServiceModule, NodeServiceModule],
  providers: [
    ApiRequestMiddleware,
    NodeRateLimiterMiddleware,
    ResourceDataInterceptor,
    NodePermissionGuard,
    QueryPipe,
    FieldPipe,
    ValidationPipe,
    ApiAuthGuard,
  ],
})
export class MiddlewareModule {}
