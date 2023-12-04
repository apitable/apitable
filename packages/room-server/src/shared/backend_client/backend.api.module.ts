import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AsyncConfiguration, Configuration, ConfigurationFactory } from './configuration';

import { InternalServiceNodeInterfaceService } from './api/internal-service-node-interface.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [InternalServiceNodeInterfaceService],
  providers: [InternalServiceNodeInterfaceService],
})
export class BackendApiModule {
  public static forRoot(configurationFactory: () => Configuration): DynamicModule {
    return {
      module: BackendApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  /**
   * Register the module asynchronously.
   */
  static forRootAsync(options: AsyncConfiguration): DynamicModule {
    const providers = [...this.createAsyncProviders(options)];
    return {
      module: BackendApiModule,
      imports: options.imports || [],
      providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(options: AsyncConfiguration): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncConfigurationProvider(options)];
    }
    const providers = [this.createAsyncConfigurationProvider(options)];
    if (options.useClass) {
      return [
        ...providers,
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    return providers;
  }

  private static createAsyncConfigurationProvider(options: AsyncConfiguration): Provider {
    if (options.useFactory) {
      return {
        provide: Configuration,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const factory = options.useExisting || options.useClass;
    return {
      provide: Configuration,
      useFactory: async (optionsFactory: ConfigurationFactory) => await optionsFactory.createConfiguration(),
      inject: factory ? [factory] : [],
    };
  }

  // constructor( httpService: HttpService) { }
}
