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
import { UserModule } from 'user/user.module';
import { UnitMemberRepository } from './repositories/unit.member.repository';
import { UnitRepository } from './repositories/unit.repository';
import { UnitTeamRepository } from './repositories/unit.team.repository';
import { UnitService } from './services/unit.service';
import { UnitTeamService } from './services/unit.team.service';
import { UnitMemberService } from './services/unit.member.service';
import { UnitRoleMemberRepository } from './repositories/unit.role.member.repository';
import { UnitTeamMemberRefRepository } from './repositories/unit.team.member.ref.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      UnitRepository,
      UnitMemberRepository,
      UnitTeamRepository,
      UnitTeamMemberRefRepository,
      UnitRoleMemberRepository,
    ]),
  ],
  providers: [UnitService, UnitTeamService, UnitMemberService],
  exports: [UnitService, UnitTeamService, UnitMemberService],
})
export class UnitModule {}
