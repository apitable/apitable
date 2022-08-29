import { Module } from '@nestjs/common';
import { DashboardServiceModule } from 'modules/services/dashboard/dashboard.module';
import { DashboardController } from './dashboard.controller';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';

@Module({
  imports: [
    DashboardServiceModule,
    UserServiceModule,
    NodeServiceModule,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
