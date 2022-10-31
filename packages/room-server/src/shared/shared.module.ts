import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from 'database/repositories/asset.repository';
import { AttachmentService } from 'database/services/attachment/attachment.service';
import { FusionApiServiceModule } from '_modules/fusion.api.service.module';
import { RestModule } from '_modules/rest.module';
import { HttpConfigService } from './services/config/http.config.service';
import { JavaModule } from './services/java/java.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([AssetRepository]),
  JavaModule,
  FusionApiServiceModule,
  RestModule,
  HttpModule.registerAsync({
    useClass: HttpConfigService,
    }),
  ],

  controllers: [],
  providers: [AttachmentService],
  exports: [AttachmentService],
  })
export class SharedModule {}
