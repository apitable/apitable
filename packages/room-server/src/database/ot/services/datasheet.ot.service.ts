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
  CollaCommandName,
  Field,
  FieldType,
  IAttachmentValue,
  IComments,
  IField,
  IFieldMap,
  IFieldUpdatedMap,
  IJOTAction,
  IMeta,
  INodePermissions,
  IObjectDeleteAction,
  IObjectInsertAction,
  IObjectReplaceAction,
  IOperation,
  IRecord,
  IRecordAlarm,
  IRecordCellValue,
  IRecordMap,
  IRecordMeta,
  IReduxState,
  IRemoteChangeset,
  isSameSet,
  IViewProperty,
  jot,
  OTActionName,
  ViewType,
} from '@apitable/core';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import {
  DatasheetRecordAlarmBaseService,
} from 'database/alarm/datasheet.record.alarm.base.service';
import { DatasheetEntity } from 'database/datasheet/entities/datasheet.entity';
import { DatasheetMetaEntity } from 'database/datasheet/entities/datasheet.meta.entity';
import {
  DatasheetRecordEntity,
} from 'database/datasheet/entities/datasheet.record.entity';
import { RecordCommentEntity } from 'database/datasheet/entities/record.comment.entity';
import { DatasheetMetaService } from 'database/datasheet/services/datasheet.meta.service';
import {
  DatasheetRecordService,
} from 'database/datasheet/services/datasheet.record.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { RecordCommentService } from 'database/datasheet/services/record.comment.service';
import {
  EffectConstantName,
  ICommonData,
  IFieldData,
  IRestoreRecordInfo,
} from 'database/ot/interfaces/ot.interface';
import produce from 'immer';
import { chunk, intersection, isEmpty, pick, update } from 'lodash';
import { InjectLogger } from 'shared/common';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import {
  CommonException,
  DatasheetException,
  OtException,
  PermissionException,
  ServerException,
} from 'shared/exception';
import { ExceptionUtil } from 'shared/exception/exception.util';
import { IdWorker } from 'shared/helpers';
import { IAuthHeader, IOpAttach, NodePermission } from 'shared/interfaces';
import { RestService } from 'shared/services/rest/rest.service';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import {
  DatasheetChangesetEntity,
} from '../../datasheet/entities/datasheet.changeset.entity';
import { WidgetEntity } from '../../widget/entities/widget.entity';
import { WidgetService } from '../../widget/services/widget.service';
import {
  DatasheetRecordArchiveEntity,
} from '../../datasheet/entities/datasheet.record.archive.entity';

@Injectable()
export class DatasheetOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly recordCommentService: RecordCommentService,
    private readonly recordService: DatasheetRecordService,
    private readonly widgetService: WidgetService,
    private readonly metaService: DatasheetMetaService,
    private readonly restService: RestService,
    // private readonly envConfigService: EnvConfigService,
    private readonly recordAlarmService: DatasheetRecordAlarmBaseService,
    private readonly datasheetService: DatasheetService,
  ) {
  }

  private static isAttachField(cellValue: any): boolean {
    return !!(cellValue && Array.isArray(cellValue) && cellValue[0]?.mimeType && cellValue[0]?.token);
  }

  /**
   * Sets a value in a `Map<key, value[]>`.
   *
   * If the key exists, the value is appended to the value array, otherwise a new value array is created.
   */
  private static setMapValIfExist(map: Map<any, any>, key: any, value: any) {
    if (map.has(key)) {
      const values = map.get(key);
      values.push(value);
      map.set(key, values);
    } else {
      map.set(key, [value]);
    }
  }

  private static generateJotAction(name: OTActionName, path: string[], newValue: any, oldValue?: any): IJOTAction {
    switch (name) {
      case OTActionName.ObjectInsert:
        return {
          n: name,
          p: path,
          oi: newValue,
        };
      case OTActionName.ObjectReplace:
        return {
          n: name,
          p: path,
          od: oldValue,
          oi: newValue,
        };
      default:
        return {
          n: OTActionName.ObjectInsert,
          p: path,
          oi: newValue,
        };
    }
  }

  createResultSet() {
    return {
      metaActions: [],
      toCreateRecord: new Map<string, IRecordCellValue>(),
      toUnarchiveRecord: new Map<string, IRecordCellValue>(),
      toDeleteRecordIds: [],
      toArchiveRecordIds: [],
      cleanFieldMap: new Map<string, FieldType>(),
      cleanRecordCellMap: new Map<string, IFieldData[]>(),
      replaceCellMap: new Map<string, IFieldData[]>(),
      initFieldMap: new Map<number, IField[]>(),
      toCorrectComment: new Map<string, { comment: IComments; index: number | string }[]>(),
      fldOpInViewMap: new Map<string, boolean>(),
      fldOpInRecMap: new Map<string, string>(),
      toDeleteCommentIds: new Map<string, string[]>(),
      deleteWidgetIds: [],
      addWidgetIds: [],
      spaceCapacityOverLimit: false,
      auth: {},
      attachCiteCollector: { nodeId: '', addToken: [], removeToken: [] }, // datasheet attachments capacity collector
      datasheetId: '',
      toCreateForeignDatasheetIdMap: new Map<string, string>(),
      toDeleteForeignDatasheetIdMap: new Map<string, string>(),
      toCreateLookUpProperties: [],
      toDeleteLookUpProperties: [],
      toChangeFormulaExpressions: [],
      changeViewNumber: 0,
      changeFieldNumber: 0,
      toDeleteFieldIds: [],
      temporaryFieldMap: {},
      temporaryViews: [],
      toUpdateCommentEmoji: new Map<string, { comment: IComments; emojiAction: boolean }[]>(),
      linkActionMainDstId: undefined,
      mainLinkDstPermissionMap: new Map<string, NodePermission>(),
      toCreateAlarms: new Map<string, IRecordAlarm[]>(),
      toDeleteAlarms: new Map<string, IRecordAlarm[]>(),
      updatedAlarmIds: [],
      addViews: [],
      deleteViews: [],
      toCreateRecordSubscriptions: [], // unitId - recordId
      toCancelRecordSubscriptions: [], // unitId - recordId
      creatorAutoSubscribedRecordIds: [], // creator auto subscribed recordIds
      spaceId: '',
    };
  }

  /**
   * Analyze Operation, apply special handling accordingly
   */
  @Span()
  async analyseOperates(
    spaceId: string,
    mainDatasheetId: string,
    operation: IOperation[],
    datasheetId: string,
    permission: NodePermission,
    getNodeRole: (dstId: string, auth: IAuthHeader) => Promise<INodePermissions>,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any },
    auth: IAuthHeader,
    sourceType?: SourceTypeEnum,
  ) {
    resultSet.spaceId = spaceId;
    resultSet.datasheetId = datasheetId;
    resultSet.auth = auth;
    resultSet.sourceType = sourceType;
    resultSet.attachCiteCollector = { nodeId: datasheetId, addToken: [], removeToken: [] };

    const prepareBeginTime = +new Date();
    // Obtain capacity state
    resultSet.spaceCapacityOverLimit = await this.restService.capacityOverLimit(auth, spaceId);
    const meta = await this.getMetaDataByCache(datasheetId, effectMap);

    this.logger.info(`[${datasheetId}] ====> Prepare analyseOperates......duration: ${+new Date() - prepareBeginTime}ms`);

    const fieldMap = meta.fieldMap;
    resultSet.temporaryFieldMap = fieldMap;
    resultSet.temporaryViews = meta.views;
    for (const { mainLinkDstId } of operation) {
      const _condition = mainLinkDstId || mainDatasheetId;
      const condition = auth.internal || datasheetId === _condition || sourceType === SourceTypeEnum.FORM;
      const mainDstPermission = condition ? permission : await getNodeRole(_condition, auth);
      resultSet.mainLinkDstPermissionMap.set(_condition, mainDstPermission);
    }
    const metaActions: IJOTAction[] = [];
    for (const cur of operation) {
      // There are many logs during big data operation, commenting out this log is ok
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${datasheetId}] changeset OperationAction: ${JSON.stringify(cur.actions)}`);
      }
      const cmd = cur.cmd;
      resultSet.linkActionMainDstId = cur.mainLinkDstId || mainDatasheetId;
      for (const action of cur.actions) {
        if (action.p[0] === 'meta') {
          this.dealWithMeta(cmd, action, permission, resultSet);
          metaActions.push(action);
        } else {
          // Collect attachment fields
          this.handleAttachOpCite(action, resultSet, fieldMap);
          await this.dealWithRecordMap(cmd, action, permission, resultSet);
        }
      }
    }
    resultSet.metaActions = metaActions;

    const postBeginTime = +new Date();

    if (resultSet.addViews.length) {
      const spaceUsages = await this.restService.getSpaceUsage(spaceId);
      const subscribeInfo = await this.restService.getSpaceSubscription(spaceId);
      let afterAddGanttViewCountInSpace = spaceUsages.ganttViewNums;
      let afterAddCalendarCountInSpace = spaceUsages.calendarViewNums;

      (resultSet.addViews as { type: ViewType }[]).forEach((view) => {
        if (view.type === ViewType.Gantt) {
          afterAddGanttViewCountInSpace++;
          return;
        }
        if (view.type === ViewType.Calendar) {
          afterAddCalendarCountInSpace++;
          return;
        }
      });

      const checkGanttViewsNum = afterAddGanttViewCountInSpace !== spaceUsages.ganttViewNums;
      const checkCalendarViewsNum = afterAddCalendarCountInSpace !== spaceUsages.calendarViewNums;

      if (subscribeInfo.maxGanttViewsInSpace !== -1 && checkGanttViewsNum && afterAddGanttViewCountInSpace > subscribeInfo.maxGanttViewsInSpace) {
        void this.restService.createNotification(resultSet.auth, [
          {
            spaceId,
            templateId: 'space_gantt_limit',
            body: {
              extras: {
                usage: afterAddGanttViewCountInSpace,
                specification: subscribeInfo.maxGanttViewsInSpace,
              },
            },
          },
        ]);
        throw new ServerException(
          DatasheetException.getVIEW_ADD_LIMIT_FOR_GANTTMsg(subscribeInfo.maxGanttViewsInSpace, afterAddGanttViewCountInSpace),
        );
      }

      if (
        subscribeInfo.maxCalendarViewsInSpace !== -1 &&
        checkCalendarViewsNum &&
        afterAddCalendarCountInSpace > subscribeInfo.maxCalendarViewsInSpace
      ) {
        void this.restService.createNotification(resultSet.auth, [
          {
            spaceId,
            templateId: 'space_calendar_limit',
            body: {
              extras: {
                usage: afterAddCalendarCountInSpace,
                specification: subscribeInfo.maxCalendarViewsInSpace,
              },
            },
          },
        ]);
        throw new ServerException(
          DatasheetException.getVIEW_ADD_LIMIT_FOR_CALENDARMsg(subscribeInfo.maxCalendarViewsInSpace, afterAddCalendarCountInSpace),
        );
      }
    }

    if (resultSet.toCreateRecord.size || resultSet.toUnarchiveRecord.size) {
      const currentRecordCountInDst = await this.metaService.getRowsNumByDstId(datasheetId);
      const spaceUsages = await this.restService.getSpaceUsage(spaceId);
      const subscribeInfo = await this.restService.getSpaceSubscription(spaceId);
      const afterCreateCountInDst = Number(currentRecordCountInDst) + Number(resultSet.toCreateRecord.size)
        + Number(resultSet.toUnarchiveRecord.size);
      const afterCreateCountInSpace = Number(spaceUsages.recordNums) + Number(resultSet.toCreateRecord.size)
        + Number(resultSet.toUnarchiveRecord.size);

      if (subscribeInfo.maxRowsPerSheet >= 0 && afterCreateCountInDst > subscribeInfo.maxRowsPerSheet) {
        const datasheetEntity = await this.datasheetService.getDatasheet(datasheetId);
        void this.restService.createNotification(resultSet.auth, [
          {
            spaceId,
            templateId: 'datasheet_record_limit',
            body: {
              extras: {
                usage: afterCreateCountInDst,
                specification: subscribeInfo.maxRowsPerSheet,
                nodeName: datasheetEntity!.dstName,
              },
            },
          },
        ]);
        throw new ServerException(DatasheetException.getRECORD_ADD_LIMIT_PER_DATASHEETMsg(subscribeInfo.maxRowsPerSheet, afterCreateCountInDst));
      }

      if (subscribeInfo.maxRowsInSpace >= 0 && afterCreateCountInSpace > subscribeInfo.maxRowsInSpace) {
        void this.restService.createNotification(resultSet.auth, [
          {
            spaceId,
            templateId: 'space_record_limit',
            body: {
              extras: {
                usage: afterCreateCountInSpace,
                specification: subscribeInfo.maxRowsInSpace,
              },
            },
          },
        ]);
        throw new ServerException(DatasheetException.getRECORD_ADD_LIMIT_WITHIN_SPACEMsg(subscribeInfo.maxRowsInSpace, afterCreateCountInSpace));
      }

      const fieldMap = resultSet.temporaryFieldMap;

      for (const [recordId, value] of resultSet.toCreateRecord.entries()) {
        if (!Object.keys(value).length) {
          continue;
        }
        const _value = {};
        for (const fieldId in value) {
          const field = fieldMap[fieldId];
          if (!field) {
            Sentry.captureMessage('Non-existent fields in data being written', {
              extra: {
                datasheetId,
                fieldId,
              },
            });
            continue;
          }

          // Send compute field writing error to Sentry, request is not interrupted
          if (Field.bindContext(field, {} as IReduxState).isComputed) {
            Sentry.captureMessage('ot service: writting compute field failed', {
              extra: {
                datasheetId,
                field,
              },
            });
            continue;
          }

          const { error } = Field.bindContext(field, {} as IReduxState).validateCellValue(value[fieldId]);
          if (error) {
            Sentry.captureMessage('Format error for data being written', {
              extra: {
                datasheetId,
                error: JSON.stringify(error),
              },
            });
            continue;
          }
          _value[fieldId] = value[fieldId];
        }
        resultSet.toCreateRecord.set(recordId, _value);
      }
    }

    if (resultSet.toArchiveRecordIds.length) {
      const currentArchivedRecordCountInDst = await this.recordService.getArchivedRecordCount(datasheetId);
      const subscribeInfo = await this.restService.getSpaceSubscription(spaceId);
      const afterArchiveCountInDst = Number(currentArchivedRecordCountInDst) + Number(resultSet.toArchiveRecordIds.length);

      if (subscribeInfo.maxArchivedRowsPerSheet >= 0 && afterArchiveCountInDst > subscribeInfo.maxArchivedRowsPerSheet) {
        throw new ServerException(DatasheetException.getRECORD_ARCHIVE_LIMIT_PER_DATASHEETMsg(subscribeInfo.maxArchivedRowsPerSheet,
          afterArchiveCountInDst));
      }
    }

    if (resultSet.replaceCellMap.size) {
      const fieldMap = resultSet.temporaryFieldMap;

      for (const [recordId, value] of resultSet.replaceCellMap.entries()) {
        const _value = [];
        for (const { fieldId, data } of value) {
          const field = fieldMap[fieldId];
          if (!field) {
            Sentry.captureMessage('Non-existent fields in data being written', {
              extra: {
                datasheetId,
                fieldId,
              },
            });
            continue;
          }

          if (Field.bindContext(field, {} as IReduxState).isComputed) {
            Sentry.captureMessage('ot service: writting compute field failed', {
              extra: {
                datasheetId,
                field,
              },
            });
            continue;
          }

          const { error } = Field.bindContext(field, {} as IReduxState).validateCellValue(data);

          if (error) {
            Sentry.captureMessage('Format error for data being written', {
              extra: {
                datasheetId,
                error: JSON.stringify(error),
              },
            });
            continue;
          }
          _value.push({ fieldId, data });
        }
        resultSet.replaceCellMap.set(recordId, _value);
      }
    }

    // Validate view field operations without permission, if corresponds to created or deleted linked field
    if (resultSet.fldOpInViewMap.size > 0) {
      for (const [fieldId, isLi] of resultSet.fldOpInViewMap.entries()) {
        if (isLi) {
          if (!resultSet.toCreateForeignDatasheetIdMap.has(fieldId)) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
        } else if (!resultSet.toDeleteForeignDatasheetIdMap.has(fieldId)) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
    }

    // Validate cell operations without edit permission, if is operation related to linking
    if (resultSet.fldOpInRecMap.size > 0) {
      for (const [fieldId, cmd] of resultSet.fldOpInRecMap.entries()) {
        switch (cmd) {
          // Delete linked field and update linked field
          case 'DeleteField':
          case 'SetFieldAttr':
            if (!resultSet.toDeleteForeignDatasheetIdMap.has(fieldId)) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            break;
          // Undo deleting linked field and undo updating linked field
          case 'UNDO:DeleteField':
          case 'UNDO:SetFieldAttr':
            if (!resultSet.toCreateForeignDatasheetIdMap.has(fieldId)) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            break;
          // Select, paste and fill in link reference and respective undo operations, validate if current column is two-way link field or oneway link
          default:
            // Take changeset with priority, avoid pushed after OP is merged, then load database metadata
            if (resultSet.toCreateForeignDatasheetIdMap.has(fieldId) || resultSet.toDeleteForeignDatasheetIdMap.has(fieldId)) {
              break;
            }
            if (meta?.fieldMap[fieldId]!.type !== FieldType.Link && meta?.fieldMap[fieldId]!.type !== FieldType.OneWayLink) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
        }
      }
    }

    // Not undo operation, create LookUp requires permission above readable of linked datasheet.
    // If the target field set field permission, permission above readable of this field is also required.
    if (resultSet.toCreateLookUpProperties.length > 0) {
      for (const { cmd, relatedLinkFieldId, lookUpTargetFieldId, skipFieldPermission } of resultSet.toCreateLookUpProperties) {
        if (skipFieldPermission || cmd === 'UNDO:DeleteField' || cmd === 'UNDO:SetFieldAttr') {
          continue;
        }
        let foreignDatasheetId;
        // Take changeset with priority, avoid pushed after OP is merged, then load database metadata
        if (resultSet.toCreateForeignDatasheetIdMap.has(relatedLinkFieldId)) {
          foreignDatasheetId = resultSet.toCreateForeignDatasheetIdMap.get(relatedLinkFieldId);
        } else {
          const meta = await this.getMetaDataByCache(datasheetId, effectMap);
          const field = meta?.fieldMap[relatedLinkFieldId];
          if (field?.type !== FieldType.Link && field?.type !== FieldType.OneWayLink) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          foreignDatasheetId = field.property.foreignDatasheetId;
        }
        const foreignPermission = (await getNodeRole(foreignDatasheetId, auth)) as NodePermission;
        if (!foreignPermission.readable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        // Validate permissions of reference target field
        const targetFieldPermission =
          !foreignPermission.fieldPermissionMap ||
          !foreignPermission.fieldPermissionMap[lookUpTargetFieldId] ||
          foreignPermission.fieldPermissionMap[lookUpTargetFieldId]!.permission?.readable;
        if (!targetFieldPermission) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
    }

    effectMap.set(EffectConstantName.MetaActions, resultSet.metaActions);
    effectMap.set(EffectConstantName.AttachCite, resultSet.attachCiteCollector);
    // If create record -> recordMeta in one op, and then modify this record,
    // prevRecordMeta is necessary in terms of recordMeta
    effectMap.set(EffectConstantName.RecordMetaMap, {});
    this.logger.info(`[${datasheetId}] ====> Post analyseOperates......duration: ${+new Date() - postBeginTime}ms`);

    return this.transaction;
  }

  /**
   * Collect OP related to creating fields (including fields resulted by pasting)
   */
  collectByAddField(cmd: string, action: IObjectInsertAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    resultSet.temporaryFieldMap[oiData.id] = oiData;
    if (oiData.type === FieldType.Link || oiData.type === FieldType.OneWayLink) {
      const mainDstId = resultSet.linkActionMainDstId;

      if (!mainDstId) {
        throw new ServerException(OtException.OPERATION_ABNORMAL);
      }

      // If this action is generated by current datasheet
      const isSelfAction = mainDstId === resultSet.datasheetId;

      if (isSelfAction) {
        if (!permission.fieldCreatable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      } else {
        if (oiData.property.foreignDatasheetId !== mainDstId) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        if (!resultSet.mainLinkDstPermissionMap.get(mainDstId)?.fieldCreatable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        // Operation of linked datasheet relating to creating link field, validate editable permission
        if (!permission.editable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      const { foreignDatasheetId } = oiData.property;
      this.logger.debug(`[${resultSet.datasheetId}] Create or copy link field -> linked datasheet [${foreignDatasheetId}]`);
      resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, foreignDatasheetId);
    } else {
      // Not creating linked field, check permission directly
      if (!permission.fieldCreatable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      if (oiData.type === FieldType.AutoNumber) {
        // Create AutoNumber field, needs to initialize value according to view
        const { viewIdx, nextId } = oiData.property;
        if (!nextId) {
          DatasheetOtService.setMapValIfExist(resultSet.initFieldMap, viewIdx, oiData);
        }
      } else if (oiData.type === FieldType.LookUp) {
        resultSet.toCreateLookUpProperties.push({ ...oiData.property, fieldId: oiData.id, cmd });
      } else if (oiData.type === FieldType.Formula) {
        resultSet.toChangeFormulaExpressions.push({ createExpression: oiData.property.expression, fieldId: oiData.id });
      }
    }
    resultSet.changeFieldNumber++;
  }

  /**
   * @description Collect op related to field change
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByChangeField(cmd: string, action: IObjectReplaceAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    const odData = action.od as IField;
    // Modify field name
    if (oiData.name !== odData.name) {
      if (!permission.fieldRenamable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    }
    // Modify field description
    if ('desc' in oiData && 'desc' in odData && oiData.desc !== odData.desc) {
      if (!permission.fieldPropertyEditable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    }
    // Modify field type
    if (oiData.type !== odData.type) {
      let skip = false;
      // operations on linked datasheet
      if (resultSet.linkActionMainDstId !== resultSet.datasheetId) {
        // Since the database deleted link field, link field of linked datasheet is changed to text field,
        // don't check permission
        if ((odData.type == FieldType.Link || odData.type == FieldType.OneWayLink) && odData.property.foreignDatasheetId === resultSet.linkActionMainDstId && oiData.type == FieldType.Text) {
          skip = true;
        } else if ((oiData.type == FieldType.Link || oiData.type == FieldType.OneWayLink) && oiData.property.foreignDatasheetId === resultSet.linkActionMainDstId && cmd.startsWith('UNDO:')) {
          // Since the database undo deleting link field, original link field of linked datasheet changes back to link field,
          // don't check permission
          skip = true;
        }
      }
      // Not related operation of linked datasheet, validate edit permission of field property (corresponds to manageable)
      if (!skip && !permission.fieldPropertyEditable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // Update field type in fieldMap, to facilitate later use of fieldMap
      resultSet.temporaryFieldMap[oiData.id] = oiData;
      // Deleted field type
      switch (odData.type) {
        case FieldType.OneWayLink:
        case FieldType.Link:
          const { foreignDatasheetId } = odData.property;
          resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, foreignDatasheetId);
          break;
        case FieldType.LookUp:
          resultSet.toDeleteLookUpProperties.push({ ...odData.property, fieldId: odData.id });
          break;
        case FieldType.Formula:
          resultSet.toChangeFormulaExpressions.push({ deleteExpression: odData.property.expression, fieldId: odData.id });
          break;
        case FieldType.LastModifiedBy:
          // When modifier field is deleted, need collecting, later operations will not update deleted field.property.uuids
          resultSet.cleanFieldMap.set(odData.id, odData.type);
          break;
        default:
          break;
      }
      // Modified field type
      switch (oiData.type) {
        case FieldType.OneWayLink:
        case FieldType.Link:
          const { foreignDatasheetId } = oiData.property;
          resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, foreignDatasheetId);
          break;
        case FieldType.LookUp:
          resultSet.toCreateLookUpProperties.push({ ...oiData.property, fieldId: oiData.id, cmd });
          break;
        case FieldType.Formula:
          resultSet.toChangeFormulaExpressions.push({ createExpression: oiData.property.expression, fieldId: oiData.id });
          break;
        case FieldType.AutoNumber:
          // Convert to AutoNumber field type, need to initialize value according to view
          const { viewIdx, nextId } = oiData.property;
          if (!nextId) {
            DatasheetOtService.setMapValIfExist(resultSet.initFieldMap, viewIdx, oiData);
          }
          break;
        default:
          break;
      }
    } else {
      // Type is the same, it is field property change, excludes special field operation
      const allowEditFieldTypes = [FieldType.Member];
      if (allowEditFieldTypes.includes(oiData.type)) {
        // Special field requires permission above editable
        this.checkCellValPermission(cmd, oiData.id, permission, resultSet);
      } else if (oiData.type !== FieldType.CreatedBy) {
        // Do not check permission of creator field under this condition, there is no point in checking permission
        // due to field permission.
        // Otherwise, check field property edit permission (corresponds to manageable)
        if (!permission.fieldPropertyEditable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      resultSet.temporaryFieldMap[oiData.id] = oiData;

      // Replace linked datasheet
      if (oiData.type === FieldType.Link && odData.type === FieldType.Link) {
        const oiForeignDatasheetId = oiData.property.foreignDatasheetId;
        const odForeignDatasheetId = odData.property.foreignDatasheetId;
        if (oiForeignDatasheetId === odForeignDatasheetId) {
          return;
        }
        resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, oiForeignDatasheetId);
        resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, odForeignDatasheetId);
      }
      // Replace OneWayLink datasheet
      if (oiData.type === FieldType.OneWayLink && odData.type === FieldType.OneWayLink) {
        const oiForeignDatasheetId = oiData.property.foreignDatasheetId;
        const odForeignDatasheetId = odData.property.foreignDatasheetId;
        if (oiForeignDatasheetId === odForeignDatasheetId) {
          return;
        }
        resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, oiForeignDatasheetId);
        resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, odForeignDatasheetId);
      }
      // Replace datasheet query
      if (oiData.type === FieldType.LookUp && odData.type === FieldType.LookUp) {
        let skipFieldPermission = false;
        if (
          oiData.property.relatedLinkFieldId === odData.property.relatedLinkFieldId &&
          oiData.property.lookUpTargetFieldId === odData.property.lookUpTargetFieldId
        ) {
          // If neithor linking field of lookup field nor its target field changes, don't check permission,
          // only check if referenced field set of lookup filtering condition have changed.
          skipFieldPermission = true;
          const oiReferFieldIds: string[] = [];
          const odReferFieldIds: string[] = [];
          oiData.property.filterInfo?.conditions.forEach((condition) => oiReferFieldIds.push(condition.fieldId));
          odData.property.filterInfo?.conditions.forEach((condition) => odReferFieldIds.push(condition.fieldId));
          // If referenced fields of filter condition are the same, no need to compute resource change
          if (isSameSet(oiReferFieldIds, odReferFieldIds)) {
            return;
          }
        }
        resultSet.toCreateLookUpProperties.push({ ...oiData.property, fieldId: oiData.id, cmd, skipFieldPermission });
        resultSet.toDeleteLookUpProperties.push({ ...odData.property, fieldId: odData.id });
      }
      // Replace formula
      if (oiData.type === FieldType.Formula && odData.type === FieldType.Formula) {
        if (oiData.property.expression === odData.property.expression) {
          return;
        }
        resultSet.toChangeFormulaExpressions.push({
          createExpression: oiData.property.expression,
          deleteExpression: odData.property.expression,
          fieldId: oiData.id,
        });
      }
    }
  }

  /**
   * Update op related to deleting field
   */
  collectByDeleteField(action: IObjectDeleteAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const odData = action.od as IField;
    if (odData.type === FieldType.Link || odData.type === FieldType.OneWayLink) {
      const mainDstId = resultSet.linkActionMainDstId;

      if (!mainDstId) {
        throw new ServerException(OtException.OPERATION_ABNORMAL);
      }

      // If this action is generated by current datasheet
      const isSelfAction = mainDstId === resultSet.datasheetId;

      if (isSelfAction) {
        if (!permission.fieldRemovable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      } else {
        if (odData.property.foreignDatasheetId !== mainDstId) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        if (!resultSet.mainLinkDstPermissionMap.get(mainDstId)?.fieldRemovable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        // Operation on linked field creation related to linked datasheet, check editable permission
        if (!permission.editable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      const { foreignDatasheetId } = odData.property;
      this.logger.debug(`[${resultSet.datasheetId}] Delete linked field -> linked datasheet [${foreignDatasheetId}]`);
      resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, foreignDatasheetId);
    } else {
      if (!permission.fieldRemovable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      const specialFieldTypes = [FieldType.LastModifiedTime, FieldType.CreatedTime, FieldType.CreatedBy, FieldType.AutoNumber];
      if (!specialFieldTypes.includes(odData.type)) {
        // Collect deleted fields to clean up corresponding data in fieldUpdatedMap
        resultSet.cleanFieldMap.set(odData.id, odData.type);
      }
      if (odData.type === FieldType.LookUp) {
        resultSet.toDeleteLookUpProperties.push({ ...odData.property, fieldId: odData.id });
      } else if (odData.type === FieldType.Formula) {
        resultSet.toChangeFormulaExpressions.push({ deleteExpression: odData.property.expression, fieldId: odData.id });
      }
    }
    resultSet.changeFieldNumber--;
    resultSet.toDeleteFieldIds.push(odData.id);
  }

  collectByView(action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    // Operation of current table requires permission above editable
    if (resultSet.datasheetId === resultSet.linkActionMainDstId) {
      const view = resultSet.temporaryViews[action.p[2]!] as IViewProperty;
      if (action.p.length === 3) {
        // ====== New view(including copy view) ======
        if ('li' in action) {
          if (!permission.viewCreatable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.addViews.push(action['li']);
          return;
        }
        // ====== Delete view ======
        if ('ld' in action) {
          if (!permission.viewRemovable || view?.lockInfo) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.deleteViews.push(action['ld']);
          return;
        }
        // ====== Move view ======
        if ('lm' in action) {
          if (!permission.viewMovable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          return;
        }
      } else if (action.p.length > 3) {
        switch (action.p[3]) {
          case 'name':
            // ====== View rename ======
            if (!permission.viewRenamable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'displayHiddenColumnWithinMirror':
            // ====== View displayHiddenColumnWithinMirror ======
            if (!permission.editable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'filterInfo':
            // ====== View filters ======
            if (!permission.viewFilterable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'groupInfo':
            // ====== View grouping ======
            if (!permission.fieldGroupable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'sortInfo':
            // ====== View sorting ======
            if (!permission.columnSortable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'rowHeightLevel':
            // ====== View row height ======
            if (!permission.rowHighEditable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'rows':
            // ====== View property changes caused by record creation ======
            if ('li' in action) {
              if (!permission.rowCreatable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== View property changes caused by record deletion ======
            if ('ld' in action) {
              if (!permission.rowRemovable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== View property changes caused by record movement ======
            if ('lm' in action) {
              if (!permission.rowSortable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            break;
          case 'columns':
            // ====== Hide column ======
            if ('li' in action && 'ld' in action && action.li.hidden != action.ld.hidden) {
              if (!permission.columnHideable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== Field order ======
            if ('lm' in action) {
              if (!permission.fieldSortable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== Field creation impact on view settings ======
            if ('li' in action && !('ld' in action)) {
              if (!permission.fieldCreatable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== Field deletion impact on view settings ======
            if (!('li' in action) && 'ld' in action) {
              if (!permission.fieldRemovable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            if (action.p.length < 6) {
              break;
            }
            // ====== Field width ======
            if (action.p[5] === 'width') {
              if (!permission.columnWidthEditable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== Field statistics bar ======
            if (action.p[5] === 'statType') {
              if (!permission.columnCountEditable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            break;
          case 'style':
            if (action.p.length < 5) {
              break;
            }
            if (view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            // ====== View layout ======
            if (action.p[4] === 'layoutType' || action.p[4] === 'isAutoLayout' || action.p[4] === 'cardCount') {
              if (!permission.viewLayoutEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== View style ======
            if (action.p[4] === 'isCoverFit' || action.p[4] === 'coverFieldId' || action.p[4] === 'isColNameVisible') {
              if (!permission.viewStyleEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== View key field (kanban grouping field, gantt start & end datetime field) ======
            if (action.p[4] === 'kanbanFieldId' || action.p[4] === 'startFieldId' || action.p[4] === 'endFieldId') {
              if (!permission.viewKeyFieldEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== View color option ======
            if (action.p[4] === 'colorOption') {
              if (!permission.viewColorOptionEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            break;
          case 'lock':
            // ====== View lock operation ======
            const viewIndex = action.p[2]!;
            if ('oi' in action) {
              resultSet.temporaryViews[viewIndex] = {
                ...resultSet.temporaryViews[viewIndex],
                lockInfo: action['oi'],
              };
              return;
            }
            if ('od' in action) {
              delete resultSet.temporaryViews[viewIndex]['lockInfo'];
              return;
            }
            return;
          default:
            break;
        }
      }
      // Other operation that is not analyzed
      if (!permission.editable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    } else {
      // Operations on linked datasheet, requires editable permission
      if (permission.editable || ('li' in action && permission.rowCreatable)) {
        return;
      }
      // If no, maybe this datasheet delete linking fields two-way or undo this operation, causing
      // columns change in view.
      if (action.p[3] !== 'columns') {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // Take a note to check outside later if fields exist corresponding to deleted or recovered deleted fields.
      if ('li' in action) {
        resultSet.fldOpInViewMap.set(action.li.fieldId, true);
      } else if ('ld' in action) {
        resultSet.fldOpInViewMap.set(action.ld.fieldId, false);
      } else {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    }
  }

  collectByAddWidgetIds(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // Recover widget in widget panel
      const addWidget = action['li'];
      resultSet.addWidgetIds.push(addWidget.id);
      return;
    }
    // Recover whole widget panel
    const panel = action['li'];
    const widgets: any[] = panel.widgets;
    const ids = widgets.map((item) => item.id);
    resultSet.addWidgetIds.push(...ids);
  }

  collectByDeleteWidgetOrWidgetPanels(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // Delete widget in widget panel
      const deleteWidget = action['ld'];
      resultSet.deleteWidgetIds.push(deleteWidget.id);
      return;
    }
    // Delete whole widget panel
    const panel = action['ld'];
    const widgets: any[] = panel.widgets;
    const ids = widgets.map((item) => item.id);
    resultSet.deleteWidgetIds.push(...ids);
  }

  /**
   * Processes data Operation that are related to Meta
   *
   * @param action
   * @param permission
   * @param resultSet
   */
  dealWithMeta(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (action.p[1] === 'fieldMap') {
      // ===== Field operation BEGIN =====
      /**
       * Field operation, check permission above manageable.
       * Member field is special, value update requires updating field property, so don't intercept here,
       * check by field type. Since Creation, update and deletion is fine-grained.
       * Now begin fine-grained field permision checking
       */
      // ====== New field(including copy field) ======
      if ('oi' in action && !('od' in action)) {
        // Create field or copy field
        this.collectByAddField(cmd, action, permission, resultSet);
        return;
      }
      // ====== Modify field ======
      if ('oi' in action && 'od' in action) {
        this.collectByChangeField(cmd, action, permission, resultSet);
        return;
      }
      // ====== Delete field ======
      if (!('oi' in action) && 'od' in action) {
        this.collectByDeleteField(action, permission, resultSet);
        return;
      }
      // ===== Field operation END =====
    } else if (action.p[1] === 'views') {
      // ===== View operations =====
      this.collectByView(action, permission, resultSet);
    } else if (action.p[1] === 'widgetPanels') {
      // ===== Operations on widget panel =====
      // Creation/deletion of widgets related to widget panel requires manageable permissoin
      if (!permission.manageable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      if ('ld' in action) {
        this.collectByDeleteWidgetOrWidgetPanels(action, resultSet);
      }
    }
  }

  /**
   * Collect operations related to record operations
   */
  collectByOperateForRow(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const recordId = action.p[1] as string;
    const autoSubscriptionFields = this.getAutoSubscriptionFields(resultSet.temporaryFieldMap);

    if ('oi' in action && (cmd === 'UnarchiveRecords')) {
      if (!permission.rowUnarchivable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // Create record (copy record)
      // Get oi, if multiple records then get 'data', otherwise get original value
      const oiData = action.oi;
      if (!oiData) {
        // Malformed action, oi can not be null or undefined
        throw new ServerException(CommonException.SERVER_ERROR);
      }
      let recordData = 'data' in oiData ? oiData.data : oiData;
      recordData = { ...recordData };
      // Filter null cells
      Object.keys(recordData).forEach((fieldId) => {
        if (recordData[fieldId] == null) {
          delete recordData[fieldId];
          return;
        }
        // check permission
        this.checkCellValPermission(cmd, fieldId, permission, resultSet);
      });
      // Recover record after deleting record, clear record deletion collection
      if (resultSet.toArchiveRecordIds.includes(recordId)) {
        resultSet.toArchiveRecordIds.splice(resultSet.toArchiveRecordIds.indexOf(recordId), 1);
        return;
      }
      resultSet.toUnarchiveRecord.set(recordId, recordData);
    } else if ('oi' in action) {
      if (!permission.rowCreatable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // Create record (copy record)
      // Get oi, if multiple records then get 'data', otherwise get original value
      const oiData = action.oi;
      if (!oiData) {
        // Malformed action, oi can not be null or undefined
        throw new ServerException(CommonException.SERVER_ERROR);
      }

      let recordData = 'data' in oiData ? oiData.data : oiData;
      recordData = { ...recordData };
      // Filter null cells
      Object.keys(recordData).forEach((fieldId) => {
        if (recordData[fieldId] == null) {
          delete recordData[fieldId];
          return;
        }
        // check permission
        this.checkCellValPermission(cmd, fieldId, permission, resultSet);
      });
      // Recover record after deleting record, clear record deletion collection
      if (resultSet.toDeleteRecordIds.includes(recordId)) {
        resultSet.toDeleteRecordIds.splice(resultSet.toDeleteRecordIds.indexOf(recordId), 1);
        return;
      }
      resultSet.toCreateRecord.set(recordId, recordData);
      this.collectRecordSubscriptions(autoSubscriptionFields, recordId, recordData, undefined, resultSet);
    }

    if ('od' in action && (cmd === 'ArchiveRecords')) {
      if (!permission.rowArchivable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      if (resultSet.cleanRecordCellMap.has(recordId)) {
        resultSet.cleanRecordCellMap.delete(recordId);
      }
      if (resultSet.replaceCellMap.has(recordId)) {
        resultSet.replaceCellMap.delete(recordId);
      }
      resultSet.toArchiveRecordIds.push(recordId);
    } else if ('od' in action) {
      if (!permission.rowRemovable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // If any change happens to cells in the record before record deletion, these changes are discarded.
      if (resultSet.cleanRecordCellMap.has(recordId)) {
        resultSet.cleanRecordCellMap.delete(recordId);
      }
      if (resultSet.replaceCellMap.has(recordId)) {
        resultSet.replaceCellMap.delete(recordId);
      }
      // Delete record after creating record, clear record creation collection
      if (resultSet.toCreateRecord.has(recordId)) {
        resultSet.toCreateRecord.delete(recordId);
        return;
      }
      resultSet.toDeleteRecordIds.push(recordId);
      this.collectRecordSubscriptions(autoSubscriptionFields, recordId, undefined, action.od, resultSet);
    }
  }

  /**
   *  Collect operations related to Record Meta -> fieldExtraMap
   */
  collectRecordMetaOperations(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (action.p[0] !== 'recordMap' || action.p[2] !== 'recordMeta') {
      return;
    }

    // Collect record alarms (['recordMap', ':recordId', 'recordMeta', 'fieldExtraMap', ':fieldId', 'alarm')
    if (action.p[3] === 'fieldExtraMap' && action.p[5] === 'alarm') {
      this.collectRecordAlarmOperations(cmd, action, permission, resultSet);
    }
  }

  /**
   * Collect operations related to Record Alarm
   */
  collectRecordAlarmOperations(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const recordId = action.p[1] as string;
    const fieldId = action.p[4] as string;
    this.checkCellValPermission(cmd, fieldId, permission, resultSet);

    if ('oi' in action) {
      const payload = action.oi;
      let existAlarms = resultSet.toCreateAlarms.get(recordId) || [];
      existAlarms = existAlarms.filter((alarm: IRecordAlarm) => alarm.id !== payload.id);
      existAlarms.push({ ...payload, recordId, fieldId });
      resultSet.toCreateAlarms.set(recordId, existAlarms);
    }

    if ('od' in action) {
      const payload = action.od;
      let existAlarms = resultSet.toDeleteAlarms.get(recordId) || [];
      existAlarms = existAlarms.filter((alarm: IRecordAlarm) => alarm.id !== payload.id);
      existAlarms.push({ ...payload, recordId, fieldId });
      resultSet.toDeleteAlarms.set(recordId, existAlarms);
    }
  }

  /**
   * Collect op related to cell data change
   */
  collectByOperateForCellValue(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const recordId = action.p[1] as string;
    const fieldId = action.p[3] as string;
    // Validate permission
    this.checkCellValPermission(cmd, fieldId, permission, resultSet);
    const autoSubscriptionFields = this.getAutoSubscriptionFields(resultSet.temporaryFieldMap);
    if ('oi' in action) {
      // oi exists means writing data
      const data = action.oi;
      const fieldData: any[] = resultSet.cleanRecordCellMap.get(recordId);
      if (fieldData && fieldData.find((cur) => cur['fieldId'] === fieldId)) {
        // writing cell data, ignoring former cell clearing operations.
        resultSet.cleanRecordCellMap.set(
          recordId,
          fieldData.filter((cur) => {
            return cur['fieldId'] !== fieldId;
          }),
        );
      }
      this.collectRecordSubscriptions(autoSubscriptionFields, recordId, { [fieldId]: data }, { [fieldId]: action['od'] }, resultSet);
      const addRecordData = resultSet.toCreateRecord.get(recordId);
      if (addRecordData) {
        // Create record and change this record, record change can be merged into record creation
        addRecordData[fieldId] = data;
        resultSet.toCreateRecord.set(recordId, addRecordData);
        return;
      }
      DatasheetOtService.setMapValIfExist(resultSet.replaceCellMap, recordId, { fieldId, data });
    } else if ('od' in action) {
      const fieldData: any[] = resultSet.replaceCellMap.get(recordId);
      if (fieldData && fieldData.find((cur) => cur['fieldId'] === fieldId)) {
        // If cell is cleared after cell change, just clear the cell
        resultSet.replaceCellMap.set(
          recordId,
          fieldData.filter((cur) => {
            return cur['fieldId'] !== fieldId;
          }),
        );
      }
      this.collectRecordSubscriptions(autoSubscriptionFields, recordId, { [fieldId]: action['oi'] }, { [fieldId]: action.od }, resultSet);
      const addRecordData = resultSet.toCreateRecord.get(recordId);
      if (addRecordData && addRecordData[fieldId]) {
        // Check new record with default values, if cell is cleared, just clear the default value
        delete addRecordData[fieldId];
        resultSet.toCreateRecord.set(recordId, addRecordData);
        return;
      }
      // Only od exists, delete cell data
      DatasheetOtService.setMapValIfExist(resultSet.cleanRecordCellMap, recordId, { fieldId });
    }
  }

  /**
   * Collect op related to comment
   */
  private async collectByOperateForComment(action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (!permission.readable) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    const recordId = action.p[1] as string;

    if (!action.p.includes('emojis')) {
      // Delete comment
      if ('ld' in action || 'od' in action) {
        const comment = ('ld' in action ? action['ld'] : action['od'][0]) as IComments;
        const canDeleteComment = await this.recordCommentService.checkDeletePermission(resultSet.auth, comment.unitId, permission.uuid);
        if (!canDeleteComment) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        DatasheetOtService.setMapValIfExist(resultSet.toDeleteCommentIds, recordId, comment.commentId);
      }
      // Create comment
      if (('li' in action || 'oi' in action) && action.p.includes('comments')) {
        const comment = 'li' in action ? action.li : action['od'];
        DatasheetOtService.setMapValIfExist(resultSet.toCorrectComment, recordId, { index: action.p[action.p.length - 1], comment: comment });
      }
    } else {
      // Add emoji to comment
      if ('li' in action || 'ld' in action) {
        const comment = 'li' in action ? action.li : action.ld;
        DatasheetOtService.setMapValIfExist(resultSet.toUpdateCommentEmoji, recordId, { emojiAction: Boolean('li' in action), comment: comment });
      }
    }
  }

  /**
   * Process data related to RecordMap
   */
  private async dealWithRecordMap(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    // ===== Record operation  BEGIN =====
    if (!(action.p.includes('commentCount') || action.p.includes('comments')) && action.p[0] === 'recordMap') {
      // Cell data operation
      if (action.p.includes('data')) {
        this.collectByOperateForCellValue(cmd, action, permission, resultSet);
        return;
      }

      // RecordMeta -> fieldExtraMap operation (alarm)
      if (action.p.includes('recordMeta') && action.p.includes('fieldExtraMap')) {
        this.collectRecordMetaOperations(cmd, action, permission, resultSet);
        return;
      }

      // Record data operation
      this.collectByOperateForRow(cmd, action, permission, resultSet);
    }
    // ===== Record operation END =====

    // ===== Comment collection operation BEGIN ====
    if (action.n !== OTActionName.ObjectInsert && action.p.includes('comments') && action.p[0] === 'recordMap') {
      await this.collectByOperateForComment(action, permission, resultSet);
    }
    // ===== Comment collection operation END ====
  }

  transaction = async (manager: EntityManager, effectMap: Map<string, any>, commonData: ICommonData, resultSet: { [key: string]: any }) => {
    const beginTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> transaction start......`);
    // ======== Fix comment time BEGIN ========
    await this.handleUpdateComment(manager, commonData, effectMap, resultSet);
    // ======== Fix comment time END ========

    // ======== Batch delete record BEGIN ========
    await this.handleBatchDeleteRecord(manager, commonData, resultSet);
    // ======== Batch delete record END ========

    // ======= Batch archive record BEGIN ========
    await this.handleBatchArchiveRecord(manager, commonData, resultSet);
    // ======= Batch archive record END ========

    // ======== Batch delete widget BEGIN ========
    await this.handleBatchDeleteWidget(manager, commonData, resultSet);
    // ======== Batch delete widget END ========

    // ======== Batch create widget BEGIN ========
    await this.handleBatchAddWidget(manager, commonData, resultSet);
    // ======== Batch create widget END ========

    // ======== Batch clear cell data BEGIN ========
    await this.handleBatchUpdateCell(manager, commonData, effectMap, true, resultSet);
    // ======== Batch clear cell data END ========

    // ======== Batch create record BEGIN ========
    await this.handleBatchCreateRecord(manager, commonData, effectMap, resultSet);
    // ======== Batch create record END ========

    // ======== Batch unarchive record BEGIN ========
    await this.handleBatchUnarchiveRecord(manager, commonData, resultSet);
    // ======== Batch unarchive record END ========

    // ======== Batch update cell BEGIN ========
    await this.handleBatchUpdateCell(manager, commonData, effectMap, false, resultSet);
    // ======== Batch update cell END ========

    // ======== Delete comment BEGIN ========
    await this.deleteRecordComment(manager, commonData, resultSet);
    // ======== Delete comment END ========

    // ======== Initialize part of fields that need initial value BEGIN ========
    await this.handleBatchInitField(manager, commonData, effectMap, resultSet);
    // ======== Initialize part of fields that need initial value END ========

    // ======== Create/delete comment emoji BEGIN ========
    await this.handleCommentEmoji(manager, commonData, resultSet);
    // ======== Create/delete comment emoji END ========

    // ======== Create/delete datetime alarm BEGIN ========
    await this.recordAlarmService.handleRecordAlarms(manager, commonData, resultSet);
    // ======== Create/delete datetime alarm END ========

    // Update database parallelly
    await Promise.all([
      // update Meta
      this.handleMeta(manager, commonData, effectMap),
      // Always add changeset; operations and revision are stored as received from client, adding revision suffices
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
      // Update revision of main datasheet
      this.updateRevision(manager, commonData),
    ]);
    // Clear field permissions of deleted fields
    if (resultSet.toDeleteFieldIds.length > 0) {
      await this.restService.delFieldPermission(resultSet.auth, commonData.dstId, resultSet.toDeleteFieldIds);
    }
    const endTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> transaction finished......duration: ${endTime - beginTime}ms`);
  };

  private checkCellValPermission(cmd: string, fieldId: string, permission: NodePermission, resultSet: { [key: string]: any }) {
    // When field permission set exists and contains current field, checking editable permission of the field only,
    // node permission does not matter
    let hasPermission = permission.cellEditable;
    if (permission.fieldPermissionMap && permission.fieldPermissionMap[fieldId]) {
      if (resultSet.sourceType === SourceTypeEnum.FORM) {
        hasPermission = permission.fieldPermissionMap[fieldId]!.setting?.formSheetAccessible;
      } else {
        hasPermission = permission.fieldPermissionMap[fieldId]!.permission?.editable;
      }
    }

    // Validate node permission or field permission
    if (!hasPermission) {
      // No enough permission, reject this operation
      if (resultSet.datasheetId === resultSet.linkActionMainDstId) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      } else {
        // Operation on linked datasheet, may be related change of linked datasheet,
        // permission will be validated outside, record it here
        resultSet.fldOpInRecMap.set(fieldId, cmd);
      }
    }
  }

  /**
   * Update number of references of attachment
   *
   * @param action OT action
   * @param resultSet collector
   * @param _fieldMap column data
   */
  private handleAttachOpCite(action: IJOTAction, resultSet: { [key: string]: any }, _fieldMap: IFieldMap) {
    let result;
    // cell operation
    if (action.p.includes('data')) {
      result = this.handleAttachForCellValue(action, resultSet.spaceCapacityOverLimit);
    } else {
      // row data operation
      result = this.handleAttachForRow(action, resultSet.spaceCapacityOverLimit);
    }
    // addToken and removeToken are guaranteed empty arrays
    resultSet.attachCiteCollector.addToken.push(...result.addToken);
    resultSet.attachCiteCollector.removeToken.push(...result.removeToken);
  }

  private handleAttachForCellValue(action: IJOTAction, capacityOverLimit: boolean): { addToken: IOpAttach[]; removeToken: IOpAttach[] } {
    let addToken: any[] = [];
    let removeToken: any[] = [];
    if ('oi' in action && !('od' in action)) {
      if (DatasheetOtService.isAttachField(action.oi)) {
        ExceptionUtil.isTrue(capacityOverLimit, OtException.SPACE_CAPACITY_OVER_LIMIT);
        addToken = action.oi.map((item: any) => {
          return { token: item.token, name: item.name };
        });
      }
    }
    // Only deletion, no need to check, only collecting data
    if ('od' in action && !('oi' in action)) {
      if (DatasheetOtService.isAttachField(action.od)) {
        removeToken = action.od.map((item: any) => {
          return { token: item.token, name: item.name };
        });
      }
    }
    // Both deletion and insertion, need to compare deleted data and inserted data to check if it is partial deletion
    if ('oi' in action && 'od' in action) {
      // Delete attachment partially
      if (DatasheetOtService.isAttachField(action.oi) && DatasheetOtService.isAttachField(action.od)) {
        const odId = (action.od as IAttachmentValue[]).reduce<string[]>((pre, cur: IAttachmentValue) => {
          pre.push(cur.id);
          removeToken.push({ token: cur.token, name: cur.name });
          return pre;
        }, []);
        const oiId = (action.oi as IAttachmentValue[]).reduce<string[]>((pre, cur: IAttachmentValue) => {
          pre.push(cur.id);
          addToken.push({ token: cur.token, name: cur.name });
          return pre;
        }, []);
        // Check if the length of intersection is the same as oi's, if so, it is partial deletion and no need to check,
        // otherwise it may be covering pasting and needs checking.
        ExceptionUtil.isTrue(capacityOverLimit && intersection(odId, oiId).length !== oiId.length, OtException.SPACE_CAPACITY_OVER_LIMIT);
      }
    }
    return { addToken, removeToken };
  }

  private handleAttachForRow(action: IJOTAction, overLimit: boolean): { addToken: IOpAttach[]; removeToken: IOpAttach[] } {
    const addToken: IOpAttach[] = [];
    const removeToken: IOpAttach[] = [];
    // Record action can only be one of oi or od.
    if ('oi' in action) {
      const recordData = 'data' in action.oi ? action.oi.data : action.oi;
      for (const fieldId in recordData) {
        if (recordData[fieldId] && DatasheetOtService.isAttachField(recordData[fieldId])) {
          ExceptionUtil.isTrue(overLimit, OtException.SPACE_CAPACITY_OVER_LIMIT);
          (recordData[fieldId] as IAttachmentValue[]).map((item) => {
            addToken.push({ token: item.token, name: item.name });
          });
        }
      }
    }
    // Only deletion, no need to check, only collect data
    if ('od' in action) {
      const recordData = 'data' in action.od ? action.od.data : action.od;
      for (const fieldId in recordData) {
        if (recordData[fieldId] && DatasheetOtService.isAttachField(recordData[fieldId])) {
          (recordData[fieldId] as IAttachmentValue[]).map((item) => {
            removeToken.push({ token: item.token, name: item.name });
          });
        }
      }
    }
    return { addToken, removeToken };
  }

  private async handleUpdateComment(manager: EntityManager, commonData: ICommonData, effectMap: Map<string, any>, resultSet: { [key: string]: any }) {
    if (!resultSet.toCorrectComment.size) {
      return;
    }

    const { userId, dstId, revision } = commonData;
    const remoteChangeset = effectMap.get(EffectConstantName.RemoteChangeset);
    const recordIds = [...resultSet.toCorrectComment.keys()];
    const isRecordDeleted = await this.recordService.isRecordsDeleted(dstId, recordIds);
    if (isRecordDeleted) {
      throw new ServerException(OtException.REVISION_ERROR);
    }
    const operationChangeset: any[] = [];
    const recordCommentEntities: any[] = [];
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch creating record comment......`);
    for (const [recordId, comments] of resultSet.toCorrectComment.entries()) {
      for (const { index, comment } of comments) {
        const serverDate = new Date();
        if (comment?.commentMsg?.reply) {
          update(comment, 'commentMsg.reply', (value) => pick(value, 'commentId'));
        }
        recordCommentEntities.push({
          id: IdWorker.nextId().toString(),
          dstId: remoteChangeset.resourceId,
          recordId,
          commentId: comment.commentId,
          commentMsg: comment.commentMsg,
          revision,
          // TODO change to unitId
          unitId: comment.unitId,
          createdBy: userId,
          createdAt: serverDate,
        });
        const action = {
          n: OTActionName.ListReplace,
          p: ['recordMap', recordId, 'comments', index],
          ld: comment,
          li: {
            ...comment,
            createdAt: +serverDate,
          },
        };
        operationChangeset.push(action);
      }
    }
    // Batch create
    await manager
      .createQueryBuilder()
      .insert()
      .into(RecordCommentEntity)
      .values(recordCommentEntities)
      // If not set to false, SELECT will be executed after insertion,
      // efficiency will be seriously impacted.
      .updateEntity(false)
      .execute();
    // update remoteChangeSet
    const remoteChangeOperations = [{ cmd: CollaCommandName.SystemCorrectComment, actions: operationChangeset }];
    this.updateEffectMap(effectMap, EffectConstantName.RemoteChangeset, remoteChangeOperations);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch creating record comment......duration: ${endTime - beginTime}ms`);
  }

  private async handleBatchArchiveRecord(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (resultSet.toArchiveRecordIds.length === 0) {
      return;
    }
    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] archive record`);
    }
    const recordUpdateProp = {
      revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
      revision,
      updatedBy: userId,
    };

    const saveArchiveRecordEntities: any[] = [];
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch archive record......`);

    for (const recordId of resultSet.toArchiveRecordIds) {
      saveArchiveRecordEntities.push({
        id: IdWorker.nextId().toString(),
        dstId,
        recordId,
        isArchived: true,
        archivedBy: userId,
        createdBy: userId,
        updatedBy: userId,
      });
    }

    if (saveArchiveRecordEntities.length > 0) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${dstId}] Batch archive record`);
      }

      const updateChunkList = chunk(resultSet.toArchiveRecordIds, 3000);
      for (const entities of updateChunkList) {
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set(recordUpdateProp)
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id IN(:...ids)', { ids: entities })
          .execute();
      }
      const chunkList = chunk(saveArchiveRecordEntities, 3000);
      for (const entities of chunkList) {
        await manager
          .createQueryBuilder()
          .insert()
          .into(DatasheetRecordArchiveEntity)
          .values(entities)
          .orUpdate({
            conflict_target: ['dstId', 'recordId'],
            columns: ['is_archived', 'archived_by', 'archived_at', 'updated_by'],
            overwrite: ['is_archived', 'archived_by', 'archived_at', 'updated_by'],
          })
          // If not set to false, SELECT will be executed after insertion,
          // efficiency will be seriously impacted.
          .updateEntity(false)
          .execute();
      }
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch archive record......duration: ${endTime - beginTime}ms`);
  }

  /**
   * Batch delete record
   *
   * @param manager database manager
   * @param commonData common data, including userId, uuid, dstId and revision
   * @param resultSet
   */
  private async handleBatchDeleteRecord(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (resultSet.toDeleteRecordIds.length === 0) {
      return;
    }

    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Soft delete record`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch deleting record......`);
    let values;
    const baseProps = {
      isDeleted: true,
      revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
      revision,
      updatedBy: userId,
    };
    // Check if operator has editable permission for all fields, if so, clear data
    const allFieldCanEdit = commonData.permission.fieldPermissionMap
      ? !Object.values(commonData.permission.fieldPermissionMap).find((val) => !val.permission.editable)
      : true;
    if (allFieldCanEdit) {
      values = { data: {}, ...baseProps };
    } else {
      values = { ...baseProps };
    }
    const archivedValues = {
      isDeleted: true,
      updatedBy: userId,
    };

    // Batch operation, split in chunks if exceeds 1000 records
    const gap = 1000;
    if (resultSet.toDeleteRecordIds.length > gap) {
      const times = Math.ceil(resultSet.toDeleteRecordIds.length / gap);
      for (let i = 0; i < times; i++) {
        const deletedRecordIds = resultSet.toDeleteRecordIds.slice(i * gap, (i + 1) * gap);
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set(values)
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id IN(:...ids)', { ids: deletedRecordIds })
          .execute();

        await manager
          .createQueryBuilder()
          .update(DatasheetRecordArchiveEntity)
          .set(archivedValues)
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id IN(:...ids)', { ids: deletedRecordIds })
          .execute();
      }
    } else {
      await manager
        .createQueryBuilder()
        .update(DatasheetRecordEntity)
        .set(values)
        .where('dst_id = :dstId', { dstId })
        .andWhere('record_id IN(:...ids)', { ids: resultSet.toDeleteRecordIds })
        .execute();

      await manager
        .createQueryBuilder()
        .update(DatasheetRecordArchiveEntity)
        .set(archivedValues)
        .where('dst_id = :dstId', { dstId })
        .andWhere('record_id IN(:...ids)', { ids: resultSet.toDeleteRecordIds })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch deleting record......duration: ${endTime - beginTime}ms`);
  }

  private async handleBatchDeleteWidget(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[Soft delete widget]');
    }
    if (!resultSet.deleteWidgetIds.length) {
      return;
    }
    const { userId, dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch deleting widget......`);
    await manager
      .createQueryBuilder()
      .update(WidgetEntity)
      .set({
        updatedBy: userId,
        isDeleted: true,
      })
      .where('widget_id IN(:...widgetId)', { widgetId: resultSet.deleteWidgetIds })
      .execute();
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch deleting widget......duration: ${endTime - beginTime}ms`);
  }

  private async handleBatchAddWidget(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[Soft recover widget]');
    }
    if (!resultSet.addWidgetIds.length) {
      return;
    }
    const { userId, dstId } = commonData;
    const beginTime = +new Date();
    const deleteWidgetIds = await this.widgetService.getDelWidgetIdsByNodeId(dstId);
    if (!deleteWidgetIds.length) {
      return;
    }
    this.logger.info(`[${dstId}] ====> Start batch recovering widget......`);
    const recoverWidgetIds: string[] = [];
    for (const widgetId of resultSet.addWidgetIds) {
      if (deleteWidgetIds.includes(widgetId)) {
        recoverWidgetIds.push(widgetId);
      }
    }
    // Batch operation
    if (recoverWidgetIds.length > 0) {
      await manager
        .createQueryBuilder()
        .update(WidgetEntity)
        .set({
          updatedBy: userId,
          isDeleted: false,
        })
        .where('widget_id IN(:...widgetId)', { widgetId: recoverWidgetIds })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch recovering widget......duration: ${endTime - beginTime}ms`);
  }

  /**
   * Batch update cell data
   *
   * @param manager database manager
   * @param commonData common data, including userId, uuid, dstId and revision
   * @param effectMap effect variable collection
   * @param isDelete if action is deleting cell content
   * @param resultSet
   */
  private async handleBatchUpdateCell(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    isDelete: boolean,
    resultSet: { [key: string]: any },
  ) {
    const recordFieldMap = isDelete ? resultSet.cleanRecordCellMap : resultSet.replaceCellMap;
    if (!recordFieldMap.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const prevRecordMap = await this.recordService.getBasicRecordsByRecordIds(dstId, [...recordFieldMap.keys()]);
    const recordMetaMap = effectMap.get(EffectConstantName.RecordMetaMap);
    const recordMapActions: IJOTAction[] = [];
    const updatedAt = Date.now();
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch updating cell data......`);

    // Batch update cell data
    for (const [recordId, cellData] of recordFieldMap) {
      if (!cellData.length) {
        continue;
      }
      // Record in current database
      const oldRecord: IRecord = prevRecordMap[recordId]!;
      // Take latest recordMeta from the current op with priority, or take recordMeta in database
      const oldRecordMeta: IRecordMeta = recordMetaMap[recordId] || oldRecord?.recordMeta || {};
      const fieldUpdatedMap: IFieldUpdatedMap = oldRecordMeta.fieldUpdatedMap || {};
      // Field IDs that need clean-up
      const toCleanFieldIds = [...resultSet.cleanFieldMap.keys()].filter((fieldId) => {
        return resultSet.cleanFieldMap.get(fieldId) !== FieldType.LastModifiedBy;
      });

      cellData.forEach((fieldData: any) => {
        const fieldId = fieldData.fieldId;

        // The update is cell value deletion and the cell's fieldId is within deleted fields, clean up recordMeta.fieldUpdatedMap
        if (isDelete && toCleanFieldIds.includes(fieldId)) {
          delete fieldUpdatedMap[fieldId];
          return;
        }
        const prevFieldUpdatedInfo = fieldUpdatedMap[fieldId] || {};
        // Update 'at' and 'by' in fieldUpdatedMap corresponding to fieldId
        fieldUpdatedMap[fieldId] = { ...prevFieldUpdatedInfo, at: updatedAt, by: uuid };
      });

      // Construct latest recordMeta
      const newRecordMeta: IRecordMeta = produce(oldRecordMeta, (draft) => {
        if (!Object.keys(fieldUpdatedMap).length) {
          delete draft.fieldUpdatedMap;
        } else {
          draft.fieldUpdatedMap = fieldUpdatedMap;
        }

        return draft;
      });

      if (isDelete) {
        const jsonParams = cellData.reduce((pre: any, cur: any) => {
          pre += `, '$.${cur.fieldId}'`;
          return pre;
        }, '');

        // Delete cell content in database
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set({
            data: () => `JSON_REMOVE(data ${jsonParams})`,
            recordMeta: newRecordMeta,
            revision,
            revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
            updatedBy: userId,
          })
          .where([{ dstId, recordId }])
          .execute();
      } else {
        const params: string[] = [];
        const jsonParams = cellData.reduce((pre: any, cur: any) => {
          pre += `, '$.${cur.fieldId}', CAST(? AS JSON)`;
          params.push(JSON.stringify(cur.data));
          return pre;
        }, '');

        // Update cell content in database
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set({
            data: () => `JSON_SET(data ${jsonParams})`,
            recordMeta: newRecordMeta,
            revision,
            revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
            isDeleted: false,
            updatedBy: userId,
          })
          .where([{ dstId, recordId }])
          .setNativeParameters(params)
          .execute();
      }

      // Actions<setRecord> in middle layer that are synced to client
      // If currently neither op nor database has record.recordMeta, create one
      if (!recordMetaMap[recordId] && !oldRecord?.recordMeta) {
        const recordAction = DatasheetOtService.generateJotAction(OTActionName.ObjectInsert, ['recordMap', recordId, 'recordMeta'], newRecordMeta);
        recordMapActions.push(recordAction);
      } else if (!recordMetaMap[recordId] && oldRecord?.recordMeta && !oldRecord?.recordMeta.fieldUpdatedMap) {
        const recordAction = DatasheetOtService.generateJotAction(
          OTActionName.ObjectInsert,
          ['recordMap', recordId, 'recordMeta', 'fieldUpdatedMap'],
          newRecordMeta.fieldUpdatedMap,
        );
        recordMapActions.push(recordAction);
      } else {
        const recordAction = DatasheetOtService.generateJotAction(
          OTActionName.ObjectReplace,
          ['recordMap', recordId, 'recordMeta', 'fieldUpdatedMap'],
          newRecordMeta.fieldUpdatedMap,
          oldRecordMeta.fieldUpdatedMap,
        );
        recordMapActions.push(recordAction);
      }
    }

    // As all changes in middle layer need to be synced to client, here effect change is performed, including meta and remoteChangeset
    const meta: IMeta = await this.getMetaDataByCache(dstId, effectMap);
    const fieldList: IField[] = Object.values(meta.fieldMap);
    // Obtains all LastModifiedBy fields according to meta
    const lastModifiedFields = fieldList.filter(({ type, id }) => type === FieldType.LastModifiedBy && !resultSet.cleanFieldMap.get(id));
    // Collect UUID into field.property.uuids, and return corresponding actions
    const metaActions = await this.getMetaActionByFieldType({ uuid, fields: lastModifiedFields }, effectMap);
    // Update remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch updating cell data......duration: ${endTime - beginTime}ms`);
  }

  /**
   * Batch create records
   *
   * @param manager database manager
   * @param commonData common data, including userId, uuid, dstId and revision
   * @param effectMap effect variable collection
   * @param resultSet
   */
  private async handleBatchCreateRecord(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any },
  ) {
    if (!resultSet.toCreateRecord.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch creating records......`);

    const restoreRecordMap = new Map<string, IRestoreRecordInfo>();
    const recordIds = [...resultSet.toCreateRecord.keys()];
    const saveRecordEntities: any[] = [];
    const recordMapActions: IJOTAction[] = [];
    const metaActions: IJOTAction[] = [];

    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Batch query datasheet records [${recordIds.toString()}]`);
    }

    // Query if is deleted formerly, avoid redundant insertion
    const deletedRecordMap = await this.recordService.getBasicRecordsByRecordIds(dstId, recordIds, true);
    const deletedRecordIds = Object.keys(deletedRecordMap);
    const meta = await this.getMetaDataByCache(dstId, effectMap);
    const fieldList: IField[] = Object.values(meta.fieldMap);
    const autoNumberFields = fieldList.filter((field) => field.type === FieldType.AutoNumber);
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const recordMetaMap = effectMap.get(EffectConstantName.RecordMetaMap);
    let recordIndex = 0;

    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`Deleted records [${deletedRecordIds}]`);
    }
    for (const [recordId, recordData] of resultSet.toCreateRecord.entries()) {
      // Recover record and replace data
      if (deletedRecordIds.includes(recordId)) {
        // Process CreatedAt/UpdatedAt/CreatedBy/UpdatedBy/AutoNumber data
        const prevRecordMeta = deletedRecordMap[recordId]!.recordMeta;
        const curRecordInfo: IRestoreRecordInfo = { data: recordData };
        const fieldUpdatedMap = prevRecordMeta?.fieldUpdatedMap || {};
        const fieldExtraMap = prevRecordMeta?.fieldExtraMap || {};

        // TODO When cell alarm is changed to async created, remove this code block.
        // Write recordMeta.fieldExtraMap when creating cell alarm
        if (resultSet.toCreateAlarms.size) {
          const createAlarms = resultSet.toCreateAlarms.get(recordId) || [];
          createAlarms.forEach((alarm: IRecordAlarm) => {
            const alarmCopy = { ...alarm };
            delete alarmCopy.recordId;
            delete alarmCopy.fieldId;

            fieldExtraMap[alarm.fieldId!] = { alarm: alarmCopy };
          });
        }

        if (recordData) {
          Object.keys(recordData).forEach((fieldId) => {
            fieldUpdatedMap[fieldId] = fieldUpdatedMap[fieldId]
              ? {
                ...fieldUpdatedMap[fieldId],
                at: updatedAt,
                by: uuid,
              }
              : { at: updatedAt, by: uuid };
          });
        }
        // Merge field data in original 'data'
        for (const [fieldId, cellVal] of Object.entries(deletedRecordMap[recordId]!.data)) {
          if (fieldId in recordData) {
            continue;
          }
          recordData[fieldId] = cellVal;
        }
        if (prevRecordMeta) {
          const recordMeta = {
            ...prevRecordMeta,
            fieldUpdatedMap,
            fieldExtraMap,
          };
          const recordAction = DatasheetOtService.generateJotAction(OTActionName.ObjectInsert, ['recordMap', recordId, 'recordMeta'], recordMeta);
          curRecordInfo.recordMeta = recordMeta;
          recordMapActions.push(recordAction);
          recordMetaMap[recordId] = recordMeta;
        }
        // Use same recordId, replace 'data' value
        restoreRecordMap.set(recordId, curRecordInfo);
      } else {
        const updateFieldIds = Object.keys(recordData);
        const fieldUpdatedMap: IFieldUpdatedMap = {};

        // Field IDs that need initialization, record its modified time and modifier
        if (updateFieldIds.length) {
          updateFieldIds.forEach((fieldId) => {
            fieldUpdatedMap[fieldId] = { at: updatedAt, by: uuid };
          });
        }

        // Process AutoNumber field type, store in fieldUpdateMap
        if (autoNumberFields.length > 0) {
          autoNumberFields.forEach((field) => {
            const fieldId = field.id;
            const nextId = field.property.nextId + recordIndex || 1;
            fieldUpdatedMap[fieldId] = { autoNumber: nextId };
          });
          recordIndex++;
        }

        // 1. If create record direcly, no need to add modified time and modifier, namely don't update fieldUpdateMap
        // 2. If copy multiple records direcly, cell is not empty and existing records is not enough for pasting,
        //    need to add modified time and modifier, namely update fieldUpdateMap
        // 3. If AutoNumber is added, must update fieldUpdateMap
        const newRecordMeta =
          updateFieldIds.length || autoNumberFields.length
            ? {
              createdAt,
              createdBy: uuid,
              fieldUpdatedMap,
            }
            : { createdAt, createdBy: uuid };

        // TODO Delete this code block after cell alarm is changed to async creation
        // Write recordMeta.fieldExtraMap when creating cell alarm
        const fieldExtraMap = {};
        if (resultSet.toCreateAlarms.size) {
          const createAlarms = resultSet.toCreateAlarms.get(recordId) || [];
          createAlarms.forEach((alarm: IRecordAlarm) => {
            const alarmCopy = { ...alarm };
            delete alarmCopy.recordId;
            delete alarmCopy.fieldId;

            fieldExtraMap[alarm.fieldId!] = { alarm: alarmCopy };
          });
        }

        const newMetaWithFieldExtra = isEmpty(fieldExtraMap) ? newRecordMeta : { ...newRecordMeta, fieldExtraMap };

        // Create record
        saveRecordEntities.push({
          id: IdWorker.nextId().toString(),
          dstId,
          recordId,
          data: recordData,
          revisionHistory: revision.toString(),
          revision,
          recordMeta: newMetaWithFieldExtra,
          createdBy: userId,
          updatedBy: userId,
        });

        const recordAction = DatasheetOtService.generateJotAction(
          OTActionName.ObjectInsert,
          ['recordMap', recordId, 'recordMeta'],
          newMetaWithFieldExtra,
        );
        recordMapActions.push(recordAction);
        recordMetaMap[recordId] = newRecordMeta;
      }
    }

    // === Insert data rapidly ===
    if (saveRecordEntities.length > 0) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${dstId}] Batch insert record`);
      }
      // Custom batch insertion will be faster by 100 times
      if (saveRecordEntities.length > 3000) {
        // Insert in chunks to avoid SQL length overflow, insert 3000 rows one time
        const chunkList = chunk(saveRecordEntities, 3000);
        for (const entities of chunkList) {
          await manager
            .createQueryBuilder()
            .insert()
            .into(DatasheetRecordEntity)
            .values(entities)
            // If not set to false, SELECT will be executed after insertion,
            // efficiency will be seriously impacted.
            .updateEntity(false)
            .execute();
        }
      } else {
        // if the number of entities does not exceed 3000, batch insert
        await manager
          .createQueryBuilder()
          .insert()
          .into(DatasheetRecordEntity)
          .values(saveRecordEntities)
          // If not set to false, SELECT will be executed after insertion,
          // efficiency will be seriously impacted.
          .updateEntity(false)
          .execute();
      }
      // As all change in middle layer need to be synced to client, here effect change is performed => meta
      const createdByFields = (fieldList as IField[]).filter((fld) => fld.type === FieldType.CreatedBy || fld.type === FieldType.LastModifiedBy);
      const processFields = [...createdByFields, ...autoNumberFields];
      // Construct actions<setFieldAttr> that are about to be synced to client
      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields: processFields, nextId: recordIndex }, effectMap);
      metaActions.push(...fieldAttrActions);
    }

    // === Batch recover records ===
    if (restoreRecordMap.size > 0) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${dstId}] Batch recover records`);
      }
      for (const [recordId, recordInfo] of restoreRecordMap.entries()) {
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set({
            data: recordInfo.data,
            revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
            revision,
            isDeleted: false,
            recordMeta: recordInfo.recordMeta,
            updatedBy: userId,
          })
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id = :recordId', { recordId })
          .execute();
        await manager
          .createQueryBuilder()
          .update(DatasheetRecordArchiveEntity)
          .set({
            isDeleted: false,
            updatedBy: userId,
          })
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id = :recordId', { recordId })
          .execute();
      }
      // As all changes in middle layer need to be synced to client, here effect change is performed => meta
      // filter LastModifiedBy related and not to be deleted Field
      const updatedByFields = fieldList.filter(({ id, type }) => type === FieldType.LastModifiedBy && !resultSet.cleanFieldMap.get(id));
      // collect UUID into field.property.uuids, and return corresponding actions
      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields: updatedByFields }, effectMap);
      metaActions.push(...fieldAttrActions);
    }

    // update remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);

    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch creating cells......duration: ${endTime - beginTime}ms`);
  }

  private async deleteRecordComment(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (!resultSet.toDeleteCommentIds.size) {
      return;
    }

    const { userId, dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch deleting record comments......`);
    for (const [recordId, commentIds] of resultSet.toDeleteCommentIds.entries()) {
      const { comments } = await this.recordCommentService.getComments(dstId, recordId);
      const deleteCommentId = commentIds[0];
      if (!comments.find((item) => item.commentId === deleteCommentId)) {
        throw new ServerException(OtException.REVISION_ERROR);
      }
      await manager
        .createQueryBuilder()
        .update(RecordCommentEntity)
        .set({
          updatedBy: userId,
          isDeleted: true,
        })
        .where('dst_id = :dstId', { dstId: dstId })
        .andWhere('record_id = :recordId', { recordId: recordId })
        .andWhere('comment_id = :commentId', { commentId: deleteCommentId })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch deleting record comments......duration: ${endTime - beginTime}ms`);
  }

  private async handleBatchUnarchiveRecord(
    manager: EntityManager,
    commonData: ICommonData,
    // effectMap: Map<string, any>,
    resultSet: { [key: string]: any },
  ) {
    if (!resultSet.toUnarchiveRecord.size) {
      return;
    }

    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Soft unarchive record`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch unarchiving record......`);
    const values = {
      isArchived: false,
      updatedBy: userId,
    };

    const recordUpdateProp = {
      revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
      revision,
      updatedBy: userId,
    };
    const gap = 1000;
    const times = Math.ceil(resultSet.toUnarchiveRecord.size / gap);
    const toUnarchiveRecordIds = Array.from(resultSet.toUnarchiveRecord.keys());
    for (let i = 0; i < times; i++) {
      const unarchivedRecordIds = toUnarchiveRecordIds.slice(i * gap, (i + 1) * gap);

      await manager
        .createQueryBuilder()
        .update(DatasheetRecordArchiveEntity)
        .set(values)
        .where('dst_id = :dstId', { dstId })
        .andWhere('record_id IN(:...ids)', { ids: unarchivedRecordIds })
        .execute();

      await manager
        .createQueryBuilder()
        .update(DatasheetRecordEntity)
        .set(recordUpdateProp)
        .where('dst_id = :dstId', { dstId })
        .andWhere('record_id IN(:...ids)', { ids: unarchivedRecordIds })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch unarchiving record......duration: ${endTime - beginTime}ms`);
  }

  private async handleCommentEmoji(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (!resultSet.toUpdateCommentEmoji.size) {
      return;
    }

    const { dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start batch modifying comment emoji......`);
    for (const [recordId, comments] of resultSet.toUpdateCommentEmoji.entries()) {
      for (const { emojiAction, comment } of comments) {
        const { commentId, commentMsg } = comment;
        const oldComment = await this.recordCommentService.getCommentByCommentId(dstId, recordId, commentId);
        if (!oldComment) {
          throw new ServerException(OtException.REVISION_ERROR);
        }
        const oldEmojis: any = oldComment.commentMsg?.emojis || {};
        const firstKey = Object.keys(commentMsg.emojis)[0];
        if (!firstKey) {
          // No emoji exists, skip
          continue;
        }
        const oldEmjiList: string[] = oldEmojis[firstKey];
        const currentEmjiUuid = commentMsg.emojis[firstKey][0];
        const oldEmojiIndex = oldEmjiList?.indexOf(currentEmjiUuid) ?? -1;

        if (emojiAction) {
          if (oldEmojiIndex === -1) {
            let insertEmojiSqlTemp: string;
            if (isEmpty(oldEmojis)) {
              // First new thumb-up emoji, example: comment_msg -> emojis does not exist
              insertEmojiSqlTemp = `JSON_INSERT(comment_msg, '$.emojis', JSON_OBJECT('${firstKey}', JSON_ARRAY(:emojiActionUuid)))`;
            } else if (!oldEmojis.hasOwnProperty(firstKey)) {
              // First new thumb-up emoji, example: comment_msg -> emojis -> 'good' does not exist
              insertEmojiSqlTemp = `JSON_INSERT(comment_msg, '$.emojis.${firstKey}', JSON_ARRAY(:emojiActionUuid))`;
            } else {
              // Thumb-up exists in json, example: comment_msg -> emojis -> good -> [...uuid] does not exist
              insertEmojiSqlTemp = `JSON_ARRAY_INSERT(comment_msg , '$.emojis.${firstKey}[0]', :emojiActionUuid)`;
            }
            // Create
            await manager
              .createQueryBuilder()
              .update(RecordCommentEntity)
              .set({
                commentMsg: () => insertEmojiSqlTemp,
              })
              .where('dst_id = :dstId', { dstId: dstId })
              .andWhere('record_id = :recordId', { recordId: recordId })
              .andWhere('comment_id = :commentId', { commentId: commentId })
              .setParameters({ emojiActionUuid: currentEmjiUuid })
              .execute();
          }
        } else {
          if (oldEmojiIndex !== -1) {
            // Cancel
            await manager
              .createQueryBuilder()
              .update(RecordCommentEntity)
              .set({
                commentMsg: () => `JSON_REMOVE(comment_msg, '$.emojis.${firstKey}[${oldEmojiIndex}]')`,
              })
              .where('dst_id = :dstId', { dstId: dstId })
              .andWhere('record_id = :recordId', { recordId: recordId })
              .andWhere('comment_id = :commentId', { commentId: commentId })
              .execute();
          }
        }
      }
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished batch modifying comment emoji......duration: ${endTime - beginTime}ms`);
  }

  /**
   * Initialize some special fields (e.g. AutoNumber)
   *
   * @param manager database manager
   * @param commonData common data, including userId, uuid, dstId and revision
   * @param effectMap effect variable collection
   * @param resultSet
   */
  private async handleBatchInitField(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any },
  ) {
    if (!resultSet.initFieldMap.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const metaActions: IJOTAction[] = [];
    const recordMapActions: IJOTAction[] = [];
    const meta: IMeta = await this.getMetaDataByCache(dstId, effectMap);
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start initializing RecordMeta data of special field......`);

    for (const [viewIdx, fields] of resultSet.initFieldMap) {
      // Determine self-increment order according to current view
      const recordIds = meta.views[viewIdx]!.rows.map((row) => row.recordId);

      // No records in current view, only initialize nextId
      if (!recordIds.length) {
        const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields, nextId: 1 }, effectMap);
        metaActions.push(...fieldAttrActions);
        continue;
      }

      // The view contains records
      const prevRecordMap: IRecordMap = await this.recordService.getBasicRecordsByRecordIds(dstId, recordIds);
      const recordMetaMap: Map<string, IRecordMeta> = effectMap.get(EffectConstantName.RecordMetaMap);
      const recordIdMap = new Map<string, number>();
      let nextId = 1;

      // Need to sort according to current view
      recordIds.forEach((recordId) => recordIdMap.set(recordId, nextId++));

      // forEach can not be used here, or await calls inside will not take effect
      for (const record of Object.values(prevRecordMap)) {
        const recordId = record.id;
        // Need to obtain latest record, if can not be obtained in this OP, fetch from database
        const oldRecordMeta = recordMetaMap[recordId] || record?.recordMeta || {};
        const fieldUpdatedMap = oldRecordMeta.fieldUpdatedMap || {};

        fields.map((field: any) => {
          const fieldId = field.id;
          const value = recordIdMap.get(recordId);
          // autoNumber does not have modified time and modifier
          fieldUpdatedMap[fieldId] = { autoNumber: value };
        });

        // Build latest recordMeta
        const newRecordMeta = {
          ...oldRecordMeta,
          fieldUpdatedMap,
        };

        await manager
          .createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set({
            data: record.data,
            revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
            revision,
            isDeleted: false,
            recordMeta: newRecordMeta,
            updatedBy: userId,
          })
          .where([{ dstId, recordId }])
          .execute();

        // middle layer => client: syncing Actions<setRecord>
        const recordAction = DatasheetOtService.generateJotAction(
          OTActionName.ObjectReplace,
          ['recordMap', recordId, 'recordMeta'],
          newRecordMeta,
          oldRecordMeta,
        );
        recordMapActions.push(recordAction);
      }

      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields, nextId }, effectMap);
      metaActions.push(...fieldAttrActions);
    }
    // As all changes in middle layer need to be synced to client, here effect change is performed, including meta and remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);
    const endTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> Finished initializing RecordMeta data of special field......duration: ${endTime - beginTime}ms`);
  }

  /**
   * @param manager Database manager
   * @param commonData common data, including userId, uuid, dstId and revision
   * @param effectMap effect variable collection
   */
  private async handleMeta(manager: EntityManager, commonData: ICommonData, effectMap: Map<string, any>) {
    const { userId, dstId, revision } = commonData;
    const metaActions = effectMap.get(EffectConstantName.MetaActions);
    if (metaActions.length === 0) {
      return;
    }
    // Obtain datasheet meta
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Obtain datasheet Meta`);
    }

    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> Start querying Meta......`);
    const meta = await this.getMetaDataByCache(dstId, effectMap);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> Finished querying Meta......duration: ${endTime - beginTime}ms`);

    // Merge Meta
    try {
      jot.apply({ meta }, metaActions);
    } catch (e) {
      this.logger.error(e);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Modify datasheet Meta`);
    }

    if (meta.views.find((view) => view == null)) {
      // After successfully applying OP, check views, if null exists then report error
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    await manager.update(DatasheetMetaEntity, { dstId }, { metaData: meta, revision, updatedBy: userId });
  }

  /**
   * Create new changeset and store it in database
   *
   * @param manager database manager
   * @param commonData
   * @param remoteChangeset changeset that is about to be stored in database
   */
  private async createNewChangeset(manager: EntityManager, commonData: ICommonData, remoteChangeset: IRemoteChangeset) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${remoteChangeset.resourceId}] Insert new changeset`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] - [${remoteChangeset.messageId}] ====> Starting storing changeset......`);
    const { userId } = commonData;
    await manager
      .createQueryBuilder()
      .insert()
      .into(DatasheetChangesetEntity)
      .values([
        {
          id: IdWorker.nextId().toString(),
          messageId: remoteChangeset.messageId,
          dstId: remoteChangeset.resourceId,
          memberId: userId,
          operations: remoteChangeset.operations,
          revision: remoteChangeset.revision,
          createdBy: userId,
          updatedBy: userId,
        },
      ])
      // If not set to false, SELECT statement will be executed after insertion,
      // efficiency will be seriously impacted.
      .updateEntity(false)
      .execute();
    const endTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> Finished storing changeset......duration: ${endTime - beginTime}ms`);
  }

  /**
   * @param manager database manager
   * @param commonData
   */
  private async updateRevision(manager: EntityManager, commonData: ICommonData) {
    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}] Modify revision of main datasheet`);
    }
    await manager.update(DatasheetEntity, { dstId }, { revision, updatedBy: userId });
  }

  /**
   * Update remoteChange in effectMap
   *
   * @param effectMap effect variable collection
   * @param metaActions meta related actions
   * @param recordMapActions recordMap related actions
   */
  private updateEffectRemoteChangeset(effectMap: Map<string, any>, metaActions: IJOTAction[] | null, recordMapActions: IJOTAction[] | null) {
    const remoteChangeOperations: any[] = [];
    if (metaActions?.length) {
      remoteChangeOperations.push({ cmd: CollaCommandName.SystemSetFieldAttr, actions: metaActions });
    }
    if (recordMapActions?.length) {
      remoteChangeOperations.push({ cmd: CollaCommandName.SystemSetRecords, actions: recordMapActions });
    }
    if (remoteChangeOperations.length) {
      this.updateEffectMap(effectMap, EffectConstantName.RemoteChangeset, remoteChangeOperations);
    }
  }

  /**
   * Obtain metadata
   * @param dstId datasheet ID
   * @param effectMap effect variable collection
   */
  async getMetaDataByCache(dstId: string, effectMap: Map<string, any>): Promise<IMeta> {
    if (effectMap.has(EffectConstantName.Meta)) {
      return effectMap.get(EffectConstantName.Meta);
    }

    const meta = await this.metaService.getMetaDataByDstId(dstId, OtException.META_LOST_ERROR);
    effectMap.set(EffectConstantName.Meta, meta);
    return meta;
  }

  /**
   * Obtain action that change meta
   *
   * @param data carried data
   * @param effectMap effect variable collection
   */
  private getMetaActionByFieldType(data: { uuid?: string; fields: IField[]; nextId?: number }, effectMap: Map<string, any>) {
    const metaActions: IJOTAction[] = [];
    const { uuid, fields } = data;

    if (!fields?.length) {
      return [];
    }
    for (const field of fields) {
      const { id: fieldId, property, type } = field;

      switch (type) {
        case FieldType.AutoNumber: {
          const nextId = (!property.nextId ? data.nextId : property.nextId + data.nextId!) || 1;
          const newField = produce(field, (draft) => {
            draft.property.nextId = nextId;
            return draft;
          });
          const metaAction = DatasheetOtService.generateJotAction(OTActionName.ObjectReplace, ['meta', 'fieldMap', fieldId], newField, field);
          metaActions.push(metaAction);
          break;
        }
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy: {
          if (property.uuids.includes(uuid!)) {
            break;
          }
          const newField = produce(field, (draft) => {
            draft.property.uuids.push(uuid!);
            return draft;
          });
          const metaAction = DatasheetOtService.generateJotAction(OTActionName.ObjectReplace, ['meta', 'fieldMap', fieldId], newField, field);
          metaActions.push(metaAction);
          break;
        }
      }
    }
    this.updateEffectMap(effectMap, EffectConstantName.MetaActions, metaActions);
    return metaActions;
  }

  /**
   * Update effectMap in terms of a constantName
   *
   * @param effectMap effect variable collection
   * @param constantName key name in effectMap
   * @param value to-be-updated value
   */
  private updateEffectMap(effectMap: Map<string, any>, constantName: EffectConstantName, value: any[]) {
    const base = effectMap.get(constantName);
    const current = produce(base, (draft: any) => {
      switch (constantName) {
        case EffectConstantName.RemoteChangeset:
          draft.operations.push(...value);
          return draft;
        case EffectConstantName.MetaActions:
          draft.push(...value);
          return draft;
        default:
          return draft;
      }
    });
    effectMap.set(constantName, current);
  }

  /**
   * This function checks if a given field type is either a Member or CreatedBy.
   * It returns true if the field type matches either, and false otherwise.
   *
   * @param fieldType - The type of field to check
   * @return boolean - True if fieldType is either Member or CreatedBy, false otherwise
   */
  private subscriptionSupportedFieldType(fieldType: number): boolean {
    return fieldType === FieldType.Member || fieldType === FieldType.CreatedBy;
  }

  /**
   * This function scans through all the fields in the fieldMap and returns an array of fields which
   * support subscriptions (as determined by subscriptionSupportedFieldType()) and have the subscription property set.
   *
   * @param fieldMap - Map of fields to be scanned
   * @return IField[] - Array of fields that support subscription and have subscription property set
   */
  private getAutoSubscriptionFields(fieldMap: IFieldMap) {
    const autoSubscriptionFields: IField[] = [];
    Object.values(fieldMap).forEach((field) => {
      if (this.subscriptionSupportedFieldType(field.type) && field.property?.subscription) {
        autoSubscriptionFields.push(field);
      }
    });
    return autoSubscriptionFields;
  }

  /**
   * This function checks if a record has fields that should be subscribed or unsubscribed,
   * based on the comparison of oiData and odData for each autoSubscriptionField.
   * If a field is of type Member, it determines which unit IDs need to be subscribed and unsubscribed.
   * If a field is of type CreatedBy and the record isn't already auto-subscribed by the creator,
   * it adds the record ID to creatorAutoSubscribedRecordIds.
   *
   * @param autoSubscriptionFields - Fields that are eligible for subscription
   * @param recordId - ID of the record to subscribe or unsubscribe
   * @param oiData - Initial object data
   * @param odData - Desired object data
   * @param resultSet - Set to collect the results of the subscription and unsubscription operations
   */
  private collectRecordSubscriptions(autoSubscriptionFields: IField[], recordId: string, oiData: any, odData: any, resultSet: any) {
    if (autoSubscriptionFields.length > 0) {
      autoSubscriptionFields.forEach((field) => {
        if (field.type === FieldType.Member) {
          // get oiUserIds if oiData and oiData[field.id] exists, otherwise get empty array
          const oiUnitIds = oiData ? oiData[field.id] ?? [] : [];
          const odUnitIds = odData ? odData[field.id] ?? [] : [];
          if (oiUnitIds.length === 0 && odUnitIds.length === 0) {
            return;
          }
          const toSubscribeUnitIds = oiUnitIds.filter((unitId: any) => !odUnitIds.includes(unitId));
          const toUnsubscribeUnitIds = odUnitIds.filter((unitId: any) => !oiUnitIds.includes(unitId));
          toSubscribeUnitIds.forEach((unitId: any) => {
            resultSet.toCreateRecordSubscriptions.push({ unitId, recordId });
          });
          toUnsubscribeUnitIds.forEach((unitId: any) => {
            resultSet.toCancelRecordSubscriptions.push({ unitId, recordId });
          });
        } else if (field.type === FieldType.CreatedBy) {
          if (oiData && resultSet.creatorAutoSubscribedRecordIds.indexOf(recordId) === -1) {
            resultSet.creatorAutoSubscribedRecordIds.push(recordId);
          }
        }
      });
    }
  }
}
