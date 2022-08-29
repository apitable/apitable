import { Module } from '@nestjs/common';
import { DeveloperRepository } from 'modules/repository/developer.repository';
import { UnitMemberRepository } from 'modules/repository/unit.member.repository';
import { UserRepository } from 'modules/repository/user.repository';
import { DeveloperService } from './developer.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository])],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperServiceModule {}
