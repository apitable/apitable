import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { enableQueueWorker } from 'app.environment';
import { QueueSenderService } from '../shared/services/queue/queue.sender.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = process.env.RABBITMQ_HOST ? 
          `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
          : configService.get<string>('queue.uri');
        const vhost = process.env.RABBITMQ_VHOST || configService.get<string>('queue.vhost', '');
        return {
          uri: `${uri}/${vhost}`,
          exchanges: [
            {
              name: 'vikadata.api.notification.exchange',
              type: 'topic',
            },
          ],
          connectionInitOptions: { wait: false },
          registerHandlers: enableQueueWorker,
          enableDirectReplyTo: false,
        };
      },
    }),
    QueueWorkerModule,
  ],
  providers: [QueueSenderService],
  exports: [QueueSenderService],
})
export class QueueWorkerModule { }
