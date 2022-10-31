import { Module } from '@nestjs/common';
import { UserService } from '../database/services/user/user.service';
import { RestModule } from './rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../database/repositories/user.repository';

@Module({
  imports: [RestModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
