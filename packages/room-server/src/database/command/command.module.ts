import { Module } from '@nestjs/common';
import { CommandOptionsService } from './services/command.options.service';
import { CommandService } from './services/command.service';

@Module({
  providers: [CommandService, CommandOptionsService],
  exports: [CommandService, CommandOptionsService],
})
export class CommandModule {}
