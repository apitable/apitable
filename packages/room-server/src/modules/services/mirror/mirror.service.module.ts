import { Module } from '@nestjs/common';
import { DatasheetServiceModule } from '../datasheet/datasheet.service.module';
import { NodeServiceModule } from '../node/node.service.module';
import { MirrorService } from './mirror.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';

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
