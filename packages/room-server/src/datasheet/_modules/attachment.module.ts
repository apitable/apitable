import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AssetRepository } from '../repositories/asset.repository';
import { AttachmentService } from '../services/attachment/attachment.service';
import { JavaModule } from '../../shared/services/java/java.module';
import { FusionApiServiceModule } from '../../fusion/fusion.api.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestModule } from 'shared/services/rest/rest.module';
import { HttpConfigService } from '../../shared/services/config/http.config.service';

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
