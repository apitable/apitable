import { DynamicModule, Module } from '@nestjs/common';
import { QueueWorkerModule } from 'shared/services/queue/queue.worker.module';
import { CommandServiceModule } from '../../../datasheet/_modules/command.service.module';
import { DatasheetServiceModule } from '../../../datasheet/_modules/datasheet.service.module';
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