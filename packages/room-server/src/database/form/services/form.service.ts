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
  ConfigConstant,
  EventAtomTypeEnums,
  EventRealTypeEnums,
  EventSourceTypeEnums,
  ExecuteResult,
  FieldType,
  ICollaCommandOptions,
  IFormProps,
  ILinkIds,
  ILocalChangeset,
  IMeta,
  IRecordCellValue,
  IServerDatasheetPack,
  OPEventNameEnums,
  ResourceType,
  Selectors,
  StoreActions,
  transformOpFields
} from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommandService } from 'database/command/services/command.service';
import { DatasheetChangesetSourceService } from 'database/datasheet/services/datasheet.changeset.source.service';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import { DatasheetRecordSourceService } from 'database/datasheet/services/datasheet.record.source.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { OtService } from 'database/ot/services/ot.service';
import { MetaService } from 'database/resource/services/meta.service';
import { FusionApiTransformer } from 'fusion/transformer/fusion.api.transformer';
import { omit } from 'lodash';
import { NodeService } from 'node/services/node.service';
import { InjectLogger } from 'shared/common';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { ApiException, DatasheetException, ServerException } from 'shared/exception';
import { getRecordUrl } from 'shared/helpers/env';
import { IAuthHeader, IFetchDataOptions } from 'shared/interfaces';
import { Logger } from 'winston';
import { FormDataPack } from '../../interfaces';

@Injectable()
export class FormService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly nodeService: NodeService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetMetaService: DatasheetMetaService,
    private readonly datasheetRecordSourceService: DatasheetRecordSourceService,
    private readonly commandService: CommandService,
    private readonly otService: OtService,
    private readonly transform: FusionApiTransformer,
    private resourceMetaService: MetaService,
    private readonly datasheetChangesetSourceService: DatasheetChangesetSourceService,
    private readonly eventEmitter: EventEmitter2,
  ) {
  }

  async fetchFormData(formId: string, userId: string, auth: IAuthHeader): Promise<FormDataPack> {
    // Query node info
    const origin = { internal: false, main: true, shareId: undefined, notDst: true };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(formId, auth, origin);
    const { formProps, nodeRelInfo, dstId, meta } = await this.getRelDatasheetInfo(formId);
    let hasSubmitted = false;
    // Check if form is already submitted when logged in and in share state
    if (userId) {
      // Check if the user has submitted using this form
      hasSubmitted = await this.fetchSubmitStatus(userId, formId, dstId);
    }
    return {
      sourceInfo: nodeRelInfo,
      snapshot: {
        meta,
        formProps: {
          ...formProps,
          hasSubmitted,
        },
      },
      form: omit(node, ['extra']),
      fieldPermissionMap,
    };
  }

  async fetchDataPack(formId: string, auth: IAuthHeader, templateId?: string, embedId?: string): Promise<FormDataPack> {
    const beginTime = +new Date();
    this.logger.info(`Start loading form data [${formId}]`);
    // Query node info
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(
      formId,
      auth,
      { internal: !templateId, main: true, notDst: true }
    );
    const { formProps, nodeRelInfo, dstId, meta } = await this.getRelDatasheetInfo(formId);
    // Get source datasheet permission in space
    if (!templateId && !embedId) {
      nodeRelInfo.datasheetPermissions = await this.nodeService.getPermissions(dstId, auth, { internal: true, main: false });
    }
    const endTime = +new Date();
    this.logger.info(`Finished loading form data, duration: ${endTime - beginTime}ms`);
    return {
      sourceInfo: nodeRelInfo,
      snapshot: {
        meta,
        formProps: formProps,
      },
      form: omit(node, ['extra']),
      fieldPermissionMap,
    };
  }

  async fetchShareDataPack(formId: string, shareId: string, userId: string, auth: IAuthHeader): Promise<FormDataPack> {
    const beginTime = +new Date();
    this.logger.info(`Start loading share form data [${formId}]`);
    // Query node info
    const origin = { internal: false, main: true, shareId, notDst: true };
    const { node, fieldPermissionMap } = await this.nodeService.getNodeDetailInfo(formId, auth, origin);
    const { formProps, nodeRelInfo, dstId, meta } = await this.getRelDatasheetInfo(formId);
    let hasSubmitted = false;
    // Check if form is already submitted when logged in and in share state
    if (shareId && userId) {
      // Check if the user has submitted using this form
      hasSubmitted = await this.fetchSubmitStatus(userId, formId, dstId);
    }
    const endTime = +new Date();
    this.logger.info(`Finished loading share form data, duration: ${endTime - beginTime}ms`);
    return {
      sourceInfo: nodeRelInfo,
      snapshot: {
        meta,
        formProps: {
          ...formProps,
          hasSubmitted,
        },
      },
      form: omit(node, ['extra']),
      fieldPermissionMap,
    };
  }

  private async getRelDatasheetInfo(formId: string) {
    // Query form metadata
    const formProps = await this.fetchFormProps(formId);
    // Query info of referenced datasheet and view
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    const dstId = nodeRelInfo.datasheetId;
    // Query meta of referenced datasheet
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    const views = meta.views.filter(i => i.id === nodeRelInfo.viewId).map(i => {
      return { ...i, rows: [] };
    });
    return { formProps, nodeRelInfo, dstId, meta: { views, fieldMap: meta.fieldMap } };
  }

  async addFormRecord(
    props: {
      formId: string,
      userId: string;
      recordData: IRecordCellValue;
    },
    auth: IAuthHeader
  ): Promise<void> {
    const { formId, userId, recordData } = props;
    const dstId = await this.nodeService.getMainNodeId(formId);
    const revision: any = await this.resourceMetaService.getRevisionByDstId(dstId);
    if (revision == null) {
      throw new ServerException(DatasheetException.VERSION_ERROR);
    }
    try {
      return await this.addFormRecordAction(dstId, { formId, userId, recordData }, auth);
    } finally {
      this.logger.info(`addFormRecordAction end, formId: ${formId}, dstId: ${dstId}, revision: ${revision}`);
    }
  }

  async addRecord(
    props: {
      formId: string,
      shareId?: string;
      userId: string;
      recordData: IRecordCellValue;
    },
    auth: IAuthHeader
  ): Promise<void> {
    this.logger.info(`addRecordAction start, formId: ${props.formId}`);
    const { formId, shareId, userId, recordData } = props;
    const dstId = await this.nodeService.getMainNodeId(formId);
    const revision: any = await this.resourceMetaService.getRevisionByDstId(dstId);
    // revision not found
    if (revision == null) {
      throw new ServerException(DatasheetException.VERSION_ERROR);
    }
    this.logger.info(`addRecordAction processing, formId: ${props.formId} dstId: ${dstId} revision: ${revision}`);
    try {
      return await this.addRecordAction(dstId, { formId, shareId, userId, recordData }, auth);
    } finally {
      this.logger.info(`addRecordAction end, formId: ${formId}, dstId: ${dstId}, revision: ${revision}`);
    }
  }

  @Span()
  private async dispatchFormSubmittedEvent(props: {
    formId: string,
    recordId: string,
    dstId: string,
    interStore: any
  }): Promise<any> {
    // FIXME: dispatchEvent in other place. wrap in try block to make sure execution is normal
    const { formId, recordId, dstId, interStore } = props;
    try {
      const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
      const thisRecord = Selectors.getRecord(interStore.getState(), recordId, dstId);
      const { fieldTypeMap, eventFields } = transformOpFields({
        recordData: thisRecord!.data,
        state: interStore.getState(),
        datasheetId: dstId,
        recordId
      });
      const eventContext = {
        // TODO: Old structure left for Qianfan, delete later
        datasheet: {
          id: dstId,
          name: nodeRelInfo.datasheetName
        },
        record: {
          id: recordId,
          url: getRecordUrl(dstId, recordId),
          fields: eventFields
        },
        fieldTypeMap,
        formId: formId,
        // Flattened new structure
        datasheetId: dstId,
        datasheetName: nodeRelInfo.datasheetName,
        recordId,
        recordUrl: getRecordUrl(dstId, recordId),
        ...eventFields
      };
      this.logger.info(
        'dispatchFormSubmittedEvent eventContext',
        eventContext,
        eventFields
      );
      await this.eventEmitter.emitAsync(OPEventNameEnums.FormSubmitted, {
        eventName: OPEventNameEnums.FormSubmitted,
        scope: ResourceType.Form,
        realType: EventRealTypeEnums.REAL,
        atomType: EventAtomTypeEnums.ATOM,
        sourceType: EventSourceTypeEnums.ALL,
        context: eventContext,
        beforeApply: false,
      });
    } catch (error) {
      this.logger.info('dispatchFormSubmittedEvent error', error);
    }
  }

  @Span()
  private async addFormRecordAction(
    dstId: string,
    props: {
      formId: string,
      userId: string;
      recordData: IRecordCellValue;
    },
    auth: IAuthHeader
  ): Promise<any> {
    const addRecordsProfiler = this.logger.startTimer();
    const { formId, userId, recordData } = props;
    const fetchDataOptionsProfiler = this.logger.startTimer();
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    const fetchDataOptions = this.getLinkedRecordMap(dstId, meta, recordData);
    const options: ICollaCommandOptions = this.transform.getAddRecordCommandOptions(dstId, [{ fields: recordData }], meta);
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    if (nodeRelInfo.viewId && options['viewId']) {
      options['viewId'] = nodeRelInfo.viewId;
    }
    const datasheetPack: IServerDatasheetPack =
      await this.datasheetService.fetchForeignDatasheetPackWithoutCheckPermission(dstId, auth, fetchDataOptions);
    // Form submission, handle field permissions
    if (datasheetPack.fieldPermissionMap) {
      for (const fieldPermissionInfo of Object.values(datasheetPack.fieldPermissionMap)) {
        // When the field is not writable via form submission, disable editable permission
        if (!fieldPermissionInfo.setting?.formSheetAccessible) {
          fieldPermissionInfo.permission.editable = false;
          fieldPermissionInfo.role = ConfigConstant.Role.None;
        }
      }
    }
    fetchDataOptionsProfiler.done({ message: 'fetchDataOptionsProfiler done' });
    const interStore = this.commandService.fullFillStore(datasheetPack);
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) throw ApiException.tipError(ApiTipConstant.api_insert_error);
    // Client submission has been applied to store. Wait for room to acknowledgment
    const roomChangeSets = await this.applyChangeSet(formId, dstId, changeSets, auth);
    // console.log('changeSets', JSON.stringify(changeSets), JSON.stringify(roomChangeSets));
    // Apply room changeset to store, the interStore is the latest sparse store.
    // Only when taking part in computation, compute fields can get correct values
    roomChangeSets.forEach(cs => {
      const systemOperations = cs.operations.filter(ops => ops.cmd.startsWith('System'));
      if (systemOperations.length > 0) {
        interStore.dispatch(StoreActions.applyJOTOperations(systemOperations, cs.resourceType, cs.resourceId));
      }
    });
    const executeOpProfiler = this.logger.startTimer();
    // Form submission need to store source for tracking record source
    const recordId = result.data && result.data[0];
    await this.datasheetRecordSourceService.createRecordSource(userId, dstId, formId, [recordId!], SourceTypeEnum.FORM);
    await this.dispatchFormSubmittedEvent({ formId, recordId: recordId!, dstId, interStore });
    executeOpProfiler.done({ message: 'executeOpProfiler done' });
    addRecordsProfiler.done({
      message: `getRecords ${dstId} profiler`,
    });
    return { recordId };
  }

  @Span()
  private async addRecordAction(
    dstId: string,
    props: {
      formId: string,
      shareId?: string;
      userId: string;
      recordData: IRecordCellValue;
    },
    auth: IAuthHeader
  ): Promise<any> {
    const addRecordsProfiler = this.logger.startTimer();
    const { formId, shareId, userId, recordData } = props;
    const fetchDataOptionsProfiler = this.logger.startTimer();
    const meta = await this.datasheetMetaService.getMetaDataByDstId(dstId, DatasheetException.DATASHEET_NOT_EXIST);
    const fetchDataOptions = this.getLinkedRecordMap(dstId, meta, recordData);
    const options: ICollaCommandOptions = this.transform.getAddRecordCommandOptions(dstId, [{ fields: recordData }], meta);
    const nodeRelInfo = await this.nodeService.getNodeRelInfo(formId);
    if (nodeRelInfo.viewId && options['viewId']) {
      options['viewId'] = nodeRelInfo.viewId;
    }
    const datasheetPack: IServerDatasheetPack =
      await this.datasheetService.fetchSubmitFormForeignDatasheetPack(dstId, auth, fetchDataOptions, shareId);
    // Form submission, handle field permissions
    if (datasheetPack.fieldPermissionMap) {
      for (const fieldPermissionInfo of Object.values(datasheetPack.fieldPermissionMap)) {
        // When the field is not writable via form submission, disable editable permission
        if (!fieldPermissionInfo.setting?.formSheetAccessible) {
          fieldPermissionInfo.permission.editable = false;
          fieldPermissionInfo.role = ConfigConstant.Role.None;
        }
      }
    }
    fetchDataOptionsProfiler.done({ message: 'fetchDataOptionsProfiler done' });
    const interStore = this.commandService.fullFillStore(datasheetPack);
    const { result, changeSets } = this.commandService.execute<string[]>(options, interStore);
    if (!result || result.result !== ExecuteResult.Success) throw ApiException.tipError(ApiTipConstant.api_insert_error);
    // Client submission has been applied to store. Wait for room to acknowledgment
    const roomChangeSets = await this.applyChangeSet(formId, dstId, changeSets, auth, shareId!);
    // console.log('changeSets', JSON.stringify(changeSets), JSON.stringify(roomChangeSets));
    // Apply room changeset to store, the interStore is the latest sparse store.
    // Only when taking part in computation, compute fields can get correct values
    roomChangeSets.forEach(cs => {
      const systemOperations = cs.operations.filter(ops => ops.cmd.startsWith('System'));
      if (systemOperations.length > 0) {
        interStore.dispatch(StoreActions.applyJOTOperations(systemOperations, cs.resourceType, cs.resourceId));
      }
    });
    const executeOpProfiler = this.logger.startTimer();
    // Form submission need to store source for tracking record source
    const recordId = result.data && result.data[0];
    await this.datasheetRecordSourceService.createRecordSource(userId, dstId, formId, [recordId!], SourceTypeEnum.FORM);
    await this.dispatchFormSubmittedEvent({ formId, recordId: recordId!, dstId, interStore });
    executeOpProfiler.done({ message: 'executeOpProfiler done' });
    addRecordsProfiler.done({
      message: `getRecords ${dstId} profiler`,
    });
    return { recordId };
  }

  /**
   * Get linked record data by meta and recordData
   */
  private getLinkedRecordMap(dstId: string, meta: IMeta, recordData: IRecordCellValue): IFetchDataOptions {
    const recordIds: string[] = [];
    const linkedRecordMap = {};
    // linked datasheet set
    const foreignDatasheetIdMap = Object.values(meta.fieldMap)
      .filter(field => {
        return field.type === FieldType.Link || field.type === FieldType.OneWayLink;
      })
      .map(field => {
        const foreignDatasheetId = field.property?.foreignDatasheetId;
        if (!foreignDatasheetId) return null;
        return {
          fieldId: field.id,
          foreignDatasheetId,
        };
      })
      .filter(v => v);

    foreignDatasheetIdMap.forEach(item => {
      const { foreignDatasheetId, fieldId } = item!;
      if (recordData[fieldId]) {
        // collect self-linking recordId
        if (foreignDatasheetId === dstId) {
          recordIds.push(...recordData[fieldId] as ILinkIds);
          return;
        }
        linkedRecordMap[foreignDatasheetId] =
          Array.isArray(linkedRecordMap[foreignDatasheetId])
            ? [...linkedRecordMap[foreignDatasheetId], ...recordData[fieldId] as ILinkIds]
            : recordData[fieldId];
      }
    });
    // remove duplicates
    for (const key in linkedRecordMap) {
      linkedRecordMap[key] = [...new Set(linkedRecordMap[key])];
    }
    return { recordIds, linkedRecordMap };
  }

  async applyChangeSet(formId: string, dstId: string, changesets: ILocalChangeset[], auth: IAuthHeader, shareId?: string, ) {
    const changeResult = await this.otService.applyRoomChangeset({ roomId: formId, sourceType: SourceTypeEnum.FORM, shareId, changesets }, auth);
    // Store changeset source
    await this.datasheetChangesetSourceService.batchCreateChangesetSource(changeResult, SourceTypeEnum.FORM, formId);
    this.logger.info('Form:ApplyChangeSet Success!');
    // notify socket service broadcast
    await this.otService.nestRoomChange(dstId, changeResult);
    this.logger.info('Form:NotifyChangeSet Success!');
    return changeResult;
  }

  async fetchSubmitStatus(userId: string, formId: string, dstId?: string) {
    if (!dstId) {
      // Obtain referenced datasheet
      const datasheetId = await this.nodeService.getMainNodeId(formId);
      // Check if the user has ever submitted via form
      const recordSource = await this.datasheetRecordSourceService.fetchRecordSourceStatus(userId, datasheetId, formId, 0);
      return Boolean(recordSource);
    }
    // Check if the user has ever submitted via form
    const recordSource = await this.datasheetRecordSourceService.fetchRecordSourceStatus(userId, dstId, formId, 0);
    return Boolean(recordSource);
  }

  async updateFormProps(userId: string, resourceId: string, formProps: IFormProps) {
    await this.resourceMetaService.updateMetaDataByResourceId(resourceId, userId, formProps);
  }

  // Obtain form metadata
  async fetchFormProps(formId: string) {
    return await this.resourceMetaService.selectMetaByResourceId(formId);
  }
}
