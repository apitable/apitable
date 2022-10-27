import { NotificationTypes } from '../../../enum/request-types.enum';

export class EventEmitDto {
  readonly event: NotificationTypes;
  readonly data: unknown;
}
