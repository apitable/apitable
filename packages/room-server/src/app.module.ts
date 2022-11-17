import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule, RedisModuleOptions } from '@apitable/nestjs-redis';
import { ActuatorModule } from 'actuator/actuator.module';
import { enableScheduler } from 'app.environment';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { RobotModule } from 'automation/robot.module';
import { AutomationService } from 'automation/services/automation.service';
import { DashboardController } from 'database/controllers/dashboard.controller';
import { FormController } from 'database/controllers/form.controller';
import { GrpcController } from 'database/controllers/grpc.controller';
import { MirrorController } from 'database/controllers/mirror.controller';
import { ResourceController } from 'database/controllers/resource.controller';
import { DatabaseModule } from 'database/database.module';
import { DatasheetRepository } from 'database/repositories/datasheet.repository';
import { DatasheetWidgetRepository } from 'database/repositories/datasheet.widget.repository';
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
import { WidgetRepository } from 'database/repositories/widget.repository';
import { DashboardService } from 'database/services/dashboard/dashboard.service';
import { EventService } from 'database/services/event/event.service';
import { FormService } from 'database/services/form/form.service';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { NodeDescriptionService } from 'database/services/node/node.description.service';
import { NodePermissionService } from 'database/services/node/node.permission.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { DashboardOtService } from 'database/services/ot/dashboard.ot.service';
import { DatasheetOtService } from 'database/services/ot/datasheet.ot.service';
import { FormOtService } from 'database/services/ot/form.ot.service';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { OtService } from 'database/services/ot/ot.service';
import { ResourceChangeHandler } from 'database/services/ot/resource.change.handler';
import { WidgetOtService } from 'database/services/ot/widget.ot.service';
import { UnitMemberService } from 'database/services/unit/unit.member.service';
import { UnitService } from 'database/services/unit/unit.service';
import { UnitTagService } from 'database/services/unit/unit.tag.service';
import { UnitTeamService } from 'database/services/unit/unit.team.service';
import { UserService } from 'database/services/user/user.service';
import { WidgetService } from 'database/services/widget/widget.service';
import { EnterpriseModule } from 'enterprise/enterprise.module';
import { QueueWorkerModule } from 'enterprise/queue/queue.worker.module';
import { EntryModule } from 'entry.module';
import { FusionApiModule } from 'fusion/fusion.api.module';
import { GrpcClientModule } from 'grpc/client/grpc.client.module';
import { I18nModule } from 'nestjs-i18n';
import path, { resolve } from 'path';
import { DEFAULT_LANGUAGE, I18nJsonParser } from 'shared/adapters/I18n.json.parser';
import { MiddlewareModule } from 'shared/middleware/middleware.module';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { EnvConfigModule } from 'shared/services/config/env.config.module';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { SharedModule } from 'shared/shared.module';
import { SocketModule } from 'socket/socket.module';
import environmentConfig from './shared/services/config/environment.config';

@Module({
  imports: [
    SharedModule,
    // environment configuration
    ConfigModule.forRoot({
      envFilePath: resolve(process.cwd(), 'dist/env/.env.defaults'),
      encoding: 'utf-8',
      isGlobal: true,
      expandVariables: true,
      load: [environmentConfig],
    }),
    // database configuration
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    // Redis configuration
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return redisModuleOptions(configService);
      },
    }),
    MiddlewareModule,
    EnvConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      parser: I18nJsonParser as any,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
    ScheduleModule.forRoot(),
    EnterpriseModule.register(enableScheduler),
    SocketModule.register(true), // TODO: whether or not use socket-module
    QueueWorkerModule,
    ActuatorModule,
    FusionApiModule,
    DatabaseModule,
    RobotModule,
    TypeOrmModule.forFeature([ResourceMetaRepository]),
    // FusionApiServiceModule,
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
    TypeOrmModule.forFeature([
      NodeRepository,
      AutomationTriggerRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
      AutomationServiceRepository,
      AutomationTriggerTypeRepository,
      AutomationActionTypeRepository,
    ]),
    TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
    GrpcClientModule,
    // DatasheetServiceModule,
    TypeOrmModule.forFeature([WidgetRepository]),
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
    EntryModule,
  ],
  controllers: [DashboardController, GrpcController, FormController, MirrorController, ResourceController],
  providers: [
    GrpcSocketService,
    DashboardService,
    EventService,
    FormService,
    MirrorService,
    AutomationService,
    OtService,
    UserService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
    WidgetService,
    NodeService,
    NodePermissionService,
    NodeShareSettingService,
    NodeDescriptionService,
    UnitService,
    UnitMemberService,
    UnitTagService,
    UnitTeamService,
  ],
})
export class AppModule {}

const redisModuleOptions = (configService: ConfigService) => {
  const { host, port, password, db } = {
    host: process.env.REDIS_HOST || configService.get<string>('redis.host', 'localhost'),
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : configService.get<number>('redis.port', 6379),
    db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : configService.get<number>('redis.db', 0),
    password: process.env.REDIS_PASSWORD || configService.get<string>('redis.password'),
  };
  const redisConfig: RedisModuleOptions = {
    host,
    port,
  };
  // use config values if there is a configuration
  if (password) {
    redisConfig.password = password;
  }
  if (db) {
    redisConfig.db = db;
  }
  return redisConfig;
};
