/**
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.interfaces';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { enableQueueWorker } from 'app.environment';
import { QueueSenderBaseService } from 'shared/services/queue/queue.sender.base.service';
import { QueueSenderService } from 'shared/services/queue/queue.sender.service';

export const notificationQueueExchangeName = 'apitable.notification.exchange';
export const automationExchangeName = 'apitable.automation.exchange';
export const automationRunning = 'automation.running';
export const automationRunningQueueName = 'apitable.automation.running';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RabbitMQConfig => {
        const uri = process.env.RABBITMQ_HOST
          ? `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
          : process.env.QUEUE_URI;
        const vhost = process.env.RABBITMQ_VHOST || configService.get<string>('queue.vhost', '');
        return {
          uri: `${uri}/${vhost}`,
          exchanges: [
            {
              name: notificationQueueExchangeName,
              type: 'topic',
            },
            {
              name: automationExchangeName,
              type: 'direct',
            },
          ],
          connectionInitOptions: { wait: false },
          registerHandlers: enableQueueWorker,
          enableDirectReplyTo: false,
          prefetchCount: 1,
        };
      },
    }),
  ],
  providers: [
    {
      provide: QueueSenderBaseService,
      useClass: QueueSenderService,
    },
  ],
  exports: [
    {
      provide: QueueSenderBaseService,
      useClass: QueueSenderService,
    },
  ],
})
export class QueueModule {}
