import { Module } from '@nestjs/common';
import { DatasheetServiceModule } from './datasheet.service.module';
import { NodeServiceModule } from './node.service.module';
import { MirrorService } from '../services/mirror/mirror.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceMetaRepository } from '../repositories/resource.meta.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceMetaRepository]),
    NodeServiceModule,
    DatasheetServiceModule,
  ],
  providers: [MirrorService],
  exports: [MirrorService],
})
export class MirrorServiceModule {}
