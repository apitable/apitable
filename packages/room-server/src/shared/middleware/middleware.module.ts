import { Module, ValidationPipe } from '@nestjs/common';
import { ApiAuthGuard } from 'shared/middleware/guard/api.auth.guard';
import { NodePermissionGuard } from 'shared/middleware/guard/node.permission.guard';
import { FieldPipe } from 'shared/middleware/pipe/field.pipe';
import { QueryPipe } from 'shared/middleware/pipe/query.pipe';
import { DatasheetServiceModule } from '../../datasheet/_modules/datasheet.service.module';
import { DeveloperServiceModule } from '../../datasheet/_modules/developer.service.module';
import { NodeServiceModule } from '../../datasheet/_modules/node.service.module';
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
