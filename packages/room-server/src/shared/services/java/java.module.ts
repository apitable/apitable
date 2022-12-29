import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JavaService } from './java.service';
import { HttpConfigService } from '../config/http.config.service';

/**
 * Backend server module integration
 * @deprecated deprecate, use RestModule instead
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
