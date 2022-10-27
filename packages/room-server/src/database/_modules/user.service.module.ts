import { Module } from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { RestModule } from '../../shared/services/rest/rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [RestModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserServiceModule {}
