import { RobotNotificationTypeEnum } from '../../../enum/ding-talk/robot-notification-type.enum';

interface NotificationAt {
  /**
   * Cell phone number
   * Cell phone number of the person being @ (add the @person's cell phone number to the content)
   */
  atMobiles: string[];
  /**
   * Whether @all
   */
  isAll: boolean;
}

interface Text {
  content: string;
}

interface MarkDown {
  title: string;
  text: string;
}

export interface RobotNotificationType {
  msgtype: RobotNotificationTypeEnum;
}

export interface RobotDto {
  accessToken: string;
  secret: string;
}

export interface RobotNotificationTextDto extends RobotNotificationType {
  text: Text;
  at?: NotificationAt;
}

export interface RobotNotificationMarkDownDto extends RobotNotificationType {
  markdown: MarkDown;
  at?: NotificationAt;
}
