import { Module } from '@nestjs/common';
import { DeveloperRepository } from '../repositories/developer.repository';
import { UnitMemberRepository } from '../repositories/unit.member.repository';
import { UserRepository } from '../repositories/user.repository';
import { DeveloperService } from '../services/developer/developer.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperRepository, UserRepository, UnitMemberRepository])],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperServiceModule {}
