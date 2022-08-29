import { DynamicModule, Module } from '@nestjs/common';
import { QueueWorkerModule } from 'modules/queue/queue.worker.module';
import { CommandServiceModule } from 'modules/services/command/command.service.module';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { SchedTaskService } from './sched.task.service';

@Module({})
export class SchedTaskModule {
  static register(enabled: boolean): DynamicModule {
    const dynamicModule = {
      module: SchedTaskModule,
      imports: [
        CommandServiceModule,
        DatasheetServiceModule,
        QueueWorkerModule,
      ],
      providers: []
    };

    if (!enabled) {
      return dynamicModule;
    }

    return {
      ... dynamicModule,
      providers: [SchedTaskService],
    };
  }
}