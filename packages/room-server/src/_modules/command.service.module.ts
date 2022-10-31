import { Global, Module } from '@nestjs/common';
import { CommandOptionsService } from 'database/services/command/impl/command.options.service';
import { CommandService } from '../database/services/command/impl/command.service';

/**
 * @author Zoe zheng
 * @date 2020/8/20 11:23 AM
 */
@Global()
@Module({
  providers: [CommandService, CommandOptionsService],
  exports: [CommandService, CommandOptionsService],
})
export class CommandServiceModule {}
