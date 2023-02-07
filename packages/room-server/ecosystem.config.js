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

// eslint-disable-next-line no-undef
const instanceCount = parseInt(process.env.INSTANCE_COUNT || '4', 10);
// eslint-disable-next-line no-undef
const maxMemoryRestart = process.env.INSTANCE_MAX_MEMORY || '1452M';
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'nest',
      script: './dist/main.js',
      cwd: 'packages/room-server',
      // restart from memory
      max_memory_restart: maxMemoryRestart,
      exec_mode: 'cluster',
      instances: instanceCount,
      // exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      // applications running for less time are considered to be abnormally started
      min_uptime: '5m',
      // maximum number of abnormal restarts, i.e. restarts with less than min_uptime runtime
      max_restarts: 5,
      // no log output
      out_file: '/dev/null',
      // no log output
      error_file: '/dev/null'
    }
  ]
};
