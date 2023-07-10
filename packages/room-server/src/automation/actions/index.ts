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

import { Module } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import process from 'process';

export * as webhook from './webhook';
export * as ruliu from './ruliu';
export * as slack from './slack';
export * as sms from './sms';

const actionEnterpriseModulePath = path.join(__dirname, '../../enterprise/automation/action');
const isEnterpriseLevel: boolean = fs.existsSync(actionEnterpriseModulePath);
if (isEnterpriseLevel) {
  import(`${actionEnterpriseModulePath}/index`).then((module) => {
    const keys = Object.keys(module);
    for(const key of keys) {
      exports[key] = module[key];
    }
  }, (err) => {
    console.error('load enterprise action module error');
    console.error(err);
    process.exit(1);
  });
}

@Module({
  imports: [],
})
export class AutomationActionModule {}