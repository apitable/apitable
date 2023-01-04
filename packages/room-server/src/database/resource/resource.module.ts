import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { NodeModule } from 'database/node/node.module';
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
    NodeModule,
    DatasheetModule,
    TypeOrmModule.forFeature([
      ResourceChangesetRepository,
      ResourceMetaRepository
    ]),
  ],
  providers: [ChangesetService, MetaService, ResourceService, RoomResourceRelService, ResourceDataInterceptor],
  controllers: [ResourceController],
  exports: [TypeOrmModule, ResourceDataInterceptor],
})
export class ResourceModule {}
