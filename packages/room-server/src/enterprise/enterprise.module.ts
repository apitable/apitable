import { DynamicModule, Module } from '@nestjs/common';
import { QueueWorkerModule } from './queue/queue.worker.module';
import { SchedTaskService } from '../shared/services/sched_task/sched.task.service';
import { SharedModule } from 'shared/shared.module';

/**
 * original sched.task.module
 */
@Module({})
export class EnterpriseModule {
  static register(enabled: boolean): DynamicModule {
    const dynamicModule = {
      module: EnterpriseModule,
      imports: [
        SharedModule,
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