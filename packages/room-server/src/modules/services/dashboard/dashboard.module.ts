import { Module } from '@nestjs/common';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { DashboardService } from './dashboard.service';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { RestModule } from '../../rest/rest.module';
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
