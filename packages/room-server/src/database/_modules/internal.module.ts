import { Module } from '@nestjs/common';
import { GrpcModule } from './grpc.module';
import { DashboardModule } from './dashboard.modules';
import { DatabaseModule } from '../database.module';
import { FormModule } from './form.module';
import { MirrorModule } from './mirror.module';
import { ResourceModule } from './resource.module';
import { RobotModule } from '../../automation/robot.module';

@Module({
  imports: [ResourceModule, DatabaseModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
  exports: [ResourceModule, DatabaseModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
})
export class InternalModule { }
