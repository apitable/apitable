import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeModule } from 'database/node/node.module';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { UserModule } from 'database/user/user.module';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [
    NodeModule, 
    UserModule,
    TypeOrmModule.forFeature([
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      ResourceMetaRepository,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}
