import { Provider, Type } from '@nestjs/common';
import { IZipkinModuleAsyncOptions, IZipkinModuleOptions, IZipkinModuleOptionsFactory } from './zipkin.interface';
import { ZIPKIN_MODULE_OPTIONS, ZIPKIN_MODULE_PROVIDER } from './zipkin.constants';
import { ZipkinService } from './zipkin.service';

export function createZipkinOptionProviders(options: IZipkinModuleOptions): Provider[] {
  return [
    {
      provide: ZIPKIN_MODULE_OPTIONS,
      useValue: options,
    },
    {
      provide: ZIPKIN_MODULE_PROVIDER,
      useFactory: () => new ZipkinService(options),
      inject: [ZIPKIN_MODULE_OPTIONS],
    },
  ];
}

export function createZipkinOptionAsyncProviders(options: IZipkinModuleAsyncOptions): Provider[] {

  const providers: Provider[] = [
    {
      provide: ZIPKIN_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    },
    {
      provide: ZIPKIN_MODULE_PROVIDER,
      useFactory: (options: IZipkinModuleOptions) => new ZipkinService(options),
      inject: [ZIPKIN_MODULE_OPTIONS],
    },
  ];

  if (options.useClass) {
    const useClass = options.useClass as Type<IZipkinModuleOptionsFactory>;
    providers.push(...[
      {
        provide: ZIPKIN_MODULE_OPTIONS,
        useFactory: async(optionsFactory: IZipkinModuleOptionsFactory) =>
          await optionsFactory.createZipkinModuleOptions(),
        inject: [useClass],
      },
      {
        provide: useClass,
        useClass,
      },
    ]);
  }

  if (options.useFactory) {
    providers.push(
      {
        provide: ZIPKIN_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    );
  }
  return providers;
}