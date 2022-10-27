import { Global, Module } from '@nestjs/common';
import { CommandOptionsService } from 'datasheet/services/command/impl/command.options.service';
import { CommandService } from '../services/command/impl/command.service';

/**
 * <p>
 * 对应core层的command
 * </p>
 * @author Zoe zheng
 * @date 2020/8/20 11:23 上午
 */
@Global()
@Module({
  providers: [CommandService, CommandOptionsService],
  exports: [CommandService, CommandOptionsService],
})
export class CommandServiceModule {}
