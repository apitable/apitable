import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperRepository } from './repositories/developer.repository';
import { DeveloperService } from './services/developer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeveloperRepository,
    ]),
  ],
  providers: [DeveloperService],
  controllers: [],
  exports: [DeveloperService],
})
export class DeveloperModule {}
