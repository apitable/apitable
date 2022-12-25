/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
      useFactory: options.useFactory as (...args: any[]) => any,
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