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

import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  IZipkinModuleAsyncOptions,
  IZipkinModuleOptions,
} from './zipkin.interface';
import {
  createZipkinOptionAsyncProviders,
  createZipkinOptionProviders,
} from './zipkin.providers';
import { ZipkinService } from './zipkin.service';

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