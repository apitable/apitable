import { NotificationTypes } from '../../../enum/request-types.enum';
import { BaseUserDto } from '../../dto/user/base-user.dto';

export interface NotificationRo {
  readonly rowNo: number;
  readonly createdAt: string;
  readonly notifyBody: object;
  readonly notifyType: string;
  readonly fromUser: BaseUserDto;
  readonly isRead: number;
  readonly id: string;
  readonly toUserId: string;
  readonly updatedAt: string;
  event: NotificationTypes;
  socketId: string;
}
