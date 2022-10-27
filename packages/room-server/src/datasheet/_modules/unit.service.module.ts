import { Module } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UnitService } from '../services/unit/unit.service';
import { UnitMemberService } from '../services/unit/unit.member.service';
import { UnitTagService } from '../services/unit/unit.tag.service';
import { UnitTeamService } from '../services/unit/unit.team.service';
import { UserServiceModule } from './user.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitRepository } from '../repositories/unit.repository';
import { UnitTeamRepository } from '../repositories/unit.team.repository';
import { UnitTagRepository } from '../repositories/unit.tag.repository';
import { UnitMemberRepository } from '../repositories/unit.member.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository, UserRepository]),
    UserServiceModule,
  ],
  providers: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
  exports: [UnitService, UnitMemberService, UnitTagService, UnitTeamService],
})
export class UnitServiceModule {}
