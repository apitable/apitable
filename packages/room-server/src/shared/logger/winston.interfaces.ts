import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { LoggerOptions } from 'winston';

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
