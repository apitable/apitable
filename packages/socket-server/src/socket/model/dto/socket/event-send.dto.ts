import { EventEmitDto } from './event-emit.dto';

export class EventSendDto extends EventEmitDto {
  readonly socketId: string;
  readonly toUserId: string;
  userId: number;
}
