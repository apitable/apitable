import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DEFAULT_LANGUAGE, I18nJsonParser } from 'shared/adapters/I18n.json.parser';
import { enableScheduler } from 'app.environment';
import { EnvConfigModule } from 'shared/services/config/env.config.module';
import { DatabaseConfigService } from './shared/services/config/database.config.service';
import { LoggerConfigService } from './shared/services/config/logger.config.service';
import { ZipkinConfigService } from './shared/services/config/zipkin.config.service';
import { MiddlewareModule } from 'shared/middleware/middleware.module';
import { LoggerModule } from 'shared/logger/winston.module';
import { QueueWorkerModule } from './_modules/queue.worker.module';
import { SchedTaskModule } from './_modules/sched.task.module';
import { SocketModule } from './_modules/socket.module';
import { SocketModule as SocketModuleNew } from './socket/socket.module';
import { I18nModule } from 'nestjs-i18n';
import { RedisModule, RedisModuleOptions } from '@vikadata/nestjs-redis';
import path, { resolve } from 'path';
import environmentConfig from './shared/services/config/environment.config';
import { ZipkinModule } from './_modules/zipkin.module';
import { ActuatorModule } from 'actuator/actuator.module';
import { FusionApiModule } from 'fusion/fusion.api.module';
import { GrpcController } from 'database/controllers/grpc.controller';
import { FormController } from 'database/controllers/form.controller';
import { MirrorController } from 'database/controllers/mirror.controller';
import { ResourceController } from 'database/controllers/resource.controller';
import { MirrorService } from 'database/services/mirror/mirror.service';
import { FormService } from 'database/services/form/form.service';
import { ResourceServiceModule } from '_modules/resource.service.module';
import { FusionApiServiceModule } from '_modules/fusion.api.service.module';
import { CommandServiceModule } from '_modules/command.service.module';
import { DatasheetServiceModule } from '_modules/datasheet.service.module';
import { ResourceMetaRepository } from 'database/repositories/resource.meta.repository';
import { NodeServiceModule } from '_modules/node.service.module';
import { UserServiceModule } from '_modules/user.service.module';
import { DatabaseModule } from 'database/database.module';
import { RobotModule } from 'automation/robot.module';
import { DashboardController } from 'database/controllers/dashboard.controller';
import { EventService } from 'database/services/event/event.service';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { EntryModule } from 'entry.module';
import { AutomationService } from 'automation/services/automation.service';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'automation/repositories/automation.run.history.repository';
import { AutomationServiceRepository } from 'automation/repositories/automation.service.repository';
import { AutomationActionTypeRepository } from 'automation/repositories/automation.action.type.repository';
import { DashboardService } from 'database/services/dashboard/dashboard.service';
import { RestModule } from '_modules/rest.module';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { OtService } from 'database/services/ot/ot.service';
import { DatasheetOtService } from 'database/services/ot/datasheet.ot.service';
import { DashboardOtService } from 'database/services/ot/dashboard.ot.service';
import { MirrorOtService } from 'database/services/ot/mirror.ot.service';
import { FormOtService } from 'database/services/ot/form.ot.service';
import { WidgetOtService } from 'database/services/ot/widget.ot.service';
import { ResourceChangeHandler } from 'database/services/ot/resource.change.handler';
import { DatasheetWidgetRepository } from 'database/repositories/datasheet.widget.repository';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { WidgetRepository } from 'database/repositories/widget.repository';
import { WidgetService } from 'database/services/widget/widget.service';

// 初始化环境，本地开发为development，部署线上则需要指定NODE_ENV，非开发环境可选值[integration, staging, production]
// 环境已经使用app.environment设置了
// const env = process.env.NODE_ENV || 'development';

@Module({
  imports: [
// 环境配置
  ConfigModule.forRoot({
    envFilePath: resolve(process.cwd(), 'dist/env/.env.defaults'),
    encoding: 'utf-8',
    isGlobal: true,
    expandVariables: true,
    load: [environmentConfig],
    }),
// 数据库配置
  TypeOrmModule.forRootAsync({
    useClass: DatabaseConfigService,
    }),
// Redis配置
  RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
    return redisModuleOptions(configService);
    },
    }),
// 日志配置
  LoggerModule.forRootAsync({
    useClass: LoggerConfigService,
    }),
// Zipkin 配置
  ZipkinModule.forRootAsync({
    useClass: ZipkinConfigService,
    }),
  SocketModule,
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
  SchedTaskModule.register(enableScheduler),
  SocketModuleNew.register(true), // TODO: whether or not use socket-module
  QueueWorkerModule,
  ActuatorModule, FusionApiModule,
  DatabaseModule, RobotModule, NodeServiceModule,
  UserServiceModule, 
  NodeServiceModule, 
  TypeOrmModule.forFeature([ResourceMetaRepository]),
  DatasheetServiceModule,
  CommandServiceModule,
  FusionApiServiceModule,
  ResourceServiceModule,
  UserServiceModule,
  NodeServiceModule,
  DatasheetServiceModule,
  CommandServiceModule,
  TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
  TypeOrmModule.forFeature([
    NodeRepository,
    AutomationTriggerRepository,
    AutomationRobotRepository,
    AutomationRunHistoryRepository,
    AutomationServiceRepository,
    AutomationTriggerTypeRepository,
    AutomationActionTypeRepository
    ]),
  RestModule,

  TypeOrmModule.forFeature([ResourceMetaRepository, DatasheetWidgetRepository]),
  DatasheetServiceModule,
  NodeServiceModule,
  UserServiceModule,
  ResourceServiceModule,
  RestModule,
  GrpcClientModule,
  DatasheetServiceModule,
  CommandServiceModule,
  TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
  TypeOrmModule.forFeature([
    NodeRepository,
    AutomationTriggerRepository,
    AutomationRobotRepository,
    AutomationRunHistoryRepository,
    AutomationServiceRepository,
    AutomationTriggerTypeRepository,
    AutomationActionTypeRepository
    ]),
  TypeOrmModule.forFeature([ResourceMetaRepository]),
  NodeServiceModule,
  RestModule,
  TypeOrmModule.forFeature([
    WidgetRepository,
    ]),

  EntryModule,
  ],
  controllers: [DashboardController, GrpcController, FormController, MirrorController, ResourceController],
  providers: [GrpcSocketService, DashboardService, EventService, FormService, MirrorService, AutomationService, 
  OtService,
  DatasheetOtService,
  DashboardOtService,
  MirrorOtService,
  FormOtService,
  WidgetOtService,
  ResourceChangeHandler,
  MirrorService,
  EventService,
  AutomationService,
  DashboardService,
  WidgetService,
  
  ],
  })
export class AppModule {
}

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
  // 存在配置再配置
  if (password) {
    redisConfig.password = password;
  }
  if (db) {
    redisConfig.db = db;
  }
  return redisConfig;
};
