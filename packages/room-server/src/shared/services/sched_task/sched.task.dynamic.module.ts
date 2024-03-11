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

import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import * as fs from 'fs';
import { NodeModule } from 'node/node.module';
import path from 'path';

/**
 * original sched.task.module
 */
@Module({})
export class SchedTaskDynamicModule {
  static register(enabled: boolean): DynamicModule {
    const dynamicModule = {
      module: SchedTaskDynamicModule,
      imports: [DatabaseModule, NodeModule],
      providers: [],
    };

    const schedTaskEnterpriseServicePath = path.join(__dirname, '../../../enterprise/sched_task');
    const isEnterpriseLevel: boolean = fs.existsSync(schedTaskEnterpriseServicePath);

    if (!enabled || !isEnterpriseLevel) {
      return dynamicModule;
    }

    const { SchedTaskService } = require(`${schedTaskEnterpriseServicePath}/sched.task.service`);

    return {
      ...dynamicModule,
      providers: [SchedTaskService],
    };
  }
}
