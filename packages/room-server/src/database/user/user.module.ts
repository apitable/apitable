import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
    ]),
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
