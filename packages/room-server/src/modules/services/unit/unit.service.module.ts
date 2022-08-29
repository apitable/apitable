import { Module } from '@nestjs/common';
import { UserRepository } from 'modules/repository/user.repository';
import { UnitService } from './unit.service';
import { UnitMemberService } from './unit.member.service';
import { UnitTagService } from './unit.tag.service';
import { UnitTeamService } from './unit.team.service';
import { UserServiceModule } from '../user/user.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitRepository } from 'modules/repository/unit.repository';
import { UnitTeamRepository } from 'modules/repository/unit.team.repository';
import { UnitTagRepository } from 'modules/repository/unit.tag.repository';
import { UnitMemberRepository } from 'modules/repository/unit.member.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
    UserServiceModule,
  ],
  providers: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
  exports: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
})
export class UnitServiceModule {}
