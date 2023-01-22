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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { UnitModule } from 'unit/unit.module';
import { UserModule } from 'user/user.module';
import { NodeDescRepository } from './repositories/node.desc.repository';
import { NodeRelRepository } from './repositories/node.rel.repository';
import { NodeRepository } from './repositories/node.repository';
import { NodeShareSettingRepository } from './repositories/node.share.setting.repository';
import { NodeDescriptionService } from './services/node.description.service';
import { NodePermissionService } from './services/node.permission.service';
import { NodeService } from './services/node.service';
import { NodeShareSettingService } from './services/node.share.setting.service';
import { IsNodeExistConstraint } from './validations/validation.constraint';

@Module({
  imports: [
    UserModule,
    UnitModule,
    TypeOrmModule.forFeature([
      NodeRepository,
      NodeRelRepository,
      NodeDescRepository,
      NodeShareSettingRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetRepository,
      ResourceMetaRepository,
    ]),
  ],
  controllers: [],
  providers: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    IsNodeExistConstraint,
  ],
  exports: [
    NodeService, 
    NodePermissionService, 
    NodeShareSettingService, 
    NodeDescriptionService, 
    IsNodeExistConstraint,
  ]
})
export class NodeModule {}
