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

import { databus, IBaseDatasheetPack, IServerDatasheetPack } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { CacheKeys, DATASHEET_PACK_CACHE_EXPIRE_TIME } from 'shared/common';
import { CommonException, ServerException } from 'shared/exception';
import { IAuthHeader, IFetchDataOptions, ILoadBasePackOptions } from 'shared/interfaces';
import util from 'util';
import { Logger } from 'winston';

export class ServerDataLoader implements databus.IDataLoader {
  constructor(
    private readonly datasheetService: DatasheetService,
    private readonly redisService: RedisService,
    private readonly logger: Logger,
    private readonly options: IServerDataLoaderOptions,
  ) {}

  async loadDatasheetPack(dstId: string, options: IServerLoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> {
    const { auth, loadBasePacks } = options;
    if (loadBasePacks) {
      const { foreignDstIds, options } = loadBasePacks;
      // TODO cache
      const dstIds = [dstId, ...foreignDstIds];
      const packs: IBaseDatasheetPack[] = [];
      for (const dstId of dstIds) {
        const basePack = await this.datasheetService.getBasePacks(dstId, options);
        packs.push(...basePack);
      }
      const foreignDatasheetMap: { [dstId: string]: IBaseDatasheetPack } = {};
      for (const pack of packs) {
        foreignDatasheetMap[pack.datasheet.id] = pack;
      }
      // NOTE the first data pack of `packs` is always the datasheet specified by `dstId`.
      delete foreignDatasheetMap[packs[0]!.datasheet.id];
      return {
        ...packs[0]!,
        foreignDatasheetMap,
      };
    }

    if (this.options.useCache) {
      return this.loadDstPackWithCache(dstId, options);
    }

    return this.datasheetService.fetchDataPack(dstId, auth, options);
  }

  private async loadDstPackWithCache(dstId: string, options: IServerLoadDatasheetPackOptions): Promise<IServerDatasheetPack | null> {
    // FIXME cache dirty: revision may not suffice, if a linked record title changes, revision is not changed.
    const dst = await this.datasheetService.getDatasheet(dstId, false);
    if (!dst) {
      return null;
    }

    const client = this.redisService.getClient();
    const revisionCacheKey = util.format(CacheKeys.DATASHEET_REVISION_CACHE, dstId);
    const dstPackCacheKey = util.format(CacheKeys.DATASHEET_PACK_CACHE, dstId);
    await client.watch(revisionCacheKey);
    try {
      const lastRev = await client.get(revisionCacheKey);
      if (lastRev && lastRev !== '' && +dst.revision === +lastRev) {
        const lastDstPackCache = await client.get(dstPackCacheKey);
        if (lastDstPackCache) {
          return JSON.parse(lastDstPackCache);
        }
        return null;
      }

      const dstPack = await this.datasheetService.fetchDataPack(dstId, options.auth, options);

      let remainRetries = 3;
      let results: [Error | null, any][];
      do {
        results = await client
          .multi()
          .set(dstPackCacheKey, JSON.stringify(dstPack), 'EX', DATASHEET_PACK_CACHE_EXPIRE_TIME)
          .set(revisionCacheKey, String(dstPack.datasheet.revision), 'EX', DATASHEET_PACK_CACHE_EXPIRE_TIME)
          .exec();

        if (!results || results.every(([error]) => error)) {
          // If all commands failed, use cached datasheet pack
          return JSON.parse((await client.get(dstPackCacheKey))!);
        } else if (results.some(([error]) => error)) {
          // If some commands failed, retry 3 times.
        } else {
          break;
        }
      } while (--remainRetries >= 0);

      if (remainRetries < 0) {
        const firstError = results.find(([error]) => error)![0];
        this.logger.error('update datasheet cache error', firstError);
        throw new ServerException(CommonException.SERVER_ERROR);
      }

      return dstPack;
    } finally {
      await client.unwatch();
    }
  }
}

export interface IServerLoadDatasheetPackOptions extends databus.ILoadDatasheetPackOptions, IFetchDataOptions {
  auth: IAuthHeader;

  /**
   * If this field is defined, the data loader only loads base data of a datasheet pack.
   * This field is used in field APIs, where only partial data of datasheet packs is necessary.
   */
  loadBasePacks?: {
    foreignDstIds: string[];
    options?: ILoadBasePackOptions;
  };
}

export interface IServerDataLoaderOptions {
  /**
   * If the data loader uses a datasheet pack cache to avoid loading the same datasheet pack repeatedly.
   */
  useCache?: boolean;
}
