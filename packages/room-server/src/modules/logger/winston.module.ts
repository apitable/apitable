import { DynamicModule, Global, LoggerService, Module } from '@nestjs/common';
import { ILoggerModuleAsyncOptions, LoggerModuleOptions } from './winston.interfaces';
import { createNestWinstonLogger, createWinstonAsyncProviders, createWinstonProviders } from './winston.providers';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(options: LoggerModuleOptions): DynamicModule {
    const providers = createWinstonProviders(options);

    return {
      module: LoggerModule,
      providers,
      exports: providers,
    };
  }

  public static forRootAsync(options: ILoggerModuleAsyncOptions): DynamicModule {
    const providers = createWinstonAsyncProviders(options);

    return {
      module: LoggerModule,
      imports: options.imports,
      providers,
      exports: providers,
    } as DynamicModule;
  }

  public static createLogger(options: LoggerModuleOptions): LoggerService {
    return createNestWinstonLogger(options);
  }
}
