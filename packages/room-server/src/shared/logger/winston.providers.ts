import { Logger, LoggerOptions, createLogger } from 'winston';
import { Provider, Type } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_OPTIONS, WINSTON_MODULE_PROVIDER } from './winston.constants';
import { ILoggerModuleAsyncOptions, LoggerModuleOptions, ILoggerModuleOptionsFactory } from './winston.interfaces';
import { WinstonLogger } from './winston.classes';

export function createNestWinstonLogger(loggerOpts: LoggerModuleOptions): WinstonLogger {
  return new WinstonLogger(createLogger(loggerOpts));
}

export function createWinstonProviders(loggerOpts: LoggerModuleOptions): Provider[] {
  return [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: () => createLogger(loggerOpts),
    },
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useFactory: (logger: Logger) => new WinstonLogger(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ];
}

export function createWinstonAsyncProviders(options: ILoggerModuleAsyncOptions): Provider[] {
  const providers: Provider[] = [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: (loggerOpts: LoggerOptions) => createLogger(loggerOpts),
      inject: [WINSTON_MODULE_OPTIONS],
    },
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useFactory: (logger: Logger) => new WinstonLogger(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ];

  if (options.useClass) {
    const useClass = options.useClass as Type<ILoggerModuleOptionsFactory>;
    providers.push(...[
      {
        provide: WINSTON_MODULE_OPTIONS,
        useFactory: async(optionsFactory: ILoggerModuleOptionsFactory) =>
          await optionsFactory.createWinstonModuleOptions(),
        inject: [useClass],
      },
      {
        provide: useClass,
        useClass,
      },
    ]);
  }

  if (options.useFactory) {
    providers.push(
      {
        provide: WINSTON_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    );
  }

  return providers;
}
