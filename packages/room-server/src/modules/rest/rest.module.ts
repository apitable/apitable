import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpConfigService } from 'configs/http.config.service';
import { RestService } from './rest.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),
  ],
  providers: [RestService],
  exports: [RestService],
})
export class RestModule {}
