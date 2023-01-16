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

import { TrackEvents } from '@apitable/core';
import { getEnvVariables } from "pc/utils/env";

declare const sensors: {
  login(userId: string, cb?: () => void);
  track(eventName: TrackEvents, props: { [key: string]: any }, cb?: () => void);
  setProfile(props: { [key: string]: any }, cb?: () => void);
  setOnceProfile(props: { [key: string]: any }, cb?: () => void);
  quick(key: string, target: Element, props?: { [key: string]: any }, cb?: () => void)
};

export const tracker = {
  login(userId: string, cb?: () => void) {
    if (getEnvVariables().DISABLED_SENSORS) return;
    return sensors.login(userId, cb);
  },
  track(eventName: TrackEvents, props: { [key: string]: any }, cb?: () => void) {
    if (getEnvVariables().DISABLED_SENSORS) return;
    return sensors.track(eventName, props, cb);
  },
  setProfile(props: { [key: string]: any }, cb?: () => void) {
    if (getEnvVariables().DISABLED_SENSORS) return;
    return sensors.setProfile(props, cb);
  },
  setOnceProfile(props: { [key: string]: any }, cb?: () => void) {
    if (getEnvVariables().DISABLED_SENSORS) return;
    return sensors.setOnceProfile(props, cb);
  },
  quick(key: string, target: Element, props?: { [key: string]: any }, cb?: () => void) {
    if (getEnvVariables().DISABLED_SENSORS) return;
    return sensors.quick(key, target, props, cb);
  },
};
