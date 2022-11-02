import {
  CacheManager, CollaCommandName, Conversion, ExecuteResult, FieldKeyEnum, getViewTypeString, ICollaCommandOptions, IDeleteRecordData, IField,
  ILocalChangeset, IMeta, IOperation, IServerDatasheetPack, IViewRow, NoticeTemplatesConstant,
} from '@apitable/core';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DatasheetPack } from 'database/interfaces';
import { CommandService } from 'database/services/command/impl/command.service';
import { DatasheetChangesetSourceService } from 'database/services/datasheet/datasheet.changeset.source.service';
import { DatasheetMetaService } from 'database/services/datasheet/datasheet.meta.service';
import { DatasheetRecordSourceService } from 'database/services/datasheet/datasheet.record.source.service';
import { DatasheetService } from 'database/services/datasheet/datasheet.service';
import { OtService } from 'database/services/ot/ot.service';
import { UserService } from 'database/services/user/user.service';
import { FastifyRequest } from 'fastify';
import { FusionApiRecordService } from 'fusion/services/fusion.api.record.service';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { flatten, keyBy, pick } from 'lodash';
import {
  CommonStatusCode, DATASHEET_ENRICH_SELECT_FIELD, DATASHEET_LINKED, DATASHEET_META_HTTP_DECORATE, EnvConfigKey, InjectLogger, REQUEST_AT, REQUEST_ID,
  SPACE_ID_HTTP_DECORATE, USER_HTTP_DECORATE,
} from 'shared/common';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { ApiTipIdEnum } from 'shared/enums/string.enum';
import { ApiException, DatasheetException, ServerException } from 'shared/exception';
import { IAuthHeader, ILinkedRecordMap, IServerConfig } from 'shared/interfaces';
import { IAPINode, IAPINodeDetail } from 'shared/interfaces/node.interface';
import { IAPISpace } from 'shared/interfaces/space.interface';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { JavaService } from 'shared/services/java/java.service';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';
import { DatasheetViewDto } from '../dtos/datasheet.view.dto';
import { FusionApiFilter } from '../filter/fusion.api.filter';
import { IFusionApiInterface } from '../i.fusion.api.interface';
import { ApiUsageRepository } from '../repositories/api.usage.repository';
import { DatasheetCreateRo } from '../ros/datasheet.create.ro';
import { FieldCreateRo } from '../ros/field.create.ro';
import { FieldQueryRo } from '../ros/field.query.ro';
import { RecordCreateRo } from '../ros/record.create.ro';
import { RecordQueryRo } from '../ros/record.query.ro';
import { RecordUpdateRo } from '../ros/record.update.ro';
import { ApiResponse } from '../vos/api.response';
import { DatasheetCreateDto, FieldCreateDto } from '../vos/datasheet.create.vo';
import { ListVo } from '../vos/list.vo';
import { PageVo } from '../vos/page.vo';

@Injectable()
export class FusionApiService implements IFusionApiInterface {
  constructor(
    private readonly datasheetService: DatasheetService,
    private readonly userService: UserService,
    private readonly datasheetRecordSourceService: DatasheetRecordSourceService,
    private readonly metaService: DatasheetMetaService,
    private readonly changesetSourceService: DatasheetChangesetSourceService,
    private readonly filter: FusionApiFilter,
    private readonly transform: FusionApiTransformer,
    private readonly fusionApiRecordService: FusionApiRecordService,
    private readonly commandService: CommandService,
    private readonly otService: OtService,
    private readonly apiUsageRepo: ApiUsageRepository,
    private readonly javaService: JavaService,
    private readonly restService: RestService,
    private readonly envConfigService: EnvConfigService,
    @InjectLogger() private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {}

  public async getSpaceList(): Promise<IAPISpace[]> {
    const authHeader = { token: this.request.headers.authorization };
    const spaceList = await this.restService.getSpaceList(authHeader);
    return this.transform.spaceListVoTransform(spaceList);
  }

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
    return dstMeta?.views.map(view => ({
      id: view.id,
      name: view.name,
      type: getViewTypeString(view.type),
    }));
  }

  public async getFieldList(dstId: string, query: FieldQueryRo) {
    const profiler = this.logger.startTimer();
    const datasheetPack: IServerDatasheetPack = await this.datasheetService.fetchDataPack(
      dstId,
      { token: this.request.headers.authorization },
      { recordIds: [] },
    );
    profiler.done({ message: `getFieldListBuildDataPack ${dstId} done` });
    const store = this.commandService.fullFillStore(datasheetPack.datasheet.spaceId, datasheetPack);
    const state = store.getState();
    return this.filter.getVisibleFieldList(dstId, state, query);
  }

  public async getRecords(dstId: string, query: RecordQueryRo, auth: IAuthHeader): Promise<PageVo | null> {
    const dataPack: DatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, { recordIds: query.recordIds });
    /*
     * Query the records of a specific view with the current user in the view's filter criteria.
     * fullFillStore needs to be populated with user information.
     */
    const userInfo = await this.userService.getUserInfoBySpaceId(auth, dataPack.datasheet.spaceId);
    const store = this.commandService.fullFillStore(dataPack.datasheet.spaceId, dataPack, userInfo);
    const view = this.transform.getViewInfo(query, dataPack.snapshot, store);
    if (!view) {
      return null;
    }
    const rows = this.filter.getVisibleRows(query, view, store);
    if (!rows) {
      return null;
    }
    // Get the columns needed for the results
    const fieldMap = this.filter.fieldMapFilter(dataPack.snapshot.meta.fieldMap, query.fieldKey, query.fields);
    // Transform
    return this.transform.recordPageVoTransform(
      {
        rows,
        fieldMap,
        store,
        columns: view.columns,
      },
      query,
    );
  }

  public async getFieldCreateDtos(datasheetId: string): Promise<FieldCreateDto[]> {
    const meta: IMeta = await this.metaService.getMetaDataByDstId(datasheetId);
    return Object.keys(meta.fieldMap).map(fieldId => {
      return { id: fieldId, name: meta.fieldMap[fieldId].name };
    });
  }

  public async addField(datasheetId: string, fieldCreateRo: FieldCreateRo): Promise<FieldCreateDto> {
    const auth = { token: this.request.headers.authorization };
    const datasheetIds = [datasheetId];
    const foreignDatasheetId = fieldCreateRo.foreignDatasheetId();
    if (foreignDatasheetId) {
      datasheetIds.push(foreignDatasheetId);
    }
    const interStore = await this.datasheetService.fillBaseSnapshotStoreByDstIds(datasheetIds);

    const commandData = fieldCreateRo.transferToCommandData();
    const fieldId = await this.addDatasheetField(datasheetId, commandData, interStore, auth);

    return { id: fieldId, name: fieldCreateRo.name };
  }

  public async deleteField(datasheetId: string, fieldId: string, conversion: Conversion) {
    const auth = { token: this.request.headers.authorization };
    const options: ICollaCommandOptions = {
      cmd: CollaCommandName.DeleteField,
      data: [
        {
          deleteBrotherField: conversion === Conversion.Delete,
          fieldId,
        },
      ],
    };
    const interStore = await this.datasheetService.fillBaseSnapshotStoreByDstIds([datasheetId]);
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipIdEnum.apiInsertError);
    }
    await this.applyChangeSet(datasheetId, changeSets, auth);
  }

  public async addDatasheetFields(dstId: string, datasheetCreateRo: DatasheetCreateRo): Promise<DatasheetCreateDto> {
    const auth = { token: this.request.headers.authorization };
    const foreignDatasheetIds = datasheetCreateRo.foreignDatasheetIds();
    const interStore = await this.datasheetService.fillBaseSnapshotStoreByDstIds([dstId, ...foreignDatasheetIds]);

    const fieldIds = await this.getDefaultFieldIds(interStore.getState(), dstId);
    const commandDatas = datasheetCreateRo.transferToCommandData();
    const fields = [];
    for (const commandData of commandDatas) {
      const fieldId = await this.addDatasheetField(dstId, commandData, interStore, auth);
      fields.push({ id: fieldId, name: commandData.data.name });
    }

    await this.deleteDefaultFields(dstId, fieldIds, interStore, auth);

    return { id: dstId, createdAt: undefined, fields };
  }

  public async updateRecords(dstId: string, body: RecordUpdateRo, viewId: string): Promise<ListVo> {
    // Validate the existence in advance to prevent repeatedly swiping all the count table data
    await this.fusionApiRecordService.validateRecordExists(dstId, body.getRecordIds(), 'api_param_record_not_exists');
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const fieldMap = body.fieldKey === FieldKeyEnum.NAME ? keyBy(meta.fieldMap, 'name') : meta.fieldMap;
    // Convert a field to get the modified column
    const options: ICollaCommandOptions = this.transform.getUpdateRecordCommandOptions(dstId, body.records, meta);
    const linkDatasheet: ILinkedRecordMap = this.request[DATASHEET_LINKED];
    const recordIdSet: Set<string> = new Set(body.records.map(record => record.recordId));
    const linkedRecordMap = Object.keys(linkDatasheet).length ? linkDatasheet : undefined;
    linkedRecordMap &&
    linkedRecordMap[dstId]?.forEach(recordId => {
      recordIdSet.add(recordId);
    });
    const recordIds = Array.from(recordIdSet);
    const auth = {
      token: this.request.headers.authorization,
    };
    const datasheetPack: IServerDatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, { linkedRecordMap, recordIds });
    const updateStore = this.commandService.fullFillStore(datasheetPack.datasheet.spaceId, datasheetPack);
    const updateFieldOperations = this.getFieldUpdateOps(updateStore, dstId, meta);
    const { result, changeSets } = this.commandService.execute<{}>(options, updateStore);
    this.combChangeSetsOp(changeSets, dstId, updateFieldOperations);

    const rows: IViewRow[] = recordIds.map(recordId => {
      return { recordId };
    });
    // No change required
    if (result.result === ExecuteResult.None) {
      return this.transform.recordsVoTransform({
        rows,
        fieldMap,
        store: updateStore,
        columns: meta.views[0].columns,
      });
    }
    // Command execution failed
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError('api_update_error');
    }
    await this.applyChangeSet(dstId, changeSets, auth);
    const pack: DatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, {
      recordIds,
      linkedRecordMap,
    });
    const store = this.commandService.fullFillStore(pack.datasheet.spaceId, pack);
    CacheManager.clear();
    return this.transform.recordsVoTransform({
      rows,
      fieldMap,
      store,
      columns: this.filter.getColumnsByViewId(store, dstId, viewId),
    });
  }

  public async addRecords(dstId: string, body: RecordCreateRo, viewId: string): Promise<ListVo> {
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const fieldMap = body.fieldKey === FieldKeyEnum.NAME ? keyBy(meta.fieldMap, 'name') : meta.fieldMap;

    // Convert written fields
    const options: ICollaCommandOptions = this.transform.getAddRecordCommandOptions(dstId, body.records, meta);
    const auth = { token: this.request.headers.authorization };
    const datasheetPack: IServerDatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, {
      linkedRecordMap: this.request[DATASHEET_LINKED],
      recordIds: [],
    });
    const interStore = this.commandService.fullFillStore(datasheetPack.datasheet.spaceId, datasheetPack);
    const updateFieldOperations = this.getFieldUpdateOps(interStore, dstId, meta);
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError('api_insert_error');
    }
    this.combChangeSetsOp(changeSets, dstId, updateFieldOperations);
    const userId = await this.applyChangeSet(dstId, changeSets, auth);
    const recordIds: string[] = result.data!;
    // API submission requires a record source for tracking the source of the record
    this.datasheetRecordSourceService.createRecordSource(userId, dstId, dstId, recordIds, SourceTypeEnum.OPEN_API);
    const rows = recordIds.map(recordId => {
      return { recordId };
    });
    const dataPack: DatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, {
      recordIds,
      linkedRecordMap: this.request[DATASHEET_LINKED],
    });
    const store = this.commandService.fullFillStore(dataPack.datasheet.spaceId, dataPack);
    return this.transform.recordsVoTransform({
      rows,
      fieldMap,
      store,
      columns: this.filter.getColumnsByViewId(store, dstId, viewId),
    });
  }

  public async deleteRecord(dstId: string, recordIds: string[]): Promise<boolean> {
    // Validate the existence in advance to prevent repeatedly swiping all the count table data
    await this.fusionApiRecordService.validateRecordExists(dstId, recordIds, 'api_param_record_not_exists');
    const options = this.transform.getDeleteRecordCommandOptions(recordIds);
    const auth = { token: this.request.headers.authorization };
    const datasheetPack: IServerDatasheetPack = await this.datasheetService.fetchDataPack(dstId, auth, { recordIds });
    const store = this.commandService.fullFillStore(datasheetPack.datasheet.spaceId, datasheetPack);
    const { result, changeSets } = this.commandService.execute<{}>(options, store);
    // Command execution failed
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError('api_delete_error');
    }
    await this.applyChangeSet(dstId, changeSets, auth);
    return true;
  }

  async applyChangeSet(dstId: string, changesets: ILocalChangeset[], auth: IAuthHeader, internalFix?: any): Promise<string> {
    this.logger.info('API:ApplyChangeSet');
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
    return changeResult && changeResult[0].userId!;
  }

  apiLog(request: any, response: any) {
    const handleTime = Date.now() - request[REQUEST_AT];
    const logRequest = {
      query: request.query,
      requestId: request[REQUEST_ID],
      path: request.url,
    };
    if (response instanceof ApiResponse) {
      this.logger.info('API_INFO', {
        request: logRequest,
        response: {
          code: response.code,
          message: response.message,
          success: response.success,
        },
        handleTime,
      });
    } else {
      this.logger.error('API_INFO', {
        request: logRequest,
        response,
        handleTime,
      });
    }
  }

  checkDstRecordCount(dstId: string, body: RecordCreateRo) {
    const meta: IMeta = this.request[DATASHEET_META_HTTP_DECORATE];
    const recordCount = meta.views[0].rows.length;
    // TODO: Copywriting ApiException.error({ tipId: ApiTipIdEnum.apiParamsNotExists, property: 'recordIds', value: diffs.join(',') })
    const limit = this.envConfigService.getRoomConfig(EnvConfigKey.CONST) as IServerConfig;
    const auth = { token: this.request.headers.authorization };
    const spaceId = this.request[SPACE_ID_HTTP_DECORATE];
    const userId = this.request[USER_HTTP_DECORATE].id;
    const totalCount = recordCount + body.records.length; // Coming over limit alerts >= 90 bars < 100 bars
    if (totalCount >= (limit.maxRecordCount * limit.recordRemindRange) / 100 && totalCount <= limit.maxRecordCount) {
      this.restService.createRecordLimitRemind(
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
      this.restService.createRecordLimitRemind(auth, NoticeTemplatesConstant.add_record_out_of_limit, [userId], spaceId, dstId, limit.maxRecordCount);
      throw new ServerException(DatasheetException.RECORD_ADD_LIMIT, CommonStatusCode.DEFAULT_ERROR_CODE);
    }
  }

  public async executeCommand(datasheetId: string, commandBody: ICollaCommandOptions, auth: IAuthHeader) {
    const includeLink = commandBody['includeLink'];
    const internalFix = commandBody['internalFix'];
    const store = await this.datasheetService.fillBaseSnapshotStoreByDstIds([datasheetId], includeLink);
    const { changeSets } = this.commandService.execute(commandBody, store);
    return await this.applyChangeSet(datasheetId, changeSets, auth, internalFix);
  }

  private async getDefaultFieldIds(state, datasheetId) {
    const { datasheetMap } = state;
    let meta;
    if (datasheetMap && datasheetMap[datasheetId]) {
      const datasheet = datasheetMap[datasheetId].datasheet;
      if (datasheet && datasheet.snapshot && datasheet.snapshot.meta) {
        meta = datasheet.snapshot.meta;
      }
    }
    if (!meta) {
      meta = await this.metaService.getMetaDataByDstId(datasheetId);
    }
    const { fieldMap } = meta;
    const fieldIds = Object.keys(fieldMap).map(fieldId => {
      return { fieldId };
    });
    return fieldIds;
  }

  private async addDatasheetField(dstId: string, commandData, interStore, auth): Promise<string> {
    const options: ICollaCommandOptions = {
      cmd: CollaCommandName.AddFields,
      data: [commandData],
      datasheetId: dstId,
    };
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipIdEnum.apiInsertError);
    }
    await this.applyChangeSet(dstId, changeSets, auth);
    return result.data.toString();
  }

  private async deleteDefaultFields(datasheetId: string, fieldIds: IDeleteRecordData[], interStore, auth) {
    const options: ICollaCommandOptions = {
      cmd: CollaCommandName.DeleteField,
      data: fieldIds,
      datasheetId,
    };
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) {
      throw ApiException.tipError(ApiTipIdEnum.apiInsertError);
    }
    await this.applyChangeSet(datasheetId, changeSets, auth);
  }

  private combChangeSetsOp(changeSets: any[], dstId: string, updateFieldOperations: any[]) {
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
        throw ApiException.tipError('api_insert_error');
      }
      thisResourceChangeSet.operations = [...updateFieldOperations, ...thisResourceChangeSet.operations];
    }
  }

  private getFieldUpdateOps(interStore, dstId, meta): IOperation[] {
    const enrichedSelectFields = this.request[DATASHEET_ENRICH_SELECT_FIELD];
    let updateFieldOperations: IOperation[] = [];
    Object.entries(enrichedSelectFields).forEach(item => {
      const field = item[1] as IField;
      const fieldUpdateOptions: ICollaCommandOptions = this.transform.getUpdateFieldCommandOptions(dstId, field, meta);
      const { result, changeSets } = this.commandService.execute<string[]>(fieldUpdateOptions, interStore);
      if (!result || result.result !== ExecuteResult.Success) {
        throw ApiException.tipError('api_insert_error');
      }
      updateFieldOperations = updateFieldOperations.concat(flatten(changeSets.map(changeSet => changeSet.operations)));
    });
    return updateFieldOperations;
  }
}
