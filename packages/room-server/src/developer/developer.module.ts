import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperRepository } from './repositories/developer.repository';
import { DeveloperService } from './services/developer.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      DeveloperRepository,
    ])
  ],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}