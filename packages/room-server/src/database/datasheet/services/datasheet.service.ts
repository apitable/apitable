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
  EventAtomTypeEnums,
  EventRealTypeEnums,
  EventSourceTypeEnums,
  FieldType,
  IBaseDatasheetPack,
  IEventResourceMap,
  IFieldMap,
  IReduxState,
  IResourceRevision,
  IViewProperty,
  OPEventNameEnums,
  ResourceType,
  Selectors,
  transformOpFields,
} from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ButtonClickedEventContext } from 'automation/events/domains/button.clicked.event';
import { ButtonClickedListener } from 'automation/events/listeners/button.clicked.listener';
import { AutomationRobotRepository } from 'automation/repositories/automation.robot.repository';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationService } from 'automation/services/automation.service';
import { CommandService } from 'database/command/services/command.service';
import { MetaService } from 'database/resource/services/meta.service';
import { isEmpty } from 'lodash';
import { NodeService } from 'node/services/node.service';
import type { Store } from 'redux';
import { InjectLogger } from 'shared/common';
import { CommonException, DatasheetException, ServerException } from 'shared/exception';
import { getRecordUrl } from 'shared/helpers/env';
import type { IAuthHeader, IFetchDataOptions, IFetchDataOriginOptions, IFetchDataPackOptions, ILoadBasePackOptions } from 'shared/interfaces';
import { UserService } from 'user/services/user.service';
import { Logger } from 'winston';
import type { DatasheetPack, UnitInfo, UserInfo, ViewPack } from '../../interfaces';
import type { DatasheetEntity } from '../entities/datasheet.entity';
import { DatasheetRepository } from '../repositories/datasheet.repository';
import { DatasheetFieldHandler } from './datasheet.field.handler';
import { DatasheetMetaService } from './datasheet.meta.service';
import { DatasheetRecordService } from './datasheet.record.service';

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
    private readonly automationRobotRepository: AutomationRobotRepository,
    private readonly automationTriggerRepository: AutomationTriggerRepository,
    @Inject(forwardRef(() => ButtonClickedListener))
    private readonly buttonClickedListener: ButtonClickedListener,
    @Inject(forwardRef(() => AutomationService))
    private readonly automationService: AutomationService,
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
    const view = meta.views.find((view) => view.id === viewId);
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
    _allowNative: boolean,
    options?: IFetchDataPackOptions,
  ): Promise<DatasheetPack> {
    const beginTime = +new Date();
    this.logger.info(`Start loading ${source} data [${dstId}], origin: ${JSON.stringify(origin)}`);
    // Query datasheet
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(dstId, auth, origin);
    // Query snapshot
    const meta = options?.meta ?? (await this.datasheetMetaService.getMetaDataByDstId(dstId, options?.metadataException));
    const fetchDataPackProfiler = this.logger.startTimer();
    const recordMap = options?.recordIds
      ? await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(
        dstId,
        options?.recordIds,
        false,
        options.includeCommentCount,
        options.includeArchivedRecords,
      )
      : await this.datasheetRecordService.getRecordsByDstId(dstId, options?.includeCommentCount, options?.includeArchivedRecords);
    fetchDataPackProfiler.done({ message: `fetchDataPackProfiler ${dstId} done` });
    // Query foreignDatasheetMap and unitMap
    const { mainDstRecordMap, foreignDatasheetMap, units } = await this.datasheetFieldHandler.analyze(dstId, {
      auth: options?.isTemplate ? {} : auth,
      mainDstMeta: meta,
      mainDstRecordMap: recordMap,
      origin,
      needExtendMainDstRecords: Boolean(options?.needExtendMainDstRecords),
      linkedRecordMap: options?.isTemplate ? undefined : options?.linkedRecordMap,
    });
    const endTime = +new Date();
    this.logger.info(`Finished loading ${source} data, duration [${dstId}]: ${endTime - beginTime}ms`);
    return {
      snapshot: { meta, recordMap: mainDstRecordMap, datasheetId: node.id },
      datasheet: node,
      foreignDatasheetMap,
      units: units as (UserInfo | UnitInfo)[],
      fieldPermissionMap: options?.isTemplate ? undefined : fieldPermissionMap,
    };
  }

  async batchSave(records: any[]) {
    return await this.datasheetRepository.createQueryBuilder().insert().values(records).execute();
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
  fetchDataPack(dstId: string, auth: IAuthHeader, allowNative: boolean, options?: IFetchDataOptions): Promise<DatasheetPack> {
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
   */
  @Span()
  fetchShareDataPack(shareId: string, dstId: string, auth: IAuthHeader, allowNative: boolean): Promise<DatasheetPack> {
    const origin = { internal: false, main: true, shareId };
    return this.fetchCommonDataPack('share', dstId, auth, origin, allowNative, { isDatasheet: true });
  }

  /**
   * Fetch template datasheet data pack, with all linked datasheet data
   *
   * @param dstId datasheet ID
   * @param auth authorization
   */
  @Span()
  fetchTemplatePack(dstId: string, auth: IAuthHeader): Promise<DatasheetPack> {
    const origin = { internal: false, main: true };
    return this.fetchCommonDataPack('template', dstId, auth, origin, true, {
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

  fetchForeignDatasheetPackWithoutCheckPermission(dstId: string, auth: IAuthHeader, options?: IFetchDataOptions): Promise<DatasheetPack> {
    const origin: IFetchDataOriginOptions = { internal: false, main: true };
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
  ): Promise<DatasheetPack> {
    // Query datasheet meta
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId);
    // Check if datasheet has linked datasheet with foreighDatasheetId
    const isExist = Object.values(meta.fieldMap).some((field) => {
      if (field.type === FieldType.Link || field.type === FieldType.OneWayLink) {
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
    const { includeLink = true, includeCommentCount = false, ignoreDeleted = false, loadRecordMeta = false } = options;
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
            recordMap: await this.datasheetRecordService.getBaseRecordMap(id, includeCommentCount, ignoreDeleted, loadRecordMeta),
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
      const basePacks: IBaseDatasheetPack[] = await this.getBasePacks(dstId, options);
      if (options?.filterViewFilterInfo) {
        basePacks.forEach((pack) => pack.snapshot.meta.views.forEach((view: IViewProperty) => (view.filterInfo = undefined)));
      }
      packs.push(...basePacks);
    }
    const store = this.commandService.fillStore(packs);
    return this.commandService.setPageParam({ datasheetId: dstIds[0]! }, store);
  }

  private getAllLinkDstIdFromFieldMap(fieldMap: IFieldMap): Set<string> {
    const dstIds = new Set<string>();
    for (const fieldId in fieldMap) {
      const field = fieldMap[fieldId]!;
      if (field.type === FieldType.Link || field.type === FieldType.OneWayLink) {
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
      const recordMap = await this.datasheetRecordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);

      // Query foreignDatasheetMap and unitMap
      const origin = { internal: true, main: true };
      const { mainDstRecordMap, foreignDatasheetMap, units } = await this.datasheetFieldHandler.analyze(dstId, {
        auth: {},
        mainDstMeta: meta,
        mainDstRecordMap: recordMap,
        origin,
        needExtendMainDstRecords: true,
        withoutPermission: true,
      });
      basePacks.push({
        datasheet: datasheet as any,
        snapshot: {
          meta,
          recordMap: mainDstRecordMap,
          datasheetId: datasheet.id,
        },
        foreignDatasheetMap: foreignDatasheetMap,
        units: units as (UserInfo | UnitInfo)[],
      });
    }

    tinyBasePacksProfiler.done({
      message: `getTinyBasePacks end [${dstIds}]`,
    });

    return basePacks;
  }

  async selectRevisionByDstIds(dstIds: string[]): Promise<IResourceRevision[]> {
    return await this.datasheetRepository.selectRevisionByDstIds(dstIds);
  }

  async getRevisionByDstId(dstId: string): Promise<DatasheetEntity | undefined> {
    return await this.datasheetRepository.selectRevisionByDstId(dstId);
  }

  async triggerAutomation(automationId: string, triggerId: string, datasheetId: string, recordId: string, userId: string) {
    const hasRobots = await this.automationRobotRepository.isResourcesHasRobots([automationId]);
    if (!hasRobots) {
      throw new ServerException(CommonException.AUTOMATION_NOT_ACTIVE);
    }
    const trigger = await this.automationTriggerRepository.selectTriggerByTriggerId(triggerId);
    if (!trigger) {
      throw new ServerException(CommonException.AUTOMATION_TRIGGER_NOT_EXIST);
    }
    if (!trigger.input) {
      throw new ServerException(CommonException.AUTOMATION_TRIGGER_INVALID);
    }
    const datasheetName = await this.nodeService.getNameByNodeId(datasheetId);
    const spaceId = await this.nodeService.getSpaceIdByNodeId(datasheetId);
    const clickedBy = await this.userService.getUserMemberName(userId, spaceId);
    const resourceMap = new Map<string, string[]>();
    resourceMap.set(datasheetId, [recordId]);
    const dataPack = await this.getTinyBasePacks(resourceMap);
    const store = this.commandService.fillTinyStore(dataPack);
    const thisRecord = Selectors.getRecord(store.getState(), recordId, datasheetId);
    const { eventFields } = transformOpFields({
      recordData: thisRecord!.data,
      state: store.getState(),
      datasheetId,
      recordId,
    });
    const eventContext = {
      // Flattened new structure
      triggerId: triggerId,
      datasheetId,
      datasheetName,
      recordId,
      clickedBy,
      recordUrl: getRecordUrl(datasheetId, recordId),
      ...eventFields,
    } as ButtonClickedEventContext;
    const taskId = await this.buttonClickedListener.handleButtonClickedEvent({
      eventName: OPEventNameEnums.FormSubmitted,
      scope: ResourceType.Form,
      realType: EventRealTypeEnums.REAL,
      atomType: EventAtomTypeEnums.ATOM,
      sourceType: EventSourceTypeEnums.ALL,
      context: eventContext,
      beforeApply: false,
    });
    return {
      taskId,
      message: await this.automationService.analysisStatus(taskId),
    };
  }
}
