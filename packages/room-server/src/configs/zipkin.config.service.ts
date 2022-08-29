import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IZipkinModuleOptions, IZipkinModuleOptionsFactory } from '../modules/zipkin/zipkin.interface';

@Injectable()
export class ZipkinConfigService implements IZipkinModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createZipkinModuleOptions(): IZipkinModuleOptions {
    const enabled = Object.is(process.env.ZIPKIN_ENABLED, 'true') || this.configService.get<boolean>('zipkin.enabled');
    const endpoint = process.env.ZIPKIN_ENDPOINT || this.configService.get<string>('zipkin.endpoint');
    return {
      enabled,
      endpoint,
    };
  }
}
