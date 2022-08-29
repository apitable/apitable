import { Module } from '@nestjs/common';
import { GrpcModule } from 'controllers/internal/grpc/grpc.module';
import { DashboardModule } from './dashboard/dashboard.modules';
import { DatasheetModule } from './datasheet/datasheet.module';
import { FormModule } from './form/form.module';
import { MirrorModule } from './mirror/mirror.module';
import { ResourceModule } from './resource/resource.module';
import { RobotModule } from './robot/robot.module';

@Module({
  imports: [ResourceModule, DatasheetModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
  exports: [ResourceModule, DatasheetModule, FormModule, DashboardModule, MirrorModule, GrpcModule, RobotModule],
})
export class InternalModule { }
