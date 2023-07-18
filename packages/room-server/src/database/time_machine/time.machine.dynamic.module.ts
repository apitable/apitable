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
import { TimeMachineBaseService } from 'database/time_machine/time.machine.service.base';
import fs from 'fs';
import path from 'path';

@Module({
  providers: [
    {
      provide: TimeMachineBaseService,
      useClass: class TimeMachineService extends TimeMachineBaseService {
      }
    },
  ],
  exports: [
    {
      provide: TimeMachineBaseService,
      useClass: class TimeMachineService extends TimeMachineBaseService {
      }
    },
  ]
})
export class TimeMachineDynamicModule {
  static forRoot(): DynamicModule {
    const timeMachineEnterpriseModulePath = path.join(__dirname, '../../enterprise/database/time_machine');
    const isEnterpriseLevel: boolean = fs.existsSync(timeMachineEnterpriseModulePath);
    if (isEnterpriseLevel) {
      const { TimeMachineEnterpriseModule } = require(`${timeMachineEnterpriseModulePath}/time.machine.enterprise.module`);
      return {
        module: TimeMachineEnterpriseModule,
      };
    }
    return {
      module: TimeMachineDynamicModule,
    };
  }
}
