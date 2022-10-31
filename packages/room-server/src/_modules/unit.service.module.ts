import { Module } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UnitService } from '../database/services/unit/unit.service';
import { UnitMemberService } from '../database/services/unit/unit.member.service';
import { UnitTagService } from '../database/services/unit/unit.tag.service';
import { UnitTeamService } from '../database/services/unit/unit.team.service';
import { UserServiceModule } from './user.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitRepository } from '../database/repositories/unit.repository';
import { UnitTeamRepository } from '../database/repositories/unit.team.repository';
import { UnitTagRepository } from '../database/repositories/unit.tag.repository';
import { UnitMemberRepository } from '../database/repositories/unit.member.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
    UserServiceModule,
  ],
  providers: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
  exports: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
})
export class UnitServiceModule {}
