import { Module } from '@nestjs/common';

export * as dingtalk from './dingtalk';
export * as lark from './lark';
export * as webhook from './webhook';
export * as wecom from './wecom';
export * as ruliu from './ruliu';

@Module({
  imports: [],
})
export class AutomationActionModule {}