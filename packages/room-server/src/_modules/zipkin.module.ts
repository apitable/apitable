import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  IZipkinModuleAsyncOptions,
  IZipkinModuleOptions,
} from '../shared/services/zipkin/zipkin.interface';
import {
  createZipkinOptionAsyncProviders,
  createZipkinOptionProviders,
} from '../shared/services/zipkin/zipkin.providers';
import { ZipkinService } from '../shared/services/zipkin/zipkin.service';

@Global()
@Module({
  providers: [ZipkinService],
  exports: [ZipkinService],
})
export class ZipkinModule {

  static forRoot(options: IZipkinModuleOptions): DynamicModule {
    const providers = createZipkinOptionProviders(options);
    return {
      module: ZipkinModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(options: IZipkinModuleAsyncOptions): DynamicModule {
    const providers = createZipkinOptionAsyncProviders(options);
    return {
      module: ZipkinModule,
      imports: options.imports,
      providers,
      exports: providers,
    } as DynamicModule;
  }
}