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

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotModule } from 'automation/robot.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { DatasheetChangesetRepository } from 'database/datasheet/repositories/datasheet.changeset.repository';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { NodeModule } from 'node/node.module';
import { OtModule } from 'database/ot/ot.module';
import { UserModule } from 'user/user.module';
import { WidgetRepository } from 'database/widget/repositories/widget.repository';
import { WidgetModule } from 'database/widget/widget.module';
import { ResourceController } from './controllers/resource.controller';
import { ResourceDataInterceptor } from './middleware/resource.data.interceptor';
import { ResourceChangesetRepository } from './repositories/resource.changeset.repository';
import { ResourceMetaRepository } from './repositories/resource.meta.repository';
import { ChangesetService } from './services/changeset.service';
import { MetaService } from './services/meta.service';
import { ResourceService } from './services/resource.service';
import { RoomResourceRelService } from './services/room.resource.rel.service';

@Module({
  imports: [
    forwardRef(()=>NodeModule),
    forwardRef(()=>UserModule),
    forwardRef(()=>DatasheetModule),
    forwardRef(()=>OtModule),
    forwardRef(()=>WidgetModule),
    forwardRef(()=>RobotModule),
    TypeOrmModule.forFeature([
      ResourceChangesetRepository,
      ResourceMetaRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetChangesetRepository,
      DatasheetRepository,
      WidgetRepository,
    ]),
  ],
  providers: [ChangesetService, MetaService, ResourceService, RoomResourceRelService, ResourceDataInterceptor],
  controllers: [ResourceController],
  exports: [ChangesetService, MetaService, ResourceService, RoomResourceRelService, ResourceDataInterceptor, TypeOrmModule],
})
export class ResourceModule {}
