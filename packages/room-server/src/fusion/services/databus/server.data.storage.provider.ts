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

import {
  ApiTipConstant,
  databus,
  IBaseDatasheetPack,
  IInternalFix,
  ILocalChangeset,
  IOperation,
  IRemoteChangeset,
  IResourceOpsCollect,
  IServerDashboardPack,
  IServerDatasheetPack,
  resourceOpsToChangesets,
  StoreActions,
} from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { DashboardService } from 'database/dashboard/services/dashboard.service';
import { DatasheetChangesetSourceService } from 'database/datasheet/services/datasheet.changeset.source.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { DatasheetPack } from 'database/interfaces';
import { OtService } from 'database/ot/services/ot.service';
import { pick } from 'lodash';
import { CacheKeys, DATASHEET_PACK_CACHE_EXPIRE_TIME } from 'shared/common';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { ApiException, CommonException, ServerException } from 'shared/exception';
import { IAuthHeader, IFetchDataOptions, ILoadBasePackOptions } from 'shared/interfaces';
import util from 'util';
import { Logger } from 'winston';

export class ServerDataStorageProvider implements databus.IDataStorageProvider {
  private readonly datasheetService: DatasheetService;
  private readonly dashboardService: DashboardService;
  private readonly redisService: RedisService;
  private readonly otService: OtService;
  private readonly changesetSourceService: DatasheetChangesetSourceService;
  private readonly loadOptions: IServerDataLoadOptions;

  constructor(options: IServerDataStorageProviderOptions, private readonly logger: Logger) {
    const { datasheetService, dashboardService, redisService, otService, changesetSourceService, loadOptions } = options;
    this.datasheetService = datasheetService;
    this.dashboardService = dashboardService;
    this.redisService = redisService;
    this.otService = otService;
    this.changesetSourceService = changesetSourceService;
    this.loadOptions = loadOptions;
  }

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

    let datasheetPack: IServerDatasheetPack | null;
    if (this.loadOptions.useCache) {
      datasheetPack = await this.loadDstPackWithCache(dstId, options);
    } else {
      datasheetPack = (await this.datasheetService.fetchDataPack(dstId, auth, false, options)) as DatasheetPack;
    }

    return datasheetPack;
  }

  loadDashboardPack(dsbId: string, options: IServerLoadDashboardPackOptions): Promise<IServerDashboardPack | null> {
    return this.dashboardService.fetchDashboardPack(dsbId, options.auth);
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

      const dstPack = (await this.datasheetService.fetchDataPack(dstId, options.auth, false, options)) as DatasheetPack;

      let remainRetries = 3;
      let results: [Error | null, any][] | null = null;
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

  async saveOps(ops: IResourceOpsCollect[], options: IServerSaveOpsOptions): Promise<any> {
    const { prependOps, store, resource, auth, internalFix, applyChangesets = true } = options;
    const changesets = resourceOpsToChangesets(ops, store.getState());
    if (prependOps) {
      this.combChangeSetsOp(changesets, resource.id, prependOps);
    }
    let results;
    if (applyChangesets) {
      if (resource instanceof databus.Datasheet) {
        results = await this.applyDatasheetChangesets(resource.id, changesets, auth, internalFix);
      } else if (resource instanceof databus.Dashboard) {
        results = await this.applyDashboardChangesets(resource.id, changesets, auth);
      }
    }
    if (results) {
      results.forEach(cs => {
        store.dispatch(StoreActions.applyJOTOperations(cs.operations, cs.resourceType, cs.resourceId));
      });
    }
    return Promise.resolve(changesets);
  }

  private combChangeSetsOp(changeSets: ILocalChangeset[], dstId: string, updateFieldOperations: IOperation[]) {
    // If nothing is changed, changeSets is an empty array. There is nothing to do.
    if (!changeSets.length) {
      return;
    }
    const thisResourceChangeSet = changeSets.find(cs => cs.resourceId === dstId);
    if (updateFieldOperations && updateFieldOperations.length) {
      if (!thisResourceChangeSet) {
        // Why can't I find resources?
        this.logger.error('API_INFO', {
          changeSets,
          dstId,
          updateFieldOperations,
        });
        throw ApiException.tipError(ApiTipConstant.api_insert_error);
      }
      thisResourceChangeSet.operations = [...updateFieldOperations, ...thisResourceChangeSet.operations];
    }
  }

  /**
   * Call otServer to apply changesets to datasheet
   *
   * @param dstId         datasheet id
   * @param changesets    array of changesets
   * @param auth          authorization info (developer token)
   * @param internalFix   [optional] use when repairing data
   */
  private async applyDatasheetChangesets(
    dstId: string,
    changesets: ILocalChangeset[],
    auth: IAuthHeader,
    internalFix?: IInternalFix,
  ): Promise<IRemoteChangeset[]> {
    // this.logger.info('API:ApplyChangeSet');
    // const applyChangeSetProfiler = this.logger.startTimer();
    let applyAuth = auth;
    const message = {
      roomId: dstId,
      changesets,
      sourceType: SourceTypeEnum.OPEN_API,
    };
    if (internalFix) {
      if (internalFix.anonymouFix) {
        // Internal repair: anonymous repair
        message['internalAuth'] = { userId: null, uuid: null };
        applyAuth = { internal: true };
      } else if (internalFix.fixUser) {
        // Internal fix: Designated user
        message['internalAuth'] = pick(internalFix.fixUser, ['userId', 'uuid']);
        applyAuth = { internal: true };
      }
    }
    const changeResult = await this.otService.applyRoomChangeset(message, applyAuth);
    await this.changesetSourceService.batchCreateChangesetSource(changeResult, SourceTypeEnum.OPEN_API);
    // Notify Socket Service Broadcast
    await this.otService.nestRoomChange(dstId, changeResult);

    // applyChangeSetProfiler.done({
    //   message: `applyChangeSet ${dstId} profiler`,
    // });

    return changeResult;
  }

  async nestRoomChangeFromRust(roomId: string, data: IRemoteChangeset[]) {
    await this.otService.nestRoomChange(roomId, data);
  }

  private async applyDashboardChangesets(dsbId: string, changesets: ILocalChangeset[], auth: IAuthHeader) {
    const changeResult = await this.otService.applyChangesets(dsbId, changesets, auth);
    await this.changesetSourceService.batchCreateChangesetSource(changeResult, SourceTypeEnum.OPEN_API);
    // Notify Socket Service Broadcast
    await this.otService.nestRoomChange(dsbId, changeResult);
    return changeResult;
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

export interface IServerLoadDashboardPackOptions extends databus.ILoadDashboardPackOptions {
  auth: IAuthHeader;
}

export interface IServerDataLoadOptions {
  /**
   * If the data loader uses a datasheet pack cache to avoid loading the same datasheet pack repeatedly.
   */
  useCache?: boolean;
}

export interface IServerDataStorageProviderOptions {
  loadOptions: IServerDataLoadOptions;

  datasheetService: DatasheetService;
  dashboardService: DashboardService;
  redisService: RedisService;
  otService: OtService;
  changesetSourceService: DatasheetChangesetSourceService;
}

export interface IServerSaveOptions extends databus.ISaveOptions {
  /**
   * The operation that will be prepend to the changeset of the datasheet.
   */
  prependOps?: IOperation[];

  internalFix?: IInternalFix;

  /**
   * If this field is true, the changesets are saved into the database and the userId is returned in `result.saveResult`,
   * otherwise the changesets are simply returned in `result.saveResult` without saving. Defaults to true.
   */
  applyChangesets?: boolean;

  auth: IAuthHeader;
}

export interface IServerSaveOpsOptions extends IServerSaveOptions, databus.ISaveOpsOptions {
}
