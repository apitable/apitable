import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitMemberRepository } from 'database/unit/repositories/unit.member.repository';
import { UserRepository } from 'database/user/repositories/user.repository';
import { UserModule } from 'database/user/user.module';
import { DeveloperRepository } from './repositories/developer.repository';
import { DeveloperService } from './services/developer.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      DeveloperRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      UserRepository,
      UnitMemberRepository,
    ]),
  ],
  providers: [DeveloperService],
  controllers: [],
  exports: [DeveloperService],
})
export class DeveloperModule {}
