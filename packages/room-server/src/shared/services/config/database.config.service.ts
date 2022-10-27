import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDevMode } from 'app.environment';

/**
 * 数据库配置服务
 */
@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, port, username, password, database, connectionLimit, keepConnectionAlive, retryDelay } = {
      host: process.env.MYSQL_HOST || this.configService.get<string>('db.host', 'localhost'),
      port: parseInt(process.env.MYSQL_PORT) || this.configService.get<number>('db.port', 3306),
      username: process.env.MYSQL_USERNAME || this.configService.get<string>('db.username', 'root'),
      password: process.env.MYSQL_PASSWORD || this.configService.get<string>('db.password', 'qwe123456'),
      database: process.env.MYSQL_DATABASE || this.configService.get<string>('db.database', 'vikadata'),
      connectionLimit: this.configService.get<number>('db.connectionLimit', 20),
      keepConnectionAlive: this.configService.get<boolean>('db.keepConnectionAlive', true),
      retryDelay: this.configService.get<number>('db.retryDelay', 300),
    };
    return {
      type: 'mysql',
      host,
      port,
      username,
      password,
      database,
      // 以下不能更改
      // entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // 设置字符编码解决emoji表情存储问题
      charset: 'utf8mb4',
      // 生产环境关闭sql日志打印
      logging: isDevMode,
      connectTimeout: 60000,
      supportBigNumbers: true,
      bigNumberStrings: true,
      // 高危险：请务必不要操作synchronize属性的值变更
      synchronize: false,
      // 链接池配置
      keepConnectionAlive,
      retryDelay,
      verboseRetryLog: true,
      extra: {
        connectionLimit
      }
    };
  }
}
