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
import { redisModuleOptions } from 'shared/services/config/redis.config.service';

<<<<<<<< HEAD:apitable/packages/datasheet/pages/user/woa/callback.tsx
import dynamic from 'next/dynamic';
import React from 'react';

// @ts-ignore
const WoaCallbackWithNoSSR = dynamic(() => import('enterprise').then((components) => {
  return components.WoaCallback;
}), { ssr: false });

const App = () => {
  return WoaCallbackWithNoSSR && <WoaCallbackWithNoSSR />;
};

export default App;
========
export const AUTOMATION_REDIS_CLIENT = 'AUTOMATION_REDIS_CLIENT';

const { host, port, password, db } = redisModuleOptions();
export const AUTOMATION_REDIS_HOST = host;
export const AUTOMATION_REDIS_PORT = port;
export const AUTOMATION_REDIS_PASSWORD = password;
export const AUTOMATION_REDIS_DB = db;
>>>>>>>> 29caf6135b5557bd4b3183072585c1d08ff250a7:apitable/packages/room-server/src/automation/constants/redis.config.ts
