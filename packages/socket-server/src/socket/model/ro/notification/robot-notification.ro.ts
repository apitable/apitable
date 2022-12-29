import { RobotDto, RobotNotificationType } from '../../dto/ding-talk/robot-notification.dto';

export interface RobotNotificationRo extends RobotNotificationType {
  body: any;
  robot: RobotDto;
  event: string;
}
