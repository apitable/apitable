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
  FieldType,
  IBaseDatasheetPack,
  IDatasheetUnits,
  IEventResourceMap,
  IFieldMap,
  IForeignDatasheetMap,
  IMeta,
  IRecordMap,
  IReduxState,
  IResourceRevision,
} from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { DatasheetEntity } from '../entities/datasheet.entity';
import { CommandService } from 'database/command/services/command.service';
import { isEmpty } from 'lodash';
import type { Store } from 'redux';
import { InjectLogger, USE_NATIVE_MODULE } from 'shared/common';
import { DatasheetException, ServerException } from 'shared/exception';
import type {
  IAuthHeader,
  IFetchDataOptions,
  IFetchDataOriginOptions,
  IFetchDataPackOptions,
  ILinkedRecordMap,
  ILoadBasePackOptions,
} from 'shared/interfaces';
import { Logger } from 'winston';
import type { DatasheetPack, UnitInfo, UserInfo, ViewPack } from '../../interfaces';
import { DatasheetRepository } from '../repositories/datasheet.repository';
import { NodeService } from 'node/services/node.service';
import { UserService } from '../../../user/services/user.service';
import { DatasheetFieldHandler } from './datasheet.field.handler';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';
import { MetaService } from 'database/resource/services/meta.service';
import type { DatasheetPackResponse } from '@apitable/room-native-api';
import { NativeService } from 'shared/services/native/native.service';

@Injectable()
export class DatasheetService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordService: DatasheetRecordService,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly datasheetFieldHandler: DatasheetFieldHandler,
    @Inject(forwardRef(() => NodeService))
    private readonly nodeService: NodeService,
    private readonly commandService: CommandService,
    @Inject(forwardRef(() => MetaService))
    private readonly resourceMetaService: MetaService,
    private readonly nativeService: NativeService,
  ) {}

  /**
   * Obtain datasheet info, throw exception if not exist
   *
   * @param datasheetId datasheet ID
   * @param throwError if throw error when datasheet not exist
   * @return Promise<DatasheetEntity>
   * @date 2020/8/5 12:04 PM
   */
  public async getDatasheet(datasheetId: string, throwError?: boolean): Promise<DatasheetEntity | undefined> {
    const entity = await this.datasheetRepository.selectById(datasheetId);
    if (!entity && throwError) {
      throw new ServerException(DatasheetException.NOT_EXIST);
    }
    return entity;
  }

  @Span()
  async fetchViewPack(dstId: string, viewId: string): Promise<ViewPack> {
    // Query metadata of datasheet
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // Check if datasheet has view with viewId
    const view = meta.views.find(view => view.id === viewId);
    if (!view) {
      throw new ServerException(DatasheetException.VIEW_NOT_EXIST);
    }
    const revision = await this.resourceMetaService.getRevisionByDstId(dstId);
    return { view, revision: revision! };
  }

  async fetchCommonDataPack(
    source: string,
    dstId: string,
    auth: IAuthHeader,
    origin: IFetchDataOriginOptions,
    allowNative: boolean,
    options?: IFetchDataPackOptions,
  ): Promise<DatasheetPack | DatasheetPackResponse> {
    if (USE_NATIVE_MODULE && allowNative) {
      return this.nativeService.fetchDataPackResponse(source, dstId, auth, origin, options);
    }

    const beginTime = +new Date();
    this.logger.info(`Start loading ${source} data [${dstId}], origin: ${JSON.stringify(origin)}`);
    // Query datasheet
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    // Query snapshot
    const meta = options?.meta ?? await this.datasheetMetaService.getMetaDataByDstId(dstId, options?.metadataException);
    const fetchDataPackProfiler = this.logger.startTimer();
    const recordMap = options?.recordIds
      ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, options?.recordIds)
      : await this.datasheetRecordService.getRecordsByDstId(dstId);
    fetchDataPackProfiler.done({ message: `fetchDataPackProfiler ${dstId} done` });
    // Query foreignDatasheetMap and unitMap
    const combine = await this.processField(
      dstId,
      options?.isTemplate ? {} : auth,
      meta,
      recordMap,
      origin,
      options?.isTemplate ? undefined : options?.linkedRecordMap,
    );
    const endTime = +new Date();
    this.logger.info(`Finished loading ${source} data, duration [${dstId}]: ${endTime - beginTime}ms`);
    return {
      snapshot: { meta, recordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap: combine.foreignDatasheetMap,
      units: combine.units as (UserInfo | UnitInfo)[],
      fieldPermissionMap: options?.isTemplate ? undefined : fieldPermissionMap,
    };
  }

  /**
   * Obtain datasheet data pack, with all linked datasheet data
   *
   * @param dstId datasheet ID
   * @param auth authorization
   * @param allowNative if false, always return `DatasheetPack`.
   * @param options query parameters
   */
  @Span()
  fetchDataPack(dstId: string, auth: IAuthHeader, allowNative: boolean, options?: IFetchDataOptions): Promise<DatasheetPack | DatasheetPackResponse> {
    const origin: IFetchDataOriginOptions = { internal: true, main: true };
    return this.fetchCommonDataPack('datasheet', dstId, auth, origin, allowNative, { ...options, isDatasheet: true });
  }

  /**
   * Fetch share datasheet data pack, with all linked datasheet data
   *
   * @param shareId share ID
   * @param dstId datasheet ID
   * @param auth authorization
   * @param allowNative if false, always return `DatasheetPack`.
   * @param options query parameters
   */
  @Span()
  fetchShareDataPack(
    shareId: string,
    dstId: string,
    auth: IAuthHeader,
    allowNative: boolean,
    options?: IFetchDataOptions,
  ): Promise<DatasheetPack | DatasheetPackResponse> {
    const origin = { internal: false, main: true, shareId };
    return this.fetchCommonDataPack('share', dstId, auth, origin, allowNative, { ...options, isDatasheet: true });
  }

  /**
   * Fetch template datasheet data pack, with all linked datasheet data
   *
   * @param dstId datasheet ID
   * @param auth authorization
   * @param options query parameters
   */
  @Span()
  fetchTemplatePack(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions): Promise<DatasheetPack | DatasheetPackResponse> {
    const origin = { internal: false, main: true };
    return this.fetchCommonDataPack('template', dstId, auth, origin, true, {
      ...options,
      isTemplate: true,
    });
  }

  /**
   * When submitting form, fetch linked datasheet data pack of form.
   * Only loads necessary data.
   *
   * @param dstId datasheet ID
   * @param auth authorization
   * @param options query parameters
   */
  fetchSubmitFormForeignDatasheetPack(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions, shareId?: string): Promise<DatasheetPack> {
    const origin: IFetchDataOriginOptions = shareId ? { internal: false, main: true, shareId } : { internal: true, main: true, form: true };
    return this.fetchCommonDataPack('form linked datasheet', dstId, auth, origin, false, {
      ...options,
      recordIds: options?.recordIds ?? [],
    }) as Promise<DatasheetPack>;
  }

  /**
   * Fetch linked datasheet data pack.
   * Only loads field data related to primary field if no permission for linked datasheet,
   * so as to make sure not influence permission when user visits linked datasheet
   *
   * @param dstId datasheet ID
   * @param foreignDatasheetId linked datasheet ID
   * @param auth authorization
   * @param allowNative if false, always return `DatasheetPack`.
   * @param shareId sharing ID
   */
  async fetchForeignDatasheetPack(
    dstId: string,
    foreignDatasheetId: string,
    auth: IAuthHeader,
    allowNative: boolean,
    shareId?: string,
  ): Promise<DatasheetPack | DatasheetPackResponse> {
    // Query datasheet meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // Check if datasheet has linked datasheet with foreighDatasheetId
    const isExist = Object.values(meta.fieldMap).some(field => {
      if (field.type === FieldType.Link) {
        return field.property.foreignDatasheetId === foreignDatasheetId;
      }
      return false;
    });
    if (!isExist) {
      throw new ServerException(DatasheetException.FOREIGN_DATASHEET_NOT_EXIST);
    }

    const origin = { internal: shareId ? false : true, main: false, shareId };
    return this.fetchCommonDataPack('linked datasheet', foreignDatasheetId, auth, origin, allowNative, {
      metadataException: DatasheetException.FOREIGN_DATASHEET_NOT_EXIST,
      isDatasheet: true,
    });
  }

  /**
   * Process special fields (link, lookup, and formula), ignoring other fields
   *
   * @param mainDstId main datasheet ID
   * @param auth authorization
   * @param mainMeta datasheet field data
   * @param mainRecordMap datasheet record data
   * @param origin query parameters
   * @param linkedRecordMap Specifies records to be queried in linked datasheet
   */
  @Span()
  private processField(
    mainDstId: string,
    auth: IAuthHeader,
    mainMeta: IMeta,
    mainRecordMap: IRecordMap,
    origin: IFetchDataOriginOptions,
    linkedRecordMap?: ILinkedRecordMap,
    withoutPermission?: boolean,
  ): Promise<IForeignDatasheetMap & IDatasheetUnits> {
    return this.datasheetFieldHandler.parse(mainDstId, auth, mainMeta, mainRecordMap, origin, linkedRecordMap, withoutPermission);
  }

  async fetchUsers(nodeId: string, uuids: string[]): Promise<any[]> {
    // Get the space id the node is in
    const spaceId = await this.nodeService.getSpaceIdByNodeId(nodeId);
    if (!spaceId) {
      throw new ServerException(DatasheetException.NOT_EXIST);
    }
    return await this.userService.getUserInfo(spaceId, uuids);
  }

  /**
   * Fetch datasheet data pack, not including linked datasheet data
   *
   * **NOTE** the first element of the returned datasheet pack array is always the datasheet specified by `dstId`.
   *
   * @param dstId datasheet ID
   * @return  Promise<IBaseDatasheetPack[]>
   */
  async getBasePacks(dstId: string, options: ILoadBasePackOptions = {}): Promise<IBaseDatasheetPack[]> {
    const { includeLink = true, includeCommentCount = false, ignoreDeleted = false } = options;
    // TODO optimize recordMap query with cursors
    // Query snapshot
    const basePacks: IBaseDatasheetPack[] = [];
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, undefined, ignoreDeleted);
    const dstIdSet = includeLink ? this.getAllLinkDstIdFromFieldMap(meta.fieldMap) : new Set<string>();
    const dstIdArray = Array.from(dstIdSet);
    const metaMap = dstIdArray.length ? await this.datasheetMetaService.getMetaMapByDstIds(dstIdArray, ignoreDeleted) : {};
    if (!dstIdSet.has(dstId)) dstIdArray.unshift(dstId);
    const datasheetMap = await this.getBaseInfoMap(dstIdArray, ignoreDeleted);
    if (!datasheetMap) {
      return basePacks;
    }
    for (const id of dstIdArray) {
      if (datasheetMap[id]) {
        basePacks.push({
          datasheet: datasheetMap[id] as any,
          snapshot: {
            meta: metaMap[id] ?? meta,
            // TODO avoid loading record for field APIs in fusion API
            recordMap: await this.datasheetRecordService.getBaseRecordMap(id, includeCommentCount, ignoreDeleted),
            datasheetId: datasheetMap[id]!.id,
          },
        });
      }
    }
    return basePacks;
  }

  /**
   *
   * @param dstIds datasheet ID
   * @return Promise<Store<IReduxState>>
   * @author Zoe Zheng
   * @date 2021/4/1 2:41 PM
   */
  async fillBaseSnapshotStoreByDstIds(dstIds: string[], options?: ILoadBasePackOptions): Promise<Store<IReduxState>> {
    const packs: IBaseDatasheetPack[] = [];
    for (const dstId of dstIds) {
      const basePack = await this.getBasePacks(dstId, options);
      packs.push(...basePack);
    }
    const store = this.commandService.fillStore(packs);
    return this.commandService.setPageParam({ datasheetId: dstIds[0]! }, store);
  }

  private getAllLinkDstIdFromFieldMap(fieldMap: IFieldMap): Set<string> {
    const dstIds = new Set<string>();
    for (const fieldId in fieldMap) {
      const field = fieldMap[fieldId]!;
      if (field.type === FieldType.Link) {
        dstIds.add(field.property.foreignDatasheetId);
      }
    }
    return dstIds;
  }

  /**
   * Fetch datasheet base info map
   *
   * @param dstIds datasheet IDs
   * @param ignoreDeleted if deleted flag is ignored
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 4:16 PM
   */
  async getBaseInfoMap(dstIds: string[], ignoreDeleted = false): Promise<{ [dstId: string]: { id: string; name: string; revision: number } }> {
    const datasheets = ignoreDeleted
      ? await this.datasheetRepository.selectBaseInfoByDstIdsIgnoreDeleted(dstIds)
      : await this.datasheetRepository.selectBaseInfoByDstIds(dstIds);
    return datasheets.reduce<{ [dstId: string]: { id: string; name: string; revision: number } }>((pre, cur) => {
      pre[cur.id] = {
        id: cur.id,
        name: cur.name,
        revision: Number(cur.revision),
      };
      return pre;
    }, {});
  }

  /**
   * Fetch partial datasheet data pack, including meta and recordMap
   * + Needs linked datasheet data
   * + Needs member info
   */
  async getTinyBasePacks(resourceMap: IEventResourceMap): Promise<IBaseDatasheetPack[]> {
    const dstIds = [...resourceMap.keys()];
    this.logger.info(`getTinyBasePacks start [${dstIds}]`, dstIds);
    const tinyBasePacksProfiler = this.logger.startTimer();
    const basePacks: DatasheetPack[] = [];
    if (isEmpty(dstIds)) {
      return basePacks;
    }
    const datasheetBaseInfoMap = await this.getBaseInfoMap(dstIds);
    this.logger.info('getTinyBasePacks', datasheetBaseInfoMap);
    const metaMap = await this.datasheetMetaService.getMetaMapByDstIds(dstIds);

    for (const dstId of dstIds) {
      const datasheet = datasheetBaseInfoMap[dstId]!;
      const meta = metaMap[dstId]!;
      // Influenced recordsIds of the events
      const recordIds = resourceMap.get(dstId)!;
      // recordMap of current datasheet
      let recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);

      // Check if self-linking exists, if so, extend recordIds
      const fieldMap = meta.fieldMap;
      const exRecordIds: string[] = [];
      Object.keys(fieldMap).forEach(fieldId => {
        if (fieldMap[fieldId]!.type == FieldType.Link) {
          const linkDstId = fieldMap[fieldId]!.property.foreignDatasheetId;
          if (dstId === linkDstId) {
            Object.keys(recordMap).forEach(recordId => {
              const cellRecordIds = (recordMap[recordId]!.data[fieldId] as string[]) || [];
              exRecordIds.push(...cellRecordIds);
            });
          }
        }
      });
      // Compute difference of exRecordIds and recordIds
      const exRecordIdsSet = new Set(exRecordIds);
      const recordIdsSet = new Set(recordIds);
      const diffRecordIds = [...exRecordIdsSet].filter(recordId => !recordIdsSet.has(recordId));
      const diffRecordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, diffRecordIds);
      recordMap = { ...recordMap, ...diffRecordMap };

      // Query foreignDatasheetMap and unitMap
      const linkedRecordMap = this.getLinkedRecordMap(dstId, meta, recordMap);
      const origin = { internal: true, main: true };
      const combine = await this.processField(dstId, {}, meta, recordMap, origin, linkedRecordMap, true);
      basePacks.push({
        datasheet: datasheet as any,
        snapshot: {
          meta,
          recordMap,
          datasheetId: datasheet.id,
        },
        foreignDatasheetMap: combine.foreignDatasheetMap,
        units: combine.units as (UserInfo | UnitInfo)[],
      });
    }

    tinyBasePacksProfiler.done({
      message: `getTinyBasePacks end [${dstIds}]`,
    });

    return basePacks;
  }

  /**
   * Get linked record data with meta and recordMap
   */
  getLinkedRecordMap(dstId: string, meta: IMeta, recordMap: IRecordMap): ILinkedRecordMap {
    const recordIds: string[] = Object.keys(recordMap);
    // Collect record IDs that need loading from corresponding datasheets by linked datasheet IDs
    const linkedRecordMap: ILinkedRecordMap = {};
    const foreignDatasheetIdMap = Object.values(meta.fieldMap)
      .filter(field => field.type === FieldType.Link)
      .map(field => {
        const foreignDatasheetId = field.property?.foreignDatasheetId;
        // Filter out self-linking
        if (!foreignDatasheetId || foreignDatasheetId === dstId) return null;
        return {
          fieldId: field.id,
          foreignDatasheetId,
        };
      })
      .filter(Boolean);

    foreignDatasheetIdMap.forEach(item => {
      const { foreignDatasheetId, fieldId } = item!;
      const linkedRecordIds = recordIds.reduce<string[]>((pre, cur) => {
        const cellLinkedIds = (recordMap[cur]!.data[fieldId] as string[]) || [];
        pre.push(...cellLinkedIds);
        return pre;
      }, []);
      // The current datasheet may links to the same datasheet many times.
      if (linkedRecordMap.hasOwnProperty(foreignDatasheetId)) {
        linkedRecordMap[foreignDatasheetId]!.push(...linkedRecordIds);
      } else {
        // Collect all record IDs of this link field
        linkedRecordMap[foreignDatasheetId] = linkedRecordIds;
      }
    });
    // Remove duplicates
    for (const key in linkedRecordMap) {
      linkedRecordMap[key] = [...new Set(linkedRecordMap[key])];
    }
    return linkedRecordMap;
  }

  async selectRevisionByDstIds(dstIds: string[]): Promise<IResourceRevision[]> {
    return await this.datasheetRepository.selectRevisionByDstIds(dstIds);
  }

  async selectRevisionByDstId(dstId: string): Promise<DatasheetEntity | undefined> {
    return await this.datasheetRepository.selectRevisionByDstId(dstId);
  }
}
