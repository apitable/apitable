import { DynamicModule, Module } from '@nestjs/common';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [SharedModule],
  })
export class SocketModule {static register(enabled: boolean): DynamicModule {
  const dynamicModule = {
    module: SocketModule,
    imports: [
    ],
    providers: []
  };

  if (!enabled) {
    return dynamicModule;
  }

  return {
    ... dynamicModule,
    providers: [], // add provider
  };
}}
