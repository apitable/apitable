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
import { ControllerModule } from './shared/controller.module';
import { MiddlewareModule } from 'shared/middleware/middleware.module';
import { LoggerModule } from 'shared/logger/winston.module';
import { QueueWorkerModule } from 'shared/services/queue/queue.worker.module';
import { SchedTaskModule } from 'shared/services/sched_task/sched.task.module';
import { SocketModule } from 'shared/services/socket/socket.module';
import { I18nModule } from 'nestjs-i18n';
import { RedisModule, RedisModuleOptions } from '@vikadata/nestjs-redis';
import path, { resolve } from 'path';
import environmentConfig from './shared/services/config/environment.config';
import { ZipkinModule } from './shared/services/zipkin/zipkin.module';

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
    ControllerModule,
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
    QueueWorkerModule,

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
