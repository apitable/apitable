import { Module } from '@nestjs/common';
import { DashboardServiceModule } from './dashboard.module';
import { DashboardController } from '../database/controllers/dashboard.controller';
import { UserServiceModule } from './user.service.module';
import { NodeServiceModule } from './node.service.module';

@Module({
  imports: [
  DashboardServiceModule,
  UserServiceModule,
  NodeServiceModule,
  ],
  controllers: [DashboardController],
  })
export class DashboardModule {}
