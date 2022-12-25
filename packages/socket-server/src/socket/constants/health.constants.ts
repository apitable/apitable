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

import { CronExpression } from '@nestjs/schedule';

export class HealthConstants {
  public static readonly HEAP_MEMORY_RATIO = parseInt(process.env.HEAP_MEMORY_RATIO, 10) || 100;
  public static readonly RSS_MEMORY_RATIO = parseInt(process.env.NODE_MEMORY_RATIO, 10) || 90;
  public static readonly HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://health-check-monitor.vika.cn';
  public static readonly NEST_HEALTH_CHECK_CRON_EXPRESSION = process.env.NEST_HEALTH_CHECK_CRON_EXPRESSION || CronExpression.EVERY_5_SECONDS;
  public static readonly NEST_HEALTH_CHECK_TIMEOUT = parseInt(process.env.NEST_HEALTH_CHECK_TIMEOUT, 10) || 1000;
}
