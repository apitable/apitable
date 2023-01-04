import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotModule } from 'automation/robot.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { DatasheetChangesetRepository } from 'database/datasheet/repositories/datasheet.changeset.repository';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { NodeModule } from 'database/node/node.module';
import { WidgetRepository } from 'database/widget/repositories/widget.repository';
import { WidgetModule } from 'database/widget/widget.module';
import { ResourceController } from './controllers/resource.controller';
import { ResourceDataInterceptor } from './middleware/resource.data.interceptor';
import { ResourceChangesetRepository } from './repositories/resource.changeset.repository';
import { ResourceMetaRepository } from './repositories/resource.meta.repository';
import { ChangesetService } from './services/changeset.service';
import { MetaService } from './services/meta.service';
import { ResourceService } from './services/resource.service';
import { RoomResourceRelService } from './services/room.resource.rel.service';

@Module({
  imports: [
    forwardRef(()=>NodeModule),
    forwardRef(()=>DatasheetModule),
    forwardRef(()=>WidgetModule),
    forwardRef(()=>RobotModule),
    TypeOrmModule.forFeature([
      ResourceChangesetRepository,
      ResourceMetaRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      DatasheetChangesetRepository,
      DatasheetRepository,
      WidgetRepository,
    ]),
  ],
  providers: [ChangesetService, MetaService, ResourceService, RoomResourceRelService, ResourceDataInterceptor],
  controllers: [ResourceController],
  exports: [ChangesetService, MetaService, ResourceService, RoomResourceRelService, ResourceDataInterceptor, TypeOrmModule],
})
export class ResourceModule {}
