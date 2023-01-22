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
import { UserRepository } from 'user/repositories/user.repository';
import { UserModule } from 'user/user.module';
import { DeveloperRepository } from './repositories/developer.repository';
import { DeveloperService } from './services/developer.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      DeveloperRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      UserRepository,
    ]),
  ],
  providers: [DeveloperService],
  controllers: [],
  exports: [DeveloperService],
})
export class DeveloperModule {}
