import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDevMode } from 'app.environment';

/**
 * database configuration service
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
      // don't change the below settings
      // entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      // use utf8mb4 to fix emoji storage issue
      charset: 'utf8mb4',
      // print SQL logs in dev mode only
      logging: isDevMode,
      connectTimeout: 60000,
      supportBigNumbers: true,
      bigNumberStrings: true,
      // don't change synchronize setting
      synchronize: false,
      // connection pool settings
      keepConnectionAlive,
      retryDelay,
      verboseRetryLog: true,
      extra: {
        connectionLimit
      }
    };
  }
}
