import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceController } from './controllers/resource.controller';
import { ResourceChangesetRepository } from './repositories/resource.changeset.repository';
import { ResourceMetaRepository } from './repositories/resource.meta.repository';
import { ChangesetService } from './services/changeset.service';
import { MetaService } from './services/meta.service';
import { ResourceService } from './services/resource.service';
import { RoomResourceRelService } from './services/room.resource.rel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourceChangesetRepository,
      ResourceMetaRepository
    ]),
  ],
  providers: [ChangesetService, MetaService, ResourceService, RoomResourceRelService],
  controllers: [ResourceController],
  exports: [TypeOrmModule],
})
export class ResourceModule {}
