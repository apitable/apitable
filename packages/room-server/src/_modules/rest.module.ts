import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpConfigService } from '../shared/services/config/http.config.service';
import { RestService } from '../shared/services/rest/rest.service';

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
