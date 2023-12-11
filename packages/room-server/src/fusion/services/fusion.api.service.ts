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
  CacheManager,
  CellFormatEnum,
  Conversion,
  databus,
  ExecuteResult,
  FieldKeyEnum,
  FieldType,
  getViewTypeString,
  IAddFieldOptions,
  ICollaCommandOptions,
  IDeleteFieldData,
  IFieldMap,
  IInternalFix,
  ILocalChangeset,
  IMeta,
  IOperation,
  IReduxState,
  IServerDatasheetPack,
  ISortedField,
  IViewRow,
  NoticeTemplatesConstant,
  Selectors,
  IRemoteChangeset,
} from '@apitable/core';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetRecordSourceService } from 'database/datasheet/services/datasheet.record.source.service';
import { FastifyRequest } from 'fastify';
import { ApiRecordDto } from 'fusion/dtos/api.record.dto';
import { DataBusService } from 'fusion/services/databus/databus.service';
import { FusionApiRecordService } from 'fusion/services/fusion.api.record.service';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { keyBy } from 'lodash';
import { Store } from 'redux';
import {
  CommonStatusCode,
  DATASHEET_ENRICH_SELECT_FIELD,
  DATASHEET_LINKED,
  DATASHEET_META_HTTP_DECORATE,
  EnvConfigKey,
  InjectLogger,
  SPACE_ID_HTTP_DECORATE,
  USER_HTTP_DECORATE,
} from 'shared/common';
import { OrderEnum } from 'shared/enums';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { ApiException, DatasheetException, ServerException } from 'shared/exception';
import {IAuthHeader, ILinkedRecordMap, IOssConfig, IServerConfig} from 'shared/interfaces';
import { IAPINode, IAPINodeDetail } from 'shared/interfaces/node.interface';
import { IAPISpace } from 'shared/interfaces/space.interface';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { RestService } from 'shared/services/rest/rest.service';
import { UserService } from 'user/services/user.service';
import { Logger } from 'winston';
import { DatasheetViewDto } from '../dtos/datasheet.view.dto';
import { FusionApiFilter } from '../filter/fusion.api.filter';
import { DatasheetCreateRo } from '../ros/datasheet.create.ro';
import { FieldCreateRo } from '../ros/field.create.ro';
import { FieldQueryRo } from '../ros/field.query.ro';
import { RecordCreateRo } from '../ros/record.create.ro';
import { RecordQueryRo } from '../ros/record.query.ro';
import { RecordUpdateRo } from '../ros/record.update.ro';
import { DatasheetCreateDto, FieldCreateDto } from '../vos/datasheet.create.vo';
import { ListVo } from '../vos/list.vo';
import { PageVo } from '../vos/page.vo';
import { IServerSaveOptions } from './databus/server.data.storage.provider';

@Injectable()
export class FusionApiService {
  constructor(
    private readonly userService: UserService,
    private readonly datasheetRecordSourceService: DatasheetRecordSourceService,
    private readonly metaService: DatasheetMetaService,
    private readonly filter: FusionApiFilter,
    private readonly transform: FusionApiTransformer,
    private readonly fusionApiRecordService: FusionApiRecordService,
    private readonly commandService: CommandService,
    private readonly restService: RestService,
    private readonly envConfigService: EnvConfigService,
    private readonly databusService: DataBusService,
    @InjectLogger() private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {
  }

  public async getSpaceList(): Promise<IAPISpace[]> {
    const authHeader = { token: this.request.headers.authorization };
    const spaceList = await this.restService.getSpaceList(authHeader);
    return this.transform.spaceListVoTransform(spaceList);
  }

  /**
   * Query the list of space station level 1 document nodes
   *
   * @param spaceId space id
   */
  public async getNodeList(spaceId: string): Promise<IAPINode[]> {
    const authHeader = { token: this.request.headers.authorization };
    const nodeList = await this.restService.getNodeList(authHeader, spaceId);
    if (!nodeList) {
      return [];
    }
    return this.transform.nodeListVoTransform(nodeList);
  }

  public async getNodeDetail(nodeId: string): Promise<IAPINodeDetail> {
    const authHeader = { token: this.request.headers.authorization };
    const nodeDetail = await this.restService.getNodeDetail(authHeader, nodeId);
    return this.transform.nodeDetailVoTransform(nodeDetail);
  }

  public async getViewList(dstId: string): Promise<DatasheetViewDto[] | undefined> {
    const dstMeta = await this.metaService.getMetaDataMaybeNull(dstId);
    return dstMeta?.views.map((view) => ({
      id: view.id,
      name: view.name,
      type: getViewTypeString(view.type),
    }));
  }

  /**
   * Query all fields of a datasheet
   *
   * @param dstId datasheet id
   * @param query query criteria
   */
  public async getFieldList(dstId: string, query: FieldQueryRo): Promise<databus.Field[]> {
    const profiler = this.logger.startTimer();
    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth: { token: this.request.headers.authorization },
        recordIds: [],
        includeCommentCount: false,
      },
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    profiler.done({ message: `getFieldListBuildDataPack ${dstId} done` });

    const view = await datasheet.getView({
      getViewInfo: (state) => {
        const datasheet = Selectors.getDatasheet(state, dstId);
        const snapshot = Selectors.getSnapshot(state, dstId)!;
        const fieldPermissionMap = Selectors.getFieldPermissionMap(state, dstId);
        // The fieldMap after permission processing
        const fieldMap = Selectors.getFieldMapBase(datasheet, fieldPermissionMap)!;

        const { viewId } = query;
        if (viewId) {
          const view = Selectors.getViewById(snapshot, viewId);
          if (!view) {
            return null;
          }

          return {
            property: {
              ...view,
              rows: [],
            },
            fieldMap,
          };
        }

        // When no view ID is specified, the full list of fields is returned in the order of the first view, regardless of the field display.
        const firstView = snapshot.meta.views[0]!;
        return {
          property: {
            ...firstView,
            rows: [],
          },
          fieldMap,
        };
      },
    });
    if (view === null) {
      throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId: query.viewId });
    }

    const fields = await view.getFields({
      includeHidden: !query.viewId,
    });

    return fields;
  }

  /**
   * Query datasheet records
   *
   * @param dstId datasheet id
   * @param query query criteria
   * @param auth  authorization inf
   */
  public async getRecords(dstId: string, query: RecordQueryRo, auth: IAuthHeader): Promise<PageVo> {
    const getRecordsProfiler = this.logger.startTimer();

    const meta = this.request[DATASHEET_META_HTTP_DECORATE] as IMeta;

    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth,
        meta,
        needExtendMainDstRecords: Boolean(query.recordIds),
        recordIds: query.recordIds,
      },
      createStore: async(dst) => {
        const userInfo = await this.userService.getUserInfoBySpaceId(auth, dst.datasheet.spaceId);
        return this.commandService.fullFillStore(dst, userInfo);
      },
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const getViewProfiler = this.logger.startTimer();

    const view = await datasheet.getView({
      getViewInfo: async(state) => {
        const snapshot = Selectors.getSnapshot(state, datasheet.id);
        if (!snapshot) {
          return null;
        }

        const sortRules: ISortedField[] = [];
        // sort with desc in front
        if (query.sort) {
          query.sort.forEach((sort) => {
            sortRules.push({ fieldId: sort.field, desc: sort.order === OrderEnum.DESC });
          });
        }

        /*
         * Query the records of a specific view with the current user in the view's filter criteria.
         * fullFillStore needs to be populated with user information.
         */
        const view = this.transform.getViewInfo({
          recordIds: query.recordIds,
          viewId: query.viewId || undefined,
          sortRules,
          snapshot,
          state,
        });

        const rows = await this.filter.getVisibleRows(query.filterByFormula || undefined, view, state);
        if (rows.length === 0) {
          return {
            property: {
              ...view,
              rows: [],
              columns: [],
            },
            fieldMap: {},
          };
        }

        // Get the columns needed for the results
        const fieldMap = this.filter.fieldMapFilter(snapshot.meta.fieldMap, query.fieldKey, query.fields);

        return {
          property: {
            ...view,
            rows,
          },
          fieldMap,
        };
      },
    });
    if (view === null) {
      // TODO throw exception
      return {
        total: 0,
        records: [],
        pageNum: query.pageNum,
        pageSize: 0,
      };
    }

    getViewProfiler.done({
      message: `getRecords:getView ${dstId} profiler`,
    });

    const maxRecords = query.maxRecords && query.maxRecords < view.rows.length ? query.maxRecords : view.rows.length;

    const records = await view.getRecords({
      maxRecords,
      pagination: {
        pageNum: query.pageNum,
        pageSize: query.pageSize,
      },
    });

    const recordVos = await this.getRecordViewObjects(records, query.cellFormat);


    getRecordsProfiler.done({
      message: `getRecords ${dstId} profiler`,
    });

    return {
      total: maxRecords,
      records: recordVos,
      pageNum: query.pageNum,
      pageSize: records.length,
    };
  }


  /**
   * Query datasheet records have deleted
   *
   * @param dstId datasheet id
   */
  public async getDeletedRecords(dstId: string): Promise<string[]> {
    return this.fusionApiRecordService.getDeletedRecordsByDstId(dstId);
  }

  public async getFieldCreateDtos(datasheetId: string): Promise<FieldCreateDto[]> {
    const meta: IMeta = await this.metaService.getMetaDataByDstId(datasheetId);
    return Object.keys(meta.fieldMap).map((fieldId) => {
      return { id: fieldId, name: meta.fieldMap[fieldId]!.name };
    });
  }

  public async addField(datasheetId: string, fieldCreateRo: FieldCreateRo): Promise<FieldCreateDto> {
    const auth: IAuthHeader = { token: this.request.headers.authorization };
    const foreignDatasheetId = fieldCreateRo.foreignDatasheetId();
    const datasheet = await this.databusService.getDatasheet(datasheetId, {
      loadOptions: {
        auth,
        loadBasePacks: {
          foreignDstIds: foreignDatasheetId ? [foreignDatasheetId] : [],
        },
      },
      createStore: (dst) => this.createStoreForBaseDstPacks(dst),
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const commandData = fieldCreateRo.transferToCommandData();
    const fieldId = await this.addDatasheetField(datasheet, commandData, auth);

    return { id: fieldId, name: fieldCreateRo.name };
  }

  private createStoreForBaseDstPacks(dst: IServerDatasheetPack): Store<IReduxState> {
    const packs = Object.values(dst.foreignDatasheetMap ?? {});
    packs.unshift(dst);
    const store = this.commandService.fillStore(packs);
    return this.commandService.setPageParam({ datasheetId: dst.datasheet.id }, store);
  }

  public async deleteField(datasheetId: string, fieldId: string, conversion?: Conversion) {
    const auth = { token: this.request.headers.authorization };
    const datasheet = await this.databusService.getDatasheet(datasheetId, {
      loadOptions: {
        auth,
        loadBasePacks: {
          foreignDstIds: [],
          options: {
            loadRecordMeta: true
          }
        },
      },
      createStore: (dst) => this.createStoreForBaseDstPacks(dst),
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const result = await datasheet.deleteFields(
      [
        {
          deleteBrotherField: conversion === Conversion.Delete,
          fieldId,
        },
      ],
      { auth } as IServerSaveOptions,
    );
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_delete_error);
    }
  }

  public async addDatasheetFields(dstId: string, datasheetCreateRo: DatasheetCreateRo): Promise<DatasheetCreateDto> {
    const auth = { token: this.request.headers.authorization };
    const foreignDatasheetIds = datasheetCreateRo.foreignDatasheetIds();
    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth,
        loadBasePacks: {
          foreignDstIds: foreignDatasheetIds,
        },
      },
      createStore: (dst) => this.createStoreForBaseDstPacks(dst),
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const defaultFields = Object.values(datasheet.fields).map((field) => ({ fieldId: field.id }));
    const commandDatas = datasheetCreateRo.transferToCommandData();
    const fields = [];
    for (const commandData of commandDatas) {
      const fieldId = await this.addDatasheetField(datasheet, commandData, auth);
      fields.push({ id: fieldId, name: commandData.data.name });
    }

    await this.deleteDefaultFields(datasheet, defaultFields, auth);

    return { id: dstId, createdAt: undefined as any, fields };
  }

  /**
   * Update Records
   *
   * @param dstId   datasheet id
   * @param body    update recorded data
   * @param viewId  view id
   */
  public async updateRecords(dstId: string, body: RecordUpdateRo, viewId: string): Promise<ListVo> {
    // Validate the existence in advance to prevent repeatedly swiping all the count table data
    const updateRecordsProfiler = this.logger.startTimer();
    await this.fusionApiRecordService.validateArchivedRecordIncludes(dstId, body.getRecordIds(), ApiTipConstant.api_param_record_archived);
    await this.fusionApiRecordService.validateRecordExists(dstId, body.getRecordIds(), ApiTipConstant.api_param_record_not_exists);

    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const fieldMap = body.fieldKey === FieldKeyEnum.NAME ? keyBy(meta.fieldMap, 'name') : meta.fieldMap;

    // Convert a field to get the modified column
    const linkDatasheet: ILinkedRecordMap = this.request[DATASHEET_LINKED];
    const recordIdSet: Set<string> = new Set(body.records.map((record) => record.recordId));
    const linkedRecordMap = Object.keys(linkDatasheet).length ? linkDatasheet : undefined;
    linkedRecordMap &&
    linkedRecordMap[dstId]?.forEach((recordId) => {
      recordIdSet.add(recordId);
    });
    const recordIds = Array.from(recordIdSet);
    const rows: IViewRow[] = recordIds.map((recordId) => {
      return { recordId };
    });
    const auth = { token: this.request.headers.authorization };

    const permissionValidationProfiler = this.logger.startTimer();
    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth,
        // meta,
        recordIds,
        linkedRecordMap,
        includeCommentCount: false
      },
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    if (viewId) {
      await this.checkViewExists(datasheet, viewId);
    }

    const updateFieldOperations = await this.getFieldUpdateOps(datasheet, auth);
    const result = await datasheet.updateRecords(this.transform.getUpdateCellOptions(body.records), {
      auth,
      prependOps: updateFieldOperations,
    } as IServerSaveOptions);
    permissionValidationProfiler.done({ message: `update ${dstId}'s records permission validation profiler, result: ${result.result}` });

    // No change required
    if (result.result === ExecuteResult.None) {
      // TODO return records in viewId instead of first view
      const firstView = meta.views[0]!;
      const view = await datasheet.getView({
        getViewInfo: () => ({
          property: {
            ...firstView,
            rows,
          },
          fieldMap,
        }),
      });
      if (view === null) {
        // TODO throw exception
        return { records: [] };
      }

      const records = await view.getRecords({});
      const recordViewObjects = await this.getRecordViewObjects(records);
      updateRecordsProfiler.done({ message: `update ${dstId}'s records profiler, records count: ${records.length}` });
      return {
        records: recordViewObjects,
      };
    }

    // Command execution failed
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_update_error);
    }
    // success doesn't mean that all records are updated successfully, could be partial success
    // such as the field type is changed while updating, the value may be invalid
    // so we need to reload the record map to get the correct value
    const recordMap = await this.fusionApiRecordService.getBasicRecordsByRecordIds(dstId, recordIds);
    await datasheet.resetRecords(recordMap, { auth, applyChangesets: false });

    CacheManager.clear();

    const recordViewObjects = this.getNewRecordListVo(datasheet, { viewId, rows, fieldMap });
    updateRecordsProfiler.done({ message: `update ${dstId}'s records profiler, records count: ${rows.length}` });
    return recordViewObjects;
  }

  private async getNewRecordListVo(
    newDatasheet: databus.Datasheet,
    options: { viewId?: string; rows: IViewRow[]; fieldMap: IFieldMap },
  ): Promise<ListVo> {
    const { viewId, rows, fieldMap } = options;
    let newView: databus.View | null;
    if (viewId) {
      newView = await newDatasheet.getView({
        getViewInfo: (state) => {
          const view = Selectors.getViewById(Selectors.getSnapshot(state, newDatasheet.id)!, viewId)!;
          if (!view) {
            return null;
          }
          return {
            property: {
              ...view,
              rows,
              columns: this.filter.getColumnsByViewId(state, newDatasheet.id, view),
            },
            fieldMap,
          };
        },
      });
    } else {
      newView = await newDatasheet.getView({
        getViewInfo: (state) => {
          const firstView = Selectors.getSnapshot(state)!.meta.views[0]!;
          return {
            property: {
              ...firstView,
              rows,
              columns: this.filter.getColumnsByViewId(state, newDatasheet.id),
            },
            fieldMap,
          };
        },
      });
    }
    if (newView === null) {
      throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId });
    }

    const records = await newView.getRecords({});
    const recordVos = await this.getRecordViewObjects(records);
    return {
      records: recordVos,
    };
  }

  private async checkViewExists(datasheet: databus.Datasheet, viewId: string): Promise<void> {
    // test if viewId exists
    const view = await datasheet.getView(viewId);
    if (view === null) {
      throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId });
    }
  }

  /**
   * Add records
   *
   * @param dstId   datasheet id
   * @param body    create record data
   * @param viewId  view id
   */
  public async addRecords(dstId: string, body: RecordCreateRo, viewId: string): Promise<ListVo> {
    await this.checkDstRecordCount(dstId, body);
    const addRecordsProfiler = this.logger.startTimer();

    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const fieldMap = body.fieldKey === FieldKeyEnum.NAME ? keyBy(meta.fieldMap, 'name') : meta.fieldMap;

    // Convert written fields
    const auth = { token: this.request.headers.authorization };
    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth,
        // meta,
        recordIds: [],
        linkedRecordMap: this.request[DATASHEET_LINKED],
        includeCommentCount: false
      },
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    if (viewId) {
      await this.checkViewExists(datasheet, viewId);
    }

    const updateFieldOperations = await this.getFieldUpdateOps(datasheet, auth);
    let viewIndex = meta.views.findIndex(view => view.id === viewId);
    if (viewIndex === -1){
      viewIndex = 0;
    }
    const result = await datasheet.addRecords(
      {
        viewId: meta.views[viewIndex]!.id,
        index: meta.views[viewIndex]!.rows.length,
        recordValues: body.records.map((record) => record.fields),
        ignoreFieldPermission: true,
      },
      { auth, prependOps: updateFieldOperations },
    );
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_insert_error);
    }

    const userId = this.request[USER_HTTP_DECORATE].id;
    const recordIds = result.data as string[];

    // API submission requires a record source for tracking the source of the record
    this.datasheetRecordSourceService.createRecordSource(userId, dstId, dstId, recordIds, SourceTypeEnum.OPEN_API);
    const rows = recordIds.map((recordId) => {
      return { recordId };
    });

    // success doesn't mean that all records are updated successfully, could be partial success
    // such as the field type is changed while updating, the value may be invalid
    // so we need to reload the record map to get the correct value
    // const recordMap = await this.fusionApiRecordService.getBasicRecordsByRecordIds(dstId, recordIds);
    // await datasheet.resetRecords(recordMap, { auth, applyChangesets: false });

    addRecordsProfiler.done({
      message: `addRecords ${dstId} profiler`,
    });

    return this.getNewRecordListVo(datasheet, { viewId, rows, fieldMap });
  }

  private async getRecordViewObjects(records: databus.Record[], cellFormat: CellFormatEnum = CellFormatEnum.JSON): Promise<ApiRecordDto[]> {
    const roomConfig = this.envConfigService.getRoomConfig(EnvConfigKey.OSS) as IOssConfig;
    const ossSignatureEnabled = roomConfig.ossSignatureEnabled;
    const apiRecordDtos = records.map((record) => record.getViewObject<ApiRecordDto>((id, options) => this.transform.recordVoTransform(id, options, cellFormat)));
    if (!ossSignatureEnabled){
      return apiRecordDtos;
    }

    const attachmentColmns: string[] = [];
    const attachmentTokens: string[] = [];

    // Fields for recording attachment types
    if (records.length){
      const record = records[0]!;
      const voTransformOptions = record.getVoTransformOptions();
      const fieldMap = voTransformOptions.fieldMap;
      Object.keys(fieldMap).forEach(fieldId => {
        const fieldValue = fieldMap[fieldId]!;
        if (fieldValue.type === FieldType.Attachment) {
          attachmentColmns.push(fieldId);
        }
      });
    }

    if (!attachmentColmns.length) {
      // attachmentColmns is empty
      return apiRecordDtos;
    }

    // Collect all attachment URL
    apiRecordDtos.forEach(apiRecordDto => {
      const fields = apiRecordDto.fields;
      Object.keys(fields).forEach(fieldId => {
        if (attachmentColmns.includes(fieldId)) {
          const fieldValue = fields[fieldId];
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach(obj => {
              attachmentTokens.push(obj.token);
              if(obj.preview){
                attachmentTokens.push(obj.preview);
              }
            });
          }
        }
      });
    });

    if (!attachmentTokens.length) {
      // attachmentTokens is empty
      return apiRecordDtos;
    }

    // Retrieve in batches, fetching 100 at a time.
    const batchSize = 100;
    const signatureMap = new Map();

    for (let i = 0; i < attachmentTokens.length; i += batchSize) {
      const batchTokens = attachmentTokens.slice(i, i + batchSize);
      const batchSignatures = await this.restService.getSignatures(batchTokens);
      batchSignatures.forEach(obj => {
        const key = obj.resourceKey;
        const value = obj.url;
        signatureMap.set(key, value);
      });
    }

    // Loop Replace URL
    apiRecordDtos.forEach(apiRecordDto => {
      const fields = apiRecordDto.fields;
      Object.keys(fields).forEach(fieldId => {
        if (attachmentColmns.includes(fieldId)) {
          const fieldValue = fields[fieldId];
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach(obj => {
              obj.url = signatureMap.get(obj.token);
              if(obj.preview){
                obj.preview = signatureMap.get(obj.preview);
              }
            });
          }
        }
      });
    });
    return apiRecordDtos;
  }

  /**
   * Delete records
   *
   * @param dstId     datasheet id
   * @param recordIds Record Id Set
   */
  public async deleteRecord(dstId: string, recordIds: string[]): Promise<boolean> {
    // Validate the existence in advance to prevent repeatedly swiping all the count table data
    await this.fusionApiRecordService.validateArchivedRecordIncludes(dstId, recordIds, ApiTipConstant.api_param_record_archived);
    await this.fusionApiRecordService.validateRecordExists(dstId, recordIds, ApiTipConstant.api_param_record_not_exists);
    const auth = { token: this.request.headers.authorization };
    const datasheet = await this.databusService.getDatasheet(dstId, {
      loadOptions: {
        auth,
        recordIds,
      },
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const result = await datasheet.deleteRecords(recordIds, { auth });
    // command execution failed
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_delete_error);
    }
    return true;
  }

  private checkDstRecordCount(dstId: string, body: RecordCreateRo) {
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const recordCount = meta.views[0]!.rows.length;
    // TODO: Copywriting ApiException.error({ tipId: ApiTipIdEnum.apiParamsNotExists, property: 'recordIds', value: diffs.join(',') })
    const limit = this.envConfigService.getRoomConfig(EnvConfigKey.CONST) as IServerConfig;
    const auth = { token: this.request.headers.authorization };
    const spaceId = this.request[SPACE_ID_HTTP_DECORATE];
    const userId = this.request[USER_HTTP_DECORATE].id;
    const totalCount = recordCount + body.records.length; // Coming over limit alerts >= 90 bars < 100 bars
    if (totalCount >= (limit.maxRecordCount * limit.recordRemindRange) / 100 && totalCount <= limit.maxRecordCount) {
      void this.restService.createRecordLimitRemind(
        auth,
        NoticeTemplatesConstant.add_record_soon_to_be_limit,
        [userId],
        spaceId,
        dstId,
        limit.maxRecordCount,
        totalCount,
      );
    }
    if (totalCount > limit.maxRecordCount) {
      // Over Limit Alert
      void this.restService.createRecordLimitRemind(
        auth,
        NoticeTemplatesConstant.add_record_out_of_limit,
        [userId],
        spaceId,
        dstId,
        limit.maxRecordCount,
      );
      throw new ServerException(DatasheetException.RECORD_ADD_LIMIT, CommonStatusCode.DEFAULT_ERROR_CODE);
    }
  }

  /**
   * Customize command
   */
  public async executeCommand(datasheetId: string, commandBody: ICollaCommandOptions, auth: IAuthHeader): Promise<string> {
    const includeLink = commandBody['includeLink'];
    const internalFix = commandBody['internalFix'] as IInternalFix | undefined;
    const datasheet = await this.databusService.getDatasheet(datasheetId, {
      loadOptions: {
        auth,
        loadBasePacks: {
          foreignDstIds: [],
          options: {
            includeLink,
          },
        },
      },
      createStore: (dst) => this.createStoreForBaseDstPacks(dst),
    });
    if (datasheet === null) {
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }

    const result = await datasheet.doCommand(commandBody, { auth, internalFix });
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_update_error);
    }
    return result.saveResult as string;
  }

  /**
   * Customize rust command
   */
  public async executeCommandFromRust(datasheetId: string, commandBody: IRemoteChangeset[], auth: IAuthHeader): Promise<string> {
      const linkedRecordMap = undefined;
      const datasheet = await this.databusService.getDatasheet(datasheetId, {
        loadOptions: {
          auth,
          linkedRecordMap,
          includeCommentCount: false
        },
      });
      if (datasheet === null) {
        throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
      }
      await datasheet.nestRoomChangeFromRust(datasheetId, commandBody);
      return 'executeCommandFromRoomServer';
    }

  private async addDatasheetField(dst: databus.Datasheet, fieldOptions: IAddFieldOptions, auth: IAuthHeader): Promise<string> {
    const result = await dst.addFields([fieldOptions], { auth });
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_insert_error);
    }
    return String(result.data);
  }

  private async deleteDefaultFields(dst: databus.Datasheet, defaultFields: IDeleteFieldData[], auth: IAuthHeader) {
    const result = await dst.deleteFields(defaultFields, { auth });
    if (result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipConstant.api_insert_error);
    }
  }

  private async getFieldUpdateOps(dst: databus.Datasheet, auth: IAuthHeader): Promise<IOperation[]> {
    const updateFieldOperations: IOperation[] = [];

    const enrichedSelectFields = this.request[DATASHEET_ENRICH_SELECT_FIELD];
    for (const fieldId in enrichedSelectFields) {
      const field = enrichedSelectFields[fieldId];
      const result = await dst.updateField(field, { auth, applyChangesets: false });
      if (result.result !== ExecuteResult.Success) {
        throw ApiException.tipError(ApiTipConstant.api_insert_error);
      }

      const changesets = result.saveResult as ILocalChangeset[];
      updateFieldOperations.push(...changesets.flatMap((changeSet) => changeSet.operations));
    }

    return updateFieldOperations;
  }
}
