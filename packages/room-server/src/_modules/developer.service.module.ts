import { Module } from '@nestjs/common';
import { DeveloperRepository } from '../database/repositories/developer.repository';
import { UnitMemberRepository } from '../database/repositories/unit.member.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { DeveloperService } from '../database/services/developer/developer.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository])],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperServiceModule {}
