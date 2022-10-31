import { Module, ValidationPipe } from '@nestjs/common';
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
import { ApiAuthGuard } from 'shared/middleware/guard/api.auth.guard';
import { NodePermissionGuard } from 'shared/middleware/guard/node.permission.guard';
import { FieldPipe } from 'shared/middleware/pipe/field.pipe';
import { QueryPipe } from 'shared/middleware/pipe/query.pipe';
// import { DatasheetServiceModule } from '../../_modules/datasheet.service.module';
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
  imports: [
  TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository]),
  TypeOrmModule.forFeature([
    NodeRepository,
    NodeRelRepository,
    NodeDescRepository,
    NodeShareSettingRepository,
    DatasheetRepository,
    ResourceMetaRepository,
    ]),
  TypeOrmModule.forFeature([UserRepository]),
  // HttpModule.registerAsync({
  //   useClass: HttpConfigService,
  //   }),
  TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
  ],
  providers: [
  UserService,
  DeveloperService,
  ApiRequestMiddleware,
  NodeRateLimiterMiddleware,
  ResourceDataInterceptor,
  NodePermissionGuard,
  QueryPipe,
  FieldPipe,
  ValidationPipe,
  ApiAuthGuard,
  NodeService, NodePermissionService, NodeShareSettingService, NodeDescriptionService, 
  
  UnitService, UnitMemberService, UnitTagService, UnitTeamService 
  ],
  })
export class MiddlewareModule {}
