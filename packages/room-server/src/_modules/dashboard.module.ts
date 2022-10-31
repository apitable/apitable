import { Module } from '@nestjs/common';
import { ResourceMetaRepository } from '../database/repositories/resource.meta.repository';
import { DashboardService } from '../database/services/dashboard/dashboard.service';
import { NodeServiceModule } from './node.service.module';
import { RestModule } from './rest.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceMetaRepository]),
    NodeServiceModule,
    RestModule,
  ],
  providers: [DashboardService],
  exports: [DashboardService],
})

export class DashboardServiceModule { }
