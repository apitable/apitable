import { Module } from '@nestjs/common';
import { GrpcModule } from './grpc.module';
import { DashboardModule } from './dashboard.modules';
import { DatasheetModule } from '../datasheet.module';
import { FormModule } from './form.module';
import { MirrorModule } from './mirror.module';
import { ResourceModule } from './resource.module';
import { RobotModule } from '../../automation/robot.module';

@Module({
  imports: [ResourceModule, DatasheetModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
  exports: [ResourceModule, DatasheetModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
})
export class InternalModule { }
