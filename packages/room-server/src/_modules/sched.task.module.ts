import { DynamicModule, Module } from '@nestjs/common';
import { QueueWorkerModule } from './queue.worker.module';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { SchedTaskService } from '../shared/services/sched_task/sched.task.service';

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