import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from '../../common';
import { Logger } from 'winston';

@Injectable()
export class QueueSenderService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly amqpConnection: AmqpConnection,
  ) { }

  public async sendMessage(exchange: string, routingKey: string, message: any) {
    await this.amqpConnection.publish(exchange, routingKey, message);
    this.logger.debug(`Message ${JSON.stringify(message)} has been sent to topic exchange ${exchange}`);
  }
}