import { LoggerOptions } from 'winston';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

export type LoggerModuleOptions = LoggerOptions;

export interface ILoggerModuleOptionsFactory {
  createWinstonModuleOptions(): Promise<LoggerModuleOptions> | LoggerModuleOptions;
}

export interface ILoggerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
  useClass?: Type<ILoggerModuleOptionsFactory>;
}
