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

import * as ConfigConstant from './constant';
import { Navigation, SpacePathType } from './router';
import * as StatusCode from './status_code';
import { ApiTipConfig, ApiTipConstant, NoticeTemplatesConstant, Settings, SystemConfig } from './system_config';
import { TrackEvents } from './track_events';

export { SystemConfigInterfacePlayer, SystemConfigInterfaceGuide } from './system_config.interface';
import BillingConfig from './billing.auto.json';

export {
  ConfigConstant,
  StatusCode,
  Navigation,
  SpacePathType,
  SystemConfig,
  Settings,
  TrackEvents,
  NoticeTemplatesConstant,
  ApiTipConfig,
  ApiTipConstant,
  BillingConfig
};

export * from './emojis_config';
export * from './timezones';
export * from './dom_id';
export * from './konva_id';
export * from './env';
