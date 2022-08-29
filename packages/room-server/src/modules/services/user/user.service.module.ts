import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RestModule } from '../../rest/rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'modules/repository/user.repository';

@Module({
  imports: [RestModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
