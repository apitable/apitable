import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperRepository } from 'database/repositories/developer.repository';
import { UnitMemberRepository } from 'database/repositories/unit.member.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { DeveloperService } from 'database/services/developer/developer.service';
import { ApiAuthGuard } from 'shared/middleware/guard/api.auth.guard';
import { NodePermissionGuard } from 'shared/middleware/guard/node.permission.guard';
import { FieldPipe } from 'shared/middleware/pipe/field.pipe';
import { QueryPipe } from 'shared/middleware/pipe/query.pipe';
import { DatasheetServiceModule } from '../../_modules/datasheet.service.module';
import { NodeServiceModule } from '../../_modules/node.service.module';
import { ApiRequestMiddleware } from './api.request.middleware';
import { NodeRateLimiterMiddleware } from './node.rate.limiter.middleware';
import { ResourceDataInterceptor } from './resource.data.interceptor';

/**
 * <p>
 * 中间件模块，包括pipe/middleware/guard
 * </p>
 * @author Zoe zheng
 * @date 2020/7/24 4:39 PM
 */
@Module({
  imports: [DatasheetServiceModule, NodeServiceModule,
  TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository]),
  ],
  providers: [
  DeveloperService,
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
