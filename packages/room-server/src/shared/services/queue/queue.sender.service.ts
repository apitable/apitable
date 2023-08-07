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

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { QueueSenderBaseService } from 'shared/services/queue/queue.sender.base.service';
import { Logger } from 'winston';
import { InjectLogger } from '../../../shared/common';

@Injectable()
export class QueueSenderService extends QueueSenderBaseService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super();
  }

  public override async sendMessage(exchange: string, routingKey: string, message: any) {
    await this.amqpConnection.publish(exchange, routingKey, message);
    this.logger.debug(`Message ${JSON.stringify(message)} has been sent to topic exchange ${exchange}`);
  }

  public override async sendMessageWithId(messageId: string, exchange: string, routingKey: string, message: any) {
    await this.amqpConnection.publish(exchange, routingKey, message, { messageId });
  }
}
