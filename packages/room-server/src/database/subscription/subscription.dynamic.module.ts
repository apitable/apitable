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
import { DatasheetRecordSubscriptionBaseService } from 'database/subscription/datasheet.record.subscription.base.service';
import path from 'path';
import * as fs from 'fs';

@Module({
  providers: [
    {
      provide: DatasheetRecordSubscriptionBaseService,
      useClass: class SubscriptionService extends DatasheetRecordSubscriptionBaseService {}
    },
  ],
  exports: [
    {
      provide: DatasheetRecordSubscriptionBaseService,
      useClass: class SubscriptionService extends DatasheetRecordSubscriptionBaseService {}
    },
  ]
})
export class SubscriptionDynamicModule { 
  static forRoot(): DynamicModule {
    const subscriptionEnterpriseModulePath = path.join(__dirname, '../../enterprise/database/subscription');
    const isEnterpriseLevel: boolean = fs.existsSync(subscriptionEnterpriseModulePath);
    if (isEnterpriseLevel) {
      const { SubscriptionEnterpriseModule } = require(`${subscriptionEnterpriseModulePath}/subscription.enterprise.module`);
      return {
        module: SubscriptionEnterpriseModule,
      };
    }
    return { 
      module: SubscriptionDynamicModule,
    }; 

  }
}
