import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JavaService } from './java.service';
import { HttpConfigService } from '../../../configs/http.config.service';

/**
 * 业务服务模块整合
 * @deprecated 错误做法，请使用 RestModule
 */
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  providers: [JavaService],
  exports: [JavaService],
})
export class JavaModule {}
