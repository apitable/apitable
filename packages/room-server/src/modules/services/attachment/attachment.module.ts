import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AssetRepository } from 'modules/repository/asset.repository';
import { AttachmentService } from './attachment.service';
import { JavaModule } from '../java/java.module';
import { FusionApiServiceModule } from 'modules/services/fusion/fusion.api.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestModule } from 'modules/rest/rest.module';
import { HttpConfigService } from 'configs/http.config.service';

/**
 * 业务服务模块整合
 */
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
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
