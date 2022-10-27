import { RobotNotificationTypeEnum } from '../../../enum/ding-talk/robot-notification-type.enum';

interface NotificationAt {
  /**
   * 手机号码
   * 被@人的手机号（在content里添加@人的手机号）
   */
  atMobiles: string[];
  /**
   * 是否@所有人
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
