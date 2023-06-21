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
import { CommandModule } from 'database/command/command.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { NodeModule } from 'node/node.module';
import { OtModule } from 'database/ot/ot.module';
import { ResourceModule } from 'database/resource/resource.module';
import { UserModule } from 'user/user.module';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';

@Module({
  imports: [
    forwardRef(()=>ResourceModule),
    CommandModule,
    forwardRef(()=>NodeModule),
    UserModule,
    DatasheetModule,
    forwardRef(()=>OtModule),
  ],
  controllers: [FormController],
  providers: [FormService, FusionApiTransformer],
})
export class FormModule {}
