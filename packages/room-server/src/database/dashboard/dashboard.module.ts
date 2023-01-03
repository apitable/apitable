import { Module } from '@nestjs/common';
import { NodeModule } from 'database/node/node.module';
import { ResourceModule } from 'database/resource/resource.module';
import { UserModule } from 'database/user/user.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [NodeModule, ResourceModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}
