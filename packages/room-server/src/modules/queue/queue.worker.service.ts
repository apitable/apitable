import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectLogger } from 'common';
import { Logger } from 'winston';

@Injectable()
export class QueueWorkerService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
  ) { }

  @RabbitSubscribe({
    exchange: 'update.events.exchange',
    routingKey: 'member.name.updated',
    queue: 'update.events.queue',
  })
  public async handleMemberNameUpdated(msg: {}) {
    // this.logger.debug(`Received member name update message: ${JSON.stringify(msg)}`);
  }
}