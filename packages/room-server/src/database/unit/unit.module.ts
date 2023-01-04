import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'database/user/repositories/user.repository';
import { UserModule } from 'database/user/user.module';
import { UnitMemberRepository } from './repositories/unit.member.repository';
import { UnitRepository } from './repositories/unit.repository';
import { UnitTagRepository } from './repositories/unit.tag.repository';
import { UnitTeamRepository } from './repositories/unit.team.repository';
import { UnitMemberService } from './services/unit.member.service';
import { UnitService } from './services/unit.service';
import { UnitTagService } from './services/unit.tag.service';
import { UnitTeamService } from './services/unit.team.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      UnitRepository, UnitMemberRepository, UnitTagRepository, UnitTeamRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      UserRepository
    ]),
  ],
  providers: [UnitService, UnitTagService, UnitTeamService, UnitMemberService],
  exports: [UnitService, UnitTagService, UnitTeamService, UnitMemberService],
})
export class UnitModule {}
