/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { RobotNotificationTypeEnum } from 'shared/enums/ding-talk/robot-notification-type.enum';

interface INotificationAt {
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

interface IText {
  content: string;
}

interface IMarkDown {
  title: string;
  text: string;
}

export interface IRobotNotificationType {
  msgtype: RobotNotificationTypeEnum;
}

export interface IRobotDto {
  accessToken: string;
  secret: string;
}

export interface IRobotNotificationTextDto extends IRobotNotificationType {
  text: IText;
  at?: INotificationAt;
}

export interface IRobotNotificationMarkDownDto extends IRobotNotificationType {
  markdown: IMarkDown;
  at?: INotificationAt;
}
