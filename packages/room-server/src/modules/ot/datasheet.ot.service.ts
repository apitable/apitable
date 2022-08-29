import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import {
  CollaCommandName, Field, FieldType, IAttachmentValue, IComments, IField, IFieldMap, IFieldUpdatedMap, IJOTAction, IMeta, IObjectDeleteAction,
  IObjectInsertAction, IObjectReplaceAction, IOperation, IRecord, IRecordAlarm, IRecordCellValue, IRecordMeta, IReduxState, IRemoteChangeset,
  isSameSet, IViewProperty, jot, OTActionName
} from '@vikadata/core';
import { InjectLogger } from 'common';
import { EnvConfigService } from 'config/env.config.service';
import dayjs from 'dayjs';
import { DatasheetChangesetEntity } from 'entities/datasheet.changeset.entity';
import { DatasheetEntity } from 'entities/datasheet.entity';
import { DatasheetMetaEntity } from 'entities/datasheet.meta.entity';
import { DatasheetRecordAlarmEntity } from 'entities/datasheet.record.alarm.entity';
import { DatasheetRecordEntity } from 'entities/datasheet.record.entity';
import { RecordCommentEntity } from 'entities/record.comment.entity';
import { WidgetEntity } from 'entities/widget.entity';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { RecordAlarmStatus } from 'enums/record.alarm.enum';
import { CommonException } from 'exception/common.exception';
import { ExceptionUtil } from 'exception/exception.util';
import { OtException } from 'exception/ot.exception';
import { PermissionException } from 'exception/permission.exception';
import { ServerException } from 'exception/server.exception';
import { IdWorker } from 'helpers';
import produce from 'immer';
import { IAuthHeader, IOpAttach, NodePermission } from 'interfaces';
import { chunk, intersection, isEmpty, pick, update } from 'lodash';
import { EffectConstantName, ICommonData, IFieldData, IRestoreRecordInfo } from 'modules/ot/ot.interface';
import { RecordCommentService } from 'modules/services/datasheet/record.comment.service';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { RecordMap } from '../../models';
import { RestService } from '../rest/rest.service';
import { DatasheetMetaService } from '../services/datasheet/datasheet.meta.service';
import { DatasheetRecordAlarmService } from '../services/datasheet/datasheet.record.alarm.service';
import { DatasheetRecordService } from '../services/datasheet/datasheet.record.service';
import { WidgetService } from '../services/widget/widget.service';

@Injectable()
export class DatasheetOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly recordCommentService: RecordCommentService,
    private readonly recordService: DatasheetRecordService,
    private readonly widgetService: WidgetService,
    private readonly metaService: DatasheetMetaService,
    private readonly restService: RestService,
    private readonly envConfigService: EnvConfigService,
    private readonly recordAlarmService: DatasheetRecordAlarmService,
  ) { }

  private static isAttachField(cellValue: any): boolean {
    return !!(cellValue && Array.isArray(cellValue) && cellValue[0]?.mimeType && cellValue[0]?.token);
  }

  /**
   * 设置Map的值
   * 如果存在key, value叠加，不存在则设置新的值
   * @param map Map
   * @param key 键
   * @param value 值
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

  /**
   * 生成 jot action
   */
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
      toDeleteRecordIds: [],
      cleanFieldMap: new Map<string, FieldType>(),
      cleanRecordCellMap: new Map<string, IFieldData[]>(),
      replaceCellMap: new Map<string, IFieldData[]>(),
      initFieldMap: new Map<number, IField[]>(),
      toCorrectComment: new Map<string, { comment: IComments, index: number | string }[]>(),
      fldOpInViewMap: new Map<string, boolean>(),
      fldOpInRecMap: new Map<string, string>(),
      toDeleteCommentIds: new Map<string, string[]>(),
      deleteWidgetIds: [],
      addWidgetIds: [],
      spaceCapacityOverLimit: false,
      auth: {},
      attachCiteCollector: { nodeId: '', addToken: [], removeToken: [] }, // 数表附件容量收集器
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
      toUpdateCommentEmoji: new Map<string, { comment: IComments, emojiAction: boolean }[]>(),
      linkActionMainDstId: undefined,
      mainLinkDstPermissionMap: new Map<string, NodePermission>(),
      toCreateAlarms: new Map<string, IRecordAlarm[]>(),
      toDeleteAlarms: new Map<string, IRecordAlarm[]>(),
      updatedAlarmIds: [],
      addViews: [],
    };
  }

  /**
   * @description 解析 Operation ，根据需要进行特殊的任务处理
   * @param spaceId
   * @param operation
   * @param datasheetId
   * @param permission
   * @param cookie
   * @param token
   * @param getNodeRole
   * @param effectMap
   * @param resultSet
   * @returns
   */
  async analyseOperates(
    spaceId: string,
    mainDatasheetId: string,
    operation: IOperation[],
    datasheetId: string,
    permission: NodePermission,
    getNodeRole,
    effectMap,
    resultSet: { [key: string]: any },
    auth: IAuthHeader,
    sourceType?: SourceTypeEnum,
  ) {
    resultSet.datasheetId = datasheetId;
    resultSet.auth = auth;
    resultSet.sourceType = sourceType;
    resultSet.attachCiteCollector = { nodeId: datasheetId, addToken: [], removeToken: [] };
    // 获取容量状态
    resultSet.spaceCapacityOverLimit = await this.restService.capacityOverLimit(auth, spaceId);
    const meta = await this.getMetaDataByCache(datasheetId, effectMap);
    const fieldMap = meta.fieldMap;
    resultSet.temporaryFieldMap = fieldMap;
    resultSet.temporaryViews = meta.views;
    for (const { mainLinkDstId } of operation) {
      const _condition = mainLinkDstId || mainDatasheetId;
      this.logger.info(`当前操作的关联数据缺少 mainLinkDstId: ${datasheetId}`);
      const condition = auth.internal || datasheetId === _condition || sourceType === SourceTypeEnum.FORM;
      const mainDstPermission = condition ? permission : await getNodeRole(_condition, auth);
      resultSet.mainLinkDstPermissionMap.set(_condition, mainDstPermission);
    }
    resultSet.metaActions = operation.reduce<IJOTAction[]>((pre, cur) => {
      // 大数据操作时日志很多，可以注释掉
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${datasheetId}]变更集OperationAction: ${JSON.stringify(cur.actions)}`);
      }
      const cmd = cur.cmd;
      resultSet.linkActionMainDstId = cur.mainLinkDstId || mainDatasheetId;
      for (const action of cur.actions) {
        if (action.p[0] === 'meta') {
          this.dealWithMeta(cmd, action, permission, resultSet);
          pre.push(action);
        } else {
          // 收集附件字段
          this.handleAttachOpCite(action, resultSet, fieldMap);
          this.dealWithRecordMap(cmd, action, permission, resultSet);
        }
      }

      return pre;
    }, []);

    if (resultSet.toCreateRecord.size) {
      const fieldMap = resultSet.temporaryFieldMap;

      for (const [recordId, value] of resultSet.toCreateRecord.entries()) {
        if (!Object.keys(value).length) {
          continue;
        }
        const _value = {};
        for (const fieldId in value) {
          const field = fieldMap[fieldId];
          if (!field) {
            Sentry.captureMessage('写入数据中有不存在的字段', {
              extra: {
                datasheetId,
                fieldId,
              },
            });
            continue;
          }

          // 计算字段写入错误发送到 Sentry，不中断请求
          if (Field.bindContext(field, {} as IReduxState).isComputed) {
            Sentry.captureMessage('ot service: 计算字段写入错误', {
              extra: {
                datasheetId,
                field,
              },
            });
            continue;
          }

          const { error } = Field.bindContext(field, {} as IReduxState).validateCellValue(value[fieldId]);
          if (error) {
            Sentry.captureMessage('当前写入的数据格式错误', {
              extra: {
                datasheetId,
                error: JSON.stringify(error)
              },
            });
            continue;
          }
          _value[fieldId] = value[fieldId];
        }
        resultSet.toCreateRecord.set(recordId, _value);
      }
    }

    if (resultSet.replaceCellMap.size) {
      const fieldMap = resultSet.temporaryFieldMap;

      for (const [recordId, value] of resultSet.replaceCellMap.entries()) {
        const _value = [];
        for (const { fieldId, data } of value) {
          const field = fieldMap[fieldId];
          if (!field) {
            Sentry.captureMessage('写入数据中有不存在的字段', {
              extra: {
                datasheetId,
                fieldId,
              },
            });
            continue;
          }

          if (Field.bindContext(field, {} as IReduxState).isComputed) {
            Sentry.captureMessage('ot service：计算字段写入错误', {
              extra: {
                datasheetId,
                field,
              },
            });
            continue;
          }

          const { error } = Field.bindContext(field, {} as IReduxState).validateCellValue(data);

          if (error) {
            Sentry.captureMessage('当前写入的数据格式错误', {
              extra: {
                datasheetId,
                error: JSON.stringify(error)
              },
            });
            continue;
          }
          _value.push({ fieldId, data });
        }
        resultSet.replaceCellMap.set(recordId, _value);
      }
    }

    // 校验无权限的视图字段操作，是否是对应新增或删除的关联列
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
    // 校验无编辑权限的单元格操作，是否属于关联联动操作
    if (resultSet.fldOpInRecMap.size > 0) {
      for (const [fieldId, cmd] of resultSet.fldOpInRecMap.entries()) {
        switch (cmd) {
          // 删除关联列、关联列转换
          case 'DeleteField':
          case 'SetFieldAttr':
            if (!resultSet.toDeleteForeignDatasheetIdMap.has(fieldId)) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            break;
          // 撤销删除关联列、关联列转换
          case 'UNDO:DeleteField':
          case 'UNDO:SetFieldAttr':
            if (!resultSet.toCreateForeignDatasheetIdMap.has(fieldId)) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            break;
          // 选择、粘贴和填充关联引用及各自撤销操作，校验该列是否是关联字段
          default:
            // 优先取变更集，防止属于 OP 合并之后推送过来，再加载数据库元数据
            if (resultSet.toCreateForeignDatasheetIdMap.has(fieldId) ||
              resultSet.toDeleteForeignDatasheetIdMap.has(fieldId)) {
              break;
            }
            if (meta?.fieldMap[fieldId].type !== FieldType.Link) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
        }
      }
    }
    // 非撤销操作，新增 LookUp 需要关联表的「可查看」以上权限。若目标字段设置了列权限，还需要这一列的「可查看」以上权限
    if (resultSet.toCreateLookUpProperties.length > 0) {
      for (const { cmd, relatedLinkFieldId, lookUpTargetFieldId, skipFieldPermission } of resultSet.toCreateLookUpProperties) {
        if (skipFieldPermission || cmd === 'UNDO:DeleteField' || cmd === 'UNDO:SetFieldAttr') {
          continue;
        }
        let foreignDatasheetId;
        // 优先取变更集，防止属于 OP 合并之后推送过来，再加载数据库元数据
        if (resultSet.toCreateForeignDatasheetIdMap.has(relatedLinkFieldId)) {
          foreignDatasheetId = resultSet.toCreateForeignDatasheetIdMap.get(relatedLinkFieldId);
        } else {
          const meta = await this.getMetaDataByCache(datasheetId, effectMap);
          const field = meta?.fieldMap[relatedLinkFieldId];
          if (field?.type !== FieldType.Link) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          foreignDatasheetId = field.property.foreignDatasheetId;
        }
        const foreignPermission = await getNodeRole(foreignDatasheetId, auth);
        if (!foreignPermission.readable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        // 校验引用目标字段的权限
        const targetFieldPermission = !foreignPermission.fieldPermissionMap
          || !foreignPermission.fieldPermissionMap[lookUpTargetFieldId]
          || foreignPermission.fieldPermissionMap[lookUpTargetFieldId].permission?.readable;
        if (!targetFieldPermission) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
    }
    // const [subscribeInfo, spaceInfo] = await Promise.all([
    //   this.restService.getSpaceSubscriptionView(spaceId),
    //   this.restService.getSpaceUsageView(spaceId),
    // ]);
    // const serverConfig = this.envConfigService.getRoomConfig(EnvConfigKey.CONST) as IServerConfig;
    // 校验视图数量上限
    // if (resultSet.addViews.length > 0) {
    //   this.checkViewSubscribeUsage(resultSet, spaceId, subscribeInfo, spaceInfo);
    //   ExceptionUtil.isTrue(resultSet.addViews.length + meta.views.length >
    //     serverConfig.maxViewCount, DatasheetException.VIEW_ADD_LIMIT);
    // }
    // // 校验字段数量上限
    // if (resultSet.changeFieldNumber > 0) {
    //   ExceptionUtil.isTrue(resultSet.changeFieldNumber + meta.views[0].columns.length >
    //     serverConfig.maxFieldCount, DatasheetException.FIELD_ADD_LIMIT);
    // }
    // // 校验记录数量上限
    // if (resultSet.toCreateRecord.size > resultSet.toDeleteRecordIds.length) {
    //   const size = resultSet.toCreateRecord.size - resultSet.toDeleteRecordIds.length;
    //   const currentDstRowsCount = size + meta.views[0].rows.length;
    //   this.checkRecordSubscribeUsage(resultSet, spaceId, subscribeInfo, spaceInfo, size, currentDstRowsCount);
    //   ExceptionUtil.isTrue(size > 0 && currentDstRowsCount >
    //     serverConfig.maxRecordCount, DatasheetException.RECORD_ADD_LIMIT);
    // }

    effectMap.set(EffectConstantName.MetaActions, resultSet.metaActions);
    effectMap.set(EffectConstantName.AttachCite, resultSet.attachCiteCollector);
    // 若在同一次 op 中，创建了 record -> recordMeta，
    // 并且之后修改了这条 record，对于 recordMeta，需要拿到 prevRecordMeta
    effectMap.set(EffectConstantName.RecordMetaMap, {});

    return this.transaction;
  }

  // 检查记录数量是否符合订阅等级的限制
  // checkRecordSubscribeUsage(
  //   resultSet: { [key: string]: any },
  //   spaceId: string,
  //   subscribeInfo: InternalSpaceSubscriptionView,
  //   spaceInfo: InternalSpaceUsageView,
  //   size: number,
  //   currentDstRowsCount: number,
  // ) {
  //   const { maxRowsPerSheet, maxRowsInSpace } = subscribeInfo;
  //   if (maxRowsPerSheet !== -1 && currentDstRowsCount > maxRowsPerSheet) {
  //     // 新增记录超过该订阅等级对于表数量的限制
  //     this.restService.sendSubscribeRemind(
  //       resultSet.auth,
  //       spaceId,
  //       resultSet.datasheetId,
  //       'datasheet_record_limit',
  //       maxRowsPerSheet,
  //       currentDstRowsCount,
  //     );
  //   } else if (maxRowsInSpace !== -1 && (size + spaceInfo.recordNums) > maxRowsInSpace) {
  //     // 新增记录超过空间站的记录数量限制
  //     this.restService.sendSubscribeRemind(
  //       resultSet.auth,
  //       spaceId,
  //       resultSet.datasheetId,
  //       'space_record_limit',
  //       maxRowsInSpace,
  //       size + spaceInfo.recordNums,
  //     );
  //   }
  // }

  // 检查视图数量是否符合订阅等级的限制
  // checkViewSubscribeUsage(resultSet: { [key: string]: any }, spaceId: string,
  //   subscribeInfo: InternalSpaceSubscriptionView, spaceInfo: InternalSpaceUsageView) {
  //   const { maxCalendarViewsInSpace, maxGanttViewsInSpace, maxKanbanViewsInSpace, maxGalleryViewsInSpace } = subscribeInfo;
  //   for (const view of resultSet.addViews) {
  //     if (view.type === ViewType.Calendar && maxCalendarViewsInSpace !== -1 && (spaceInfo.calendarViewNums + 1 > maxCalendarViewsInSpace)) {
  //       this.restService.sendSubscribeRemind(
  //         resultSet.auth,
  //         spaceId,
  //         resultSet.datasheetId,
  //         'space_calendar_limit',
  //         maxCalendarViewsInSpace,
  //         spaceInfo.calendarViewNums + 1,
  //       );
  //       break;
  //     }
  //     if (view.type === ViewType.Gantt && maxGanttViewsInSpace !== -1 && (spaceInfo.ganttViewNums + 1 > maxGanttViewsInSpace)) {
  //       this.restService.sendSubscribeRemind(
  //         resultSet.auth,
  //         spaceId,
  //         resultSet.datasheetId,
  //         'space_calendar_limit',
  //         maxGanttViewsInSpace,
  //         spaceInfo.ganttViewNums + 1,
  //       );
  //       break;
  //     }
  //     if (view.type === ViewType.Kanban && maxKanbanViewsInSpace !== -1 && (spaceInfo.kanbanViewNums + 1 > maxKanbanViewsInSpace)) {
  //       this.restService.sendSubscribeRemind(
  //         resultSet.auth,
  //         spaceId,
  //         resultSet.datasheetId,
  //         'space_calendar_limit',
  //         maxKanbanViewsInSpace,
  //         spaceInfo.kanbanViewNums + 1,
  //       );
  //       break;
  //     }
  //     if (view.type === ViewType.Gallery && maxGalleryViewsInSpace !== -1 && (spaceInfo.galleryViewNums + 1 > maxGalleryViewsInSpace)) {
  //       this.restService.sendSubscribeRemind(
  //         resultSet.auth,
  //         spaceId,
  //         resultSet.datasheetId,
  //         'space_calendar_limit',
  //         maxGalleryViewsInSpace,
  //         spaceInfo.galleryViewNums + 1,
  //       );
  //       break;
  //     }
  //   }
  // }

  /**
   * @description 收集和添加字段（粘贴导致的添加字段也算）相关的 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByAddField(cmd: string, action: IObjectInsertAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    resultSet.temporaryFieldMap[oiData.id] = oiData;
    if (oiData.type === FieldType.Link) {
      const mainDstId = resultSet.linkActionMainDstId;

      if (!mainDstId) {
        throw new ServerException(OtException.OPERATION_ABNORMAL);
      }

      // 这个 action 是否是由当前表生成的
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
        // 关联表联动新增关联列的操作，校验可编辑权限
        if (!permission.editable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      const { foreignDatasheetId } = oiData.property;
      this.logger.debug(`[${resultSet.datasheetId}]新增或复制关联列 -> 关联表[${foreignDatasheetId}]`);
      resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, foreignDatasheetId);
    } else {
      // 非创建关联字段列，可以直接判断权限
      if (!permission.fieldCreatable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      if (oiData.type === FieldType.AutoNumber) {
        // 新增 AutoNumber 字段类型，需要根据对应 view 进行值初始化
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
   * @description 收集和修改字段相关的一些 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByChangeField(cmd: string, action: IObjectReplaceAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const oiData = action.oi as IField;
    const odData = action.od as IField;
    // 修改字段名称
    if (oiData.name !== odData.name) {
      if (!permission.fieldRenamable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    }
    // 修改字段描述
    if ('desc' in oiData && 'desc' in odData && oiData.desc !== odData.desc) {
      if (!permission.fieldPropertyEditable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    }
    // 修改字段类型
    if (oiData.type !== odData.type) {
      let skip = false;
      // 关联表操作
      if (resultSet.linkActionMainDstId !== resultSet.datasheetId) {
        // 因为本表删除了关联列，关联表的关联列转为文本的不校验权限
        if (odData.type == FieldType.Link
          && odData.property.foreignDatasheetId === resultSet.linkActionMainDstId && oiData.type == FieldType.Text) {
          skip = true;
        } else if (oiData.type == FieldType.Link
          && oiData.property.foreignDatasheetId === resultSet.linkActionMainDstId && cmd.startsWith('UNDO:')) {
          // 因为本表撤销删除关联列，关联表原关联列转回关联字段的不校验权限
          skip = true;
        }
      }
      // 非关联表联动操作，校验字段属性编辑权限（对应可管理）
      if (!skip && !permission.fieldPropertyEditable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // 更新 fieldMap 中字段类型，方便后续使用 fieldMap
      resultSet.temporaryFieldMap[oiData.id] = oiData;
      // 删除的字段类型
      switch (odData.type) {
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
          // 更新人字段被删除时，需进行收集，之后的操作将不会更新被删除的 field.property.uuids
          resultSet.cleanFieldMap.set(odData.id, odData.type);
          break;
        default:
          break;
      }
      // 更改后的字段类型
      switch (oiData.type) {
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
          // 转换为 AutoNumber 字段类型，需要根据对应 view 进行值初始化
          const { viewIdx, nextId } = oiData.property;
          if (!nextId) {
            DatasheetOtService.setMapValIfExist(resultSet.initFieldMap, viewIdx, oiData);
          }
          break;
        default:
          break;
      }
    } else {
      // 类型一样，那么就是修改字段属性，排除特殊字段操作
      const allowEditFieldTypes = [FieldType.Member];
      if (allowEditFieldTypes.includes(oiData.type)) {
        // 特殊字段需要可编辑以上即可
        this.checkCellValPermission(cmd, oiData.id, permission, resultSet);
      } else if (oiData.type !== FieldType.CreatedBy) {
        // 创建人字段在这种情况下不检查权限，因为列权限的存在，这里的权限检查因为列权限的存在，已经失去检查的意义
        // 否则校验字段属性编辑权限（对应可管理）
        if (!permission.fieldPropertyEditable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      resultSet.temporaryFieldMap[oiData.id] = oiData;

      // 替换关联表
      if (oiData.type === FieldType.Link && odData.type === FieldType.Link) {
        const oiForeignDatasheetId = oiData.property.foreignDatasheetId;
        const odForeignDatasheetId = odData.property.foreignDatasheetId;
        if (oiForeignDatasheetId === odForeignDatasheetId) {
          return;
        }
        resultSet.toCreateForeignDatasheetIdMap.set(oiData.id, oiForeignDatasheetId);
        resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, odForeignDatasheetId);
      }
      // 替换表查询
      if (oiData.type === FieldType.LookUp && odData.type === FieldType.LookUp) {
        let skipFieldPermission = false;
        if (oiData.property.relatedLinkFieldId === odData.property.relatedLinkFieldId
          && oiData.property.lookUpTargetFieldId === odData.property.lookUpTargetFieldId) {
          // 神奇引用关联字段、目标字段均不变时，不用校验权限，只计算引用过滤条件使用的字段集是否发生变化
          skipFieldPermission = true;
          const oiReferFieldIds: string[] = [];
          const odReferFieldIds: string[] = [];
          oiData.property.filterInfo?.conditions.forEach(condition => oiReferFieldIds.push(condition.fieldId));
          odData.property.filterInfo?.conditions.forEach(condition => odReferFieldIds.push(condition.fieldId));
          // 若过滤条件引用字段一致，则无需计算资源变更
          if (isSameSet(oiReferFieldIds, odReferFieldIds)) {
            return;
          }
        }
        resultSet.toCreateLookUpProperties.push({ ...oiData.property, fieldId: oiData.id, cmd, skipFieldPermission });
        resultSet.toDeleteLookUpProperties.push({ ...odData.property, fieldId: odData.id });
      }
      // 替换公式
      if (oiData.type === FieldType.Formula && odData.type === FieldType.Formula) {
        if (oiData.property.expression === odData.property.expression) {
          return;
        }
        resultSet.toChangeFormulaExpressions.push({
          createExpression: oiData.property.expression,
          deleteExpression: odData.property.expression, fieldId: oiData.id
        });
      }
    }
  }

  /**
   * @description 修改和删除字段相关的一些 op 操作
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByDeleteField(action: IObjectDeleteAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const odData = action.od as IField;
    if (odData.type === FieldType.Link) {
      const mainDstId = resultSet.linkActionMainDstId;

      if (!mainDstId) {
        throw new ServerException(OtException.OPERATION_ABNORMAL);
      }

      // 这个 action 是否是由当前表生成的
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
        // 关联表联动新增关联列的操作，校验可编辑权限
        if (!permission.editable) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
      }
      const { foreignDatasheetId } = odData.property;
      this.logger.debug(`[${resultSet.datasheetId}]删除关联列 -> 关联表[${foreignDatasheetId}]`);
      resultSet.toDeleteForeignDatasheetIdMap.set(odData.id, foreignDatasheetId);
    } else {
      if (!permission.fieldRemovable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      const specialFieldTypes = [FieldType.LastModifiedTime, FieldType.CreatedTime, FieldType.CreatedBy, FieldType.AutoNumber];
      if (!specialFieldTypes.includes(odData.type)) {
        // 收集被删除的字段，以此来清理 fieldUpdatedMap 中对应的数据
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
    // 本表相关操作需要可编辑角色以上
    if (resultSet.datasheetId === resultSet.linkActionMainDstId) {
      const view = resultSet.temporaryViews[action.p[2]] as IViewProperty;
      if (action.p.length === 3) {
        // ====== 新增视图操作(包含复制视图) ======
        if ('li' in action) {
          if (!permission.viewCreatable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.addViews.push(action['li']);
          return;
        }
        // ====== 删除视图操作 ======
        if ('ld' in action) {
          if (!permission.viewRemovable || view?.lockInfo) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          return;
        }
        // ====== 移动视图操作 ======
        if ('lm' in action) {
          if (!permission.viewMovable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          return;
        }
      } else if (action.p.length > 3) {
        switch (action.p[3]) {
          case 'name':
            // ====== 视图重命名操作 ======
            if (!permission.viewRenamable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'filterInfo':
            // ====== 视图筛选 ======
            if (!permission.viewFilterable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'groupInfo':
            // ====== 视图分组 ======
            if (!permission.fieldGroupable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'sortInfo':
            // ====== 视图排序 ======
            if (!permission.columnSortable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'rowHeightLevel':
            // ====== 视图行高 ======
            if (!permission.rowHighEditable || view?.lockInfo) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            return;
          case 'rows':
            // ====== 记录新增对视图属性的影响 ======
            if ('li' in action) {
              if (!permission.rowCreatable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 记录删除对视图属性的影响 ======
            if ('ld' in action) {
              if (!permission.rowRemovable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 记录移动顺序对视图属性的影响 ======
            if ('lm' in action) {
              if (!permission.rowSortable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            break;
          case 'columns':
            // ====== 隐藏列 ======
            if ('li' in action && 'ld' in action && action.li.hidden != action.ld.hidden) {
              if (!permission.columnHideable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 字段顺序 ======
            if ('lm' in action) {
              if (!permission.fieldSortable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 字段新增对视图属性的影响 ======
            if ('li' in action && !('ld' in action)) {
              if (!permission.fieldCreatable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 字段删除对视图属性的影响 ======
            if (!('li' in action) && 'ld' in action) {
              if (!permission.fieldRemovable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            if (action.p.length < 6) {
              break;
            }
            // ====== 字段宽度 ======
            if (action.p[5] === 'width') {
              if (!permission.columnWidthEditable || view?.lockInfo) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 字段统计栏 ======
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
            // ====== 视图布局 ======
            if (action.p[4] === 'layoutType' || action.p[4] === 'isAutoLayout' || action.p[4] === 'cardCount') {
              if (!permission.viewLayoutEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 视图样式 ======
            if (action.p[4] === 'isCoverFit' || action.p[4] === 'coverFieldId' || action.p[4] === 'isColNameVisible') {
              if (!permission.viewStyleEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 视图关键字段（看板分组字段、甘特图开始结束时间字段） ======
            if (action.p[4] === 'kanbanFieldId' || action.p[4] === 'startFieldId' || action.p[4] === 'endFieldId') {
              if (!permission.viewKeyFieldEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            // ====== 视图颜色选项 ======
            if (action.p[4] === 'colorOption') {
              if (!permission.viewColorOptionEditable) {
                throw new ServerException(PermissionException.OPERATION_DENIED);
              }
              return;
            }
            break;
          case 'lock':
            // ====== 视图锁操作 ======
            const viewIndex = action.p[2];
            if ('oi' in action) {
              resultSet.temporaryViews[viewIndex] = {
                ...resultSet.temporaryViews[viewIndex],
                lockInfo: action['oi']
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
      // 其他未解析到的操作
      if (!permission.editable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
    } else {
      // 关联表操作，有可编辑权限直接放行
      if (permission.editable) {
        return;
      }
      // 若无可能是因为本表双向删除关联列（或者撤销该操作）造成视图中的 columns 变化
      if (action.p[3] !== 'columns') {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // 做记录在外层校验是否有对应删除/恢复删除列
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
      // 恢复组件板中的组件
      const addWidget = action['li'];
      resultSet.addWidgetIds.push(addWidget.id);
      return;
    }
    // 恢复整个组件面板
    const panel = action['li'];
    const widgets = panel.widgets;
    const ids = widgets.map(item => item.id);
    resultSet.addWidgetIds.push(...ids);
  }

  collectByDeleteWidgetOrWidgetPanels(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // 删除组件板中的组件
      const deleteWidget = action['ld'];
      resultSet.deleteWidgetIds.push(deleteWidget.id);
      return;
    }
    // 删除整个组件面板
    const panel = action['ld'];
    const widgets = panel.widgets;
    const ids = widgets.map(item => item.id);
    resultSet.deleteWidgetIds.push(...ids);
  }

  /**
   * @description 处理 Operation 中和 Meta 相关的数据
   * @param action
   * @param permission
   * @param resultSet
   */
  dealWithMeta(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (action.p[1] === 'fieldMap') {
      // ===== Field操作 BEGIN =====
      /**
       * 字段操作,判断是否管理权限以上
       * 成员字段比较特殊，编辑数据需要修改列数据源的属性，所以这里还是不要预先拦截，根据具体类型判断
       * 反正创建、修改、删除操作已经细粒化
       * 下面开始字段细粒度权限判断
       */
      // ====== 新增字段操作(复制字段也属于) ======
      if (('oi' in action) && !('od' in action)) {
        // 仅有且只有oi, 代表新加字段（或复制字段）
        this.collectByAddField(cmd, action, permission, resultSet);
        return;
      }
      // ====== 修改字段操作 ======
      if (('oi' in action) && ('od' in action)) {
        this.collectByChangeField(cmd, action, permission, resultSet);
        return;
      }
      // ====== 删除字段操作 ======
      if (!('oi' in action) && ('od' in action)) {
        this.collectByDeleteField(action, permission, resultSet);
        return;
      }
      // ===== Field操作 END =====
    } else if (action.p[1] === 'views') {
      // ===== 视图的操作 =====
      this.collectByView(action, permission, resultSet);
    } else if (action.p[1] === 'widgetPanels') {
      // ===== 组件面板的操作 =====
      // 组件面板及组件的增删均需要可管理角色
      if (!permission.manageable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      if ('ld' in action) {
        this.collectByDeleteWidgetOrWidgetPanels(action, resultSet);
      }
      if ('li' in action) {
        this.collectByAddWidgetIds(action, resultSet);
      }
    }
  }

  /**
   * @description 收集和操作行相关的 op
   * @param action
   * @param permission
   * @param resultSet
   */
  collectByOperateForRow(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const recordId = action.p[1] as string;
    if ('oi' in action) {
      if (!permission.rowCreatable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // 新增一行(复制一行)
      // 取oi内容，如果多行则取data属性，其他则取原值
      const oiData = action.oi;
      if (!oiData) {
        // 格式不正确，不能为null或者undefined，抛出异常
        throw new ServerException(CommonException.SERVER_ERROR);
      }

      let recordData = 'data' in oiData ? oiData.data : oiData;
      recordData = { ...recordData };
      // 过滤为null的单元格
      Object.keys(recordData).forEach((fieldId) => {
        if (recordData[fieldId] == null) {
          delete recordData[fieldId];
          return;
        }
        // 校验权限
        this.checkCellValPermission(cmd, fieldId, permission, resultSet);
      });
      // 先删除记录再恢复，清空删除记录集
      if (resultSet.toDeleteRecordIds.includes(recordId)) {
        resultSet.toDeleteRecordIds.splice(resultSet.toDeleteRecordIds.indexOf(recordId), 1);
        return;
      }
      resultSet.toCreateRecord.set(recordId, recordData);
    }
    if ('od' in action) {
      if (!permission.rowRemovable) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      }
      // 在删除行操作之前如果检查到有对这一行单元格的任何修改，都可以视为没有这些操作，清空之前收集的数据
      if (resultSet.cleanRecordCellMap.has(recordId)) {
        resultSet.cleanRecordCellMap.delete(recordId);
      }
      if (resultSet.replaceCellMap.has(recordId)) {
        resultSet.replaceCellMap.delete(recordId);
      }
      // 先新增记录再删除，清空新增记录集
      if (resultSet.toCreateRecord.has(recordId)) {
        resultSet.toCreateRecord.delete(recordId);
        return;
      }
      resultSet.toDeleteRecordIds.push(recordId);
    }
  }

  /**
   * @description 收集 Record Meta -> fieldExtraMap 相关操作
   * @param cmd
   * @param action
   * @param permission
   * @param resultSet
   */
  collectRecordMetaOperations(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (action.p[0] !== 'recordMap' || action.p[2] !== 'recordMeta') {
      return;
    }

    // 收集 record alarms (['recordMap', ':recordId', 'recordMeta', 'fieldExtraMap', ':fieldId', 'alarm')
    if (action.p[3] === 'fieldExtraMap' && action.p[5] === 'alarm') {
      this.collectRecordAlarmOperations(cmd, action, permission, resultSet);
    }
  }

  /**
   * @description 收集 Record Alarm 相关操作
   * @param cmd
   * @param action
   * @param permission
   * @param resultSet
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
   * @description 收集和修改单元格数据相关的 op
   * @param cmd
   * @param action
   * @param recordId
   * @param resultSet
   */
  collectByOperateForCellValue(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    const recordId = action.p[1] as string;
    const fieldId = action.p[3] as string;
    // 校验权限
    this.checkCellValPermission(cmd, fieldId, permission, resultSet);
    if ('oi' in action) {
      // oi 存在，代表写入数据
      const data = action.oi;
      const fieldData = resultSet.cleanRecordCellMap.get(recordId);
      if (fieldData && fieldData.find(cur => cur['fieldId'] === fieldId)) {
        // 写入单元格数据，可以把之前清空单元格的操作忽略掉
        resultSet.cleanRecordCellMap.set(recordId, fieldData.filter(cur => {
          return cur['fieldId'] !== fieldId;
        }));
      }
      const addRecordData = resultSet.toCreateRecord.get(recordId);
      if (addRecordData) {
        // 新增记录，并同时对该记录有操作，可以将修改的操作合并到新增记录里
        addRecordData[fieldId] = data;
        resultSet.toCreateRecord.set(recordId, addRecordData);
        return;
      }
      DatasheetOtService.setMapValIfExist(resultSet.replaceCellMap, recordId, { fieldId, data });
    } else if ('od' in action) {
      const fieldData = resultSet.replaceCellMap.get(recordId);
      if (fieldData && fieldData.find(cur => cur['fieldId'] === fieldId)) {
        // 如果先修改单元格，在清空单元格的数据，只需要操作清空单元格，修改时没有意义的
        resultSet.replaceCellMap.set(recordId, fieldData.filter(cur => {
          return cur['fieldId'] !== fieldId;
        }));
      }
      const addRecordData = resultSet.toCreateRecord.get(recordId);
      if (addRecordData && addRecordData[fieldId]) {
        // 主要是检查新增记录并且存在默认值，如果后续做了单元格的清除操作，就直接清空默认值，没有必要进行后续操作
        delete addRecordData[fieldId];
        resultSet.toCreateRecord.set(recordId, addRecordData);
        return;
      }
      // 仅od存在，OD操作，删除单元格数据
      DatasheetOtService.setMapValIfExist(resultSet.cleanRecordCellMap, recordId, { fieldId });
    }
  }

  /**
   * @description 收集和评论相关的 op
   * @param {*} action
   * @param {*} permission
   * @param resultSet
   */
  collectByOperateForComment(action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    if (!permission.readable) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    const recordId = action.p[1] as string;

    if (!action.p.includes('emojis')) {
      // 删除评论
      if ('ld' in action || 'od' in action) {
        const comment = ('ld' in action ? action['ld'] : action['od'][0]) as IComments;
        const canDeleteComment = this.recordCommentService.checkDeletePermission(resultSet.auth, comment.unitId, permission.uuid);
        if (!canDeleteComment) {
          throw new ServerException(PermissionException.OPERATION_DENIED);
        }
        DatasheetOtService.setMapValIfExist(resultSet.toDeleteCommentIds, recordId, comment.commentId);
      }
      // 新增评论
      if (('li' in action || 'oi' in action) && action.p.includes('comments')) {
        const comment = 'li' in action ? action.li : action['od'];
        DatasheetOtService.setMapValIfExist(resultSet.toCorrectComment, recordId, { index: action.p[action.p.length - 1], comment: comment });
      }
    } else {
      // 点赞评论
      if ('li' in action || 'ld' in action) {
        const comment = 'li' in action ? action.li : action.ld;
        DatasheetOtService.setMapValIfExist(resultSet.toUpdateCommentEmoji, recordId, { emojiAction: Boolean('li' in action), comment: comment });
      }
    }
  }

  /**
   * @description 处理和 RecordMap 相关的数据
   * @param {IJOTAction} action
   * @param {*} permission
   * @param resultSet
   */
  dealWithRecordMap(cmd: string, action: IJOTAction, permission: NodePermission, resultSet: { [key: string]: any }) {
    // ===== Record操作 BEGIN =====
    if (!(action.p.includes('commentCount') || action.p.includes('comments')) && action.p[0] === 'recordMap') {
      // 单元格数据操作
      if (action.p.includes('data')) {
        this.collectByOperateForCellValue(cmd, action, permission, resultSet);
        return;
      }

      // RecordMeta -> fieldExtraMap 操作 (提醒)
      if (action.p.includes('recordMeta') && action.p.includes('fieldExtraMap')) {
        this.collectRecordMetaOperations(cmd, action, permission, resultSet);
        return;
      }

      // 行数据操作
      this.collectByOperateForRow(cmd, action, permission, resultSet);
    }
    // ===== Record操作 END =====

    // ===== 收集评论操作 BEGIN ====
    if (action.n !== OTActionName.ObjectInsert && action.p.includes('comments') && action.p[0] === 'recordMap') {
      this.collectByOperateForComment(action, permission, resultSet);
    }
    // ===== 收集评论操作 END ====
  }

  transaction = async(
    manager: EntityManager,
    effectMap: Map<string, any>,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) => {
    const beginTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> transaction 开始......`);
    // ======== 修正评论时间 BEGIN ========
    await this.handleUpdateComment(manager, commonData, effectMap, resultSet);
    // ======== 修正评论时间 END ========

    // ======== 批量删除行 BEGIN ========
    await this.handleBatchDeleteRecord(manager, commonData, resultSet);
    // ======== 批量删除行 END ========

    // ======== 批量删除 widget BEGIN ========
    await this.handleBatchDeleteWidget(manager, commonData, resultSet);
    // ======== 批量删除 widget END ========

    // ======== 批量新增 widget BEGIN ========
    await this.handleBatchAddWidget(manager, commonData, resultSet);
    // ======== 批量新增 widget END ========

    // ======== 批量清空单元格数据 BEGIN ========
    await this.handleBatchUpdateCell(manager, commonData, effectMap, true, resultSet);
    // ======== 批量清空单元格数据 END ========

    // ======== 批量创建Record BEGIN ========
    await this.handleBatchCreateRecord(manager, commonData, effectMap, resultSet);
    // ======== 批量创建Record END ========

    // ======== 批量修改单元格 BEGIN ========
    await this.handleBatchUpdateCell(manager, commonData, effectMap, false, resultSet);
    // ======== 批量修改单元格 END ========

    // ======== 删除评论 BEGIN ========
    await this.deleteRecordComment(manager, commonData, resultSet);
    // ======== 删除评论 END ========

    // ======== 初始化部分需要初始值的Field BEGIN ========
    await this.handleBatchInitField(manager, commonData, effectMap, resultSet);
    // ======== 初始化部分需要初始值的Field END ========

    // ======== 处理（新增/删除）评论Emoji表情 BEGIN ========
    await this.handleCommentEmoji(manager, commonData, resultSet);
    // ======== 处理（新增/删除）Emoji表情 END ========

    // ======== 处理（新增/删除）日期提醒 BEGIN ========
    await this.handleRecordAlarm(manager, commonData, resultSet);
    // ======== 处理（新增/删除）日期提醒 END ========

    // 并行执行更新数据库
    await Promise.all([
      // 更新Meta
      this.handleMeta(manager, commonData, effectMap),
      // 无论如何都添加changeset，operations和revision按照客户端传输过来的一样保存，叠加版本号即可
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
      // 更改主表操作版本号
      this.updateRevision(manager, commonData),
    ]);
    // 清空删除字段的列权限设置
    if (resultSet.toDeleteFieldIds.length > 0) {
      await this.restService.delFieldPermission(resultSet.auth, commonData.dstId, resultSet.toDeleteFieldIds);
    }
    const endTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> transaction 结束......总耗时: ${endTime - beginTime}ms`);
  };

  private checkCellValPermission(cmd: string, fieldId: string, permission: NodePermission, resultSet: { [key: string]: any }) {
    // 当字段权限集存在且包含当前字段时，只需校验字段的可编辑权限，不关心节点权限
    let hasPermission = permission.cellEditable;
    if (permission.fieldPermissionMap && permission.fieldPermissionMap[fieldId]) {
      if (resultSet.sourceType === SourceTypeEnum.FORM) {
        hasPermission = permission.fieldPermissionMap[fieldId].setting?.formSheetAccessible;
      } else {
        hasPermission = permission.fieldPermissionMap[fieldId].permission?.editable;
      }
    }

    // 校验节点权限或字段权限
    if (!hasPermission) {
      // 权限不足，本表操作直接拒绝
      if (resultSet.datasheetId === resultSet.linkActionMainDstId) {
        throw new ServerException(PermissionException.OPERATION_DENIED);
      } else {
        // 关联表操作，可能是关联表的联动变更，需要另外处理权限，做记录在外层校验
        resultSet.fldOpInRecMap.set(fieldId, cmd);
      }
    }
  }

  /**
   * 附件引用数更新
   * @param action 操作
   * @param resultSet 收集器
   * @param fieldMap 列数据
   */
  private handleAttachOpCite(action: IJOTAction, resultSet: { [key: string]: any }, fieldMap: IFieldMap) {
    let result;
    // 单元格操作
    if (action.p.includes('data')) {
      result = this.handleAttachForCellValue(action, resultSet.spaceCapacityOverLimit);
    } else {
      // 行数据操作
      result = this.handleAttachForRow(action, resultSet.spaceCapacityOverLimit);
    }
    // addToken和removeToken 都有被实例化成空数组，保证不为null和undefined
    resultSet.attachCiteCollector.addToken.push(...result.addToken);
    resultSet.attachCiteCollector.removeToken.push(...result.removeToken);
  }

  private handleAttachForCellValue(action: IJOTAction, capacityOverLimit: boolean): { addToken: IOpAttach[]; removeToken: IOpAttach[] } {
    let addToken: any[] = [];
    let removeToken: any[] = [];
    if ('oi' in action && !('od' in action)) {
      if (DatasheetOtService.isAttachField(action.oi)) {
        ExceptionUtil.isTrue(capacityOverLimit, OtException.SPACE_CAPACITY_OVER_LIMIT);
        addToken = action.oi.map(item => {
          return { token: item.token, name: item.name };
        });
      }
    }
    // 只有删除，不用检查，只是收集数据
    if ('od' in action && !('oi' in action)) {
      if (DatasheetOtService.isAttachField(action.od)) {
        removeToken = action.od.map(item => {
          return { token: item.token, name: item.name };
        });
      }
    }
    // 删除和新增都有,需要对比oi和od的数据,判断是否是部分删除
    if ('oi' in action && 'od' in action) {
      // 部分删除附件
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
        // 判断交集是否和oi的长度一样，如果一样证明是部分删除不用判断，不一样可能是粘贴覆盖需要判断
        ExceptionUtil.isTrue(capacityOverLimit && intersection(odId, oiId).length !== oiId.length, OtException.SPACE_CAPACITY_OVER_LIMIT);
      }
    }
    return { addToken, removeToken };
  }

  private handleAttachForRow(action: IJOTAction, overLimit: boolean): { addToken: IOpAttach[]; removeToken: IOpAttach[] } {
    const addToken: IOpAttach[] = [];
    const removeToken: IOpAttach[] = [];
    // 行操作只有oi或者od 没有其他情况
    if ('oi' in action) {
      const recordData = 'data' in action.oi ? action.oi.data : action.oi;
      for (const fieldId in recordData) {
        if (recordData[fieldId] && DatasheetOtService.isAttachField(recordData[fieldId])) {
          ExceptionUtil.isTrue(overLimit, OtException.SPACE_CAPACITY_OVER_LIMIT);
          (recordData[fieldId] as IAttachmentValue[]).map(item => {
            addToken.push({ token: item.token, name: item.name });
          });
        }
      }
    }
    // 只有删除，不用检查，只是收集数据
    if ('od' in action) {
      const recordData = 'data' in action.od ? action.od.data : action.od;
      for (const fieldId in recordData) {
        if (recordData[fieldId] && DatasheetOtService.isAttachField(recordData[fieldId])) {
          (recordData[fieldId] as IAttachmentValue[]).map(item => {
            removeToken.push({ token: item.token, name: item.name });
          });
        }
      }
    }
    return { addToken, removeToken };
  }

  private async handleUpdateComment(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toCorrectComment.size) {
      return;
    }

    const { userId, dstId, revision } = commonData;
    const remoteChangeset = effectMap.get(EffectConstantName.RemoteChangeset);
    const recordIds = [...resultSet.toCorrectComment.keys()];
    const deletedRecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, recordIds, true);
    const operationChangeset: any[] = [];
    const recordCommentEntities: any[] = [];
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量新增记录评论开始......`);
    for (const [recordId, comments] of resultSet.toCorrectComment.entries()) {
      const deleteRecord = deletedRecordMap[recordId];
      if (deleteRecord) {
        throw new ServerException(OtException.REVISION_ERROR);
      }
      for (const { index, comment } of comments) {
        const serverDate = new Date();
        if (comment?.commentMsg?.reply) {
          update(comment, 'commentMsg.reply', value => pick(value, 'commentId'));
        }
        recordCommentEntities.push({
          id: IdWorker.nextId().toString(),
          dstId: remoteChangeset.resourceId,
          recordId,
          commentId: comment.commentId,
          commentMsg: comment.commentMsg,
          revision,
          // todo 修改为unitId
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
    // 批量新增
    await manager.createQueryBuilder()
      .insert()
      .into(RecordCommentEntity)
      .values(recordCommentEntities)
      // 如果不设置为false，插入完成后会执行select语句，严重影响性能
      .updateEntity(false)
      .execute();
    // 更新 remoteChangeSet
    const remoteChangeOperations = [{ cmd: CollaCommandName.SystemCorrectComment, actions: operationChangeset }];
    this.updateEffectMap(effectMap, EffectConstantName.RemoteChangeset, remoteChangeOperations);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量新增记录评论结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * 批量处理删除行记录
   * @param manager 数据库管理器
   * @param commonData 公共信息，包含 userId, uuid, dstId 和 revision
   * @param resultSet
   */
  private async handleBatchDeleteRecord(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (resultSet.toDeleteRecordIds.length === 0) {
      return;
    }

    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}]逻辑删除Record`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量删除行记录开始......`);
    let values;
    const baseProps = {
      isDeleted: true,
      revisionHistory: () => `CONCAT_WS(',', revision_history, ${revision})`,
      revision,
      updatedBy: userId
    };
    // 判断操作者是否拥有所有字段可编辑权限，是则清空 data
    const allFieldCanEdit = commonData.permission.fieldPermissionMap ?
      !Object.values(commonData.permission.fieldPermissionMap).find(val => !val.permission.editable) : true;
    if (allFieldCanEdit) {
      values = { data: {}, ...baseProps };
    } else {
      values = { ...baseProps };
    }
    // 批量操作, 超过1000行分批
    const gap = 1000;
    if (resultSet.toDeleteRecordIds.length > gap) {
      const times = Math.ceil(resultSet.toDeleteRecordIds.length / gap);
      for (let i = 0; i < times; i++) {
        const deletedRecordIds = resultSet.toDeleteRecordIds.slice(i * gap, (i + 1) * gap);
        await manager.createQueryBuilder()
          .update(DatasheetRecordEntity)
          .set(values)
          .where('dst_id = :dstId', { dstId })
          .andWhere('record_id IN(:...ids)', { ids: deletedRecordIds })
          .execute();
      }
    } else {
      await manager.createQueryBuilder()
        .update(DatasheetRecordEntity)
        .set(values)
        .where('dst_id = :dstId', { dstId })
        .andWhere('record_id IN(:...ids)', { ids: resultSet.toDeleteRecordIds })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量删除行记录结束......总耗时: ${endTime - beginTime}ms`);
  }

  private async handleBatchDeleteWidget(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[逻辑删除 widget]');
    }
    if (!resultSet.deleteWidgetIds.length) {
      return;
    }
    const { userId, dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量删除 widget 开始......`);
    await manager.createQueryBuilder()
      .update(WidgetEntity)
      .set({
        updatedBy: userId,
        isDeleted: true,
      })
      .where('widget_id IN(:...widgetId)', { widgetId: resultSet.deleteWidgetIds })
      .execute();
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量删除 widget 结束......总耗时: ${endTime - beginTime}ms`);
  }

  private async handleBatchAddWidget(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[逻辑恢复 widget]');
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
    this.logger.info(`[${dstId}] ====> 批量恢复 widget 开始......`);
    const recoverWidgetIds: string[] = [];
    for (const widgetId of resultSet.addWidgetIds) {
      if (deleteWidgetIds.includes(widgetId)) {
        recoverWidgetIds.push(widgetId);
      }
    }
    // 批量操作
    if (recoverWidgetIds.length > 0) {
      await manager.createQueryBuilder()
        .update(WidgetEntity)
        .set({
          updatedBy: userId,
          isDeleted: false,
        })
        .where('widget_id IN(:...widgetId)', { widgetId: recoverWidgetIds })
        .execute();
    }
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量恢复 widget 结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * 批量更新单元格数据
   * @param manager 数据库管理器
   * @param commonData 公共信息，包含 userId, uuid, dstId 和 revision
   * @param effectMap 副作用变量集合
   * @param isDelete 是否是删除单元格内容动作
   * @param resultSet
   */
  private async handleBatchUpdateCell(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    isDelete: boolean,
    resultSet: { [key: string]: any }
  ) {
    const recordFieldMap = isDelete ? resultSet.cleanRecordCellMap : resultSet.replaceCellMap;
    if (!recordFieldMap.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const prevRecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, [...recordFieldMap.keys()]);
    const recordMetaMap = effectMap.get(EffectConstantName.RecordMetaMap);
    const recordMapActions: IJOTAction[] = [];
    const updatedAt = Date.now();
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量更新单元格数据开始......`);

    // 批量更新单元格的数据
    for (const [recordId, cellData] of recordFieldMap) {
      if (!cellData.length) {
        continue;
      }
      // 当前数据库中的 record
      const oldRecord: IRecord = prevRecordMap[recordId];
      // 优先从本次 op 中拿取最新的 recordMeta，否则才从获取数据库中的 recordMeta
      const oldRecordMeta: IRecordMeta = recordMetaMap[recordId] || oldRecord?.recordMeta || {};
      const fieldUpdatedMap: IFieldUpdatedMap = oldRecordMeta.fieldUpdatedMap || {};
      // 需要进行清理的 fieldIds
      const toCleanFieldIds = [...resultSet.cleanFieldMap.keys()].filter(fieldId => {
        return resultSet.cleanFieldMap.get(fieldId) !== FieldType.LastModifiedBy;
      });

      cellData.forEach(fieldData => {
        const fieldId = fieldData.fieldId;

        // 清除单元格内容并且在当前删除列的范围内，则对 recordMeta.fieldUpdatedMap 进行清理
        if (isDelete && toCleanFieldIds.includes(fieldId)) {
          delete fieldUpdatedMap[fieldId];
          return;
        }
        const prevFieldUpdatedInfo = fieldUpdatedMap[fieldId] || {};
        // 更新 fieldUpdatedMap 中对应 fieldId 对应的 at 和 by
        fieldUpdatedMap[fieldId] = { ...prevFieldUpdatedInfo, at: updatedAt, by: uuid };
      });

      // 组装最新的 recordMeta
      const newRecordMeta: IRecordMeta = produce(oldRecordMeta, draft => {
        if (!Object.keys(fieldUpdatedMap).length) {
          delete draft.fieldUpdatedMap;
        } else {
          draft.fieldUpdatedMap = fieldUpdatedMap;
        }

        return draft;
      });

      if (isDelete) {
        const jsonParams = cellData.reduce((pre, cur) => {
          pre += `, '$.${cur.fieldId}'`;
          return pre;
        }, '');

        // 数据库删除单元格内容操作
        await manager.createQueryBuilder()
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
        const jsonParams = cellData.reduce((pre, cur) => {
          pre += `, '$.${cur.fieldId}', CAST(? AS JSON)`;
          params.push(JSON.stringify(cur.data));
          return pre;
        }, '');

        // 数据库更新单元格内容操作
        await manager.createQueryBuilder()
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

      // 中间层协同到前端的 Actions<setRecord>
      // 如果本次 op 和 数据库中都没有 record.recordMeta，则进行新增操作
      if (!recordMetaMap[recordId] && !oldRecord?.recordMeta) {
        const recordAction = DatasheetOtService.generateJotAction(OTActionName.ObjectInsert, ['recordMap', recordId, 'recordMeta'], newRecordMeta);
        recordMapActions.push(recordAction);
      } else {
        const recordAction = DatasheetOtService.generateJotAction(OTActionName.ObjectReplace,
          ['recordMap', recordId, 'recordMeta', 'fieldUpdatedMap'],
          newRecordMeta.fieldUpdatedMap,
          oldRecordMeta.fieldUpdatedMap);
        recordMapActions.push(recordAction);
      }
    }

    // 由于中间层所有的变更需要协同到前端，因此这里会进行副作用的更改，包括 meta 和 remoteChangeset
    const meta: IMeta = await this.getMetaDataByCache(dstId, effectMap);
    const fieldList: IField[] = Object.values(meta.fieldMap);
    // 根据原始 meta，拿到所有的 LastModifiedBy Field；
    const lastModifiedFields = fieldList.filter(({ type, id }) => type === FieldType.LastModifiedBy && !resultSet.cleanFieldMap.get(id));
    // 收集 uuid 到 field.property.uuids，并返回对应 actions
    const metaActions = await this.getMetaActionByFieldType({ uuid, fields: lastModifiedFields }, effectMap);
    // 更新 remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量更新单元格数据结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * 批量创建行数据
   * @param manager 数据库管理器
   * @param commonData 公共信息，包含 userId, uuid, dstId 和 revision
   * @param effectMap 副作用变量集合
   * @param resultSet
   */
  private async handleBatchCreateRecord(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toCreateRecord.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量创建单元格开始......`);

    // 新修改操作数据结构
    const restoreRecordMap = new Map<string, IRestoreRecordInfo>();
    const recordIds = [...resultSet.toCreateRecord.keys()];
    const saveRecordEntities: any[] = [];
    const recordMapActions: IJOTAction[] = [];
    const metaActions: IJOTAction[] = [];

    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}]批量查询数表的行[${recordIds.toString()}]`);
    }

    // 查询是否已删除的，防止重复插入
    const deletedRecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, recordIds, true);
    const deletedRecordIds = Object.keys(deletedRecordMap);
    const meta = await this.getMetaDataByCache(dstId, effectMap);
    const fieldList: IField[] = Object.values(meta.fieldMap);
    const autoNumberFields = fieldList.filter(field => field.type === FieldType.AutoNumber);
    const createdAt = Date.now();
    const updatedAt = createdAt;
    const recordMetaMap = effectMap.get(EffectConstantName.RecordMetaMap);
    let recordIndex = 0;

    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`已删除的行[${deletedRecordIds}]`);
    }
    for (const [recordId, recordData] of resultSet.toCreateRecord.entries()) {
      // 恢复Record, 并更换data
      if (deletedRecordIds.includes(recordId)) {
        // 对 CreatedAt/UpdatedAt/CreatedBy/UpdatedBy/AutoNumber 相关数据做处理
        const prevRecordMeta = deletedRecordMap[recordId].recordMeta;
        const curRecordInfo: IRestoreRecordInfo = { data: recordData };
        const fieldUpdatedMap = prevRecordMeta?.fieldUpdatedMap || {};
        const fieldExtraMap = prevRecordMeta?.fieldExtraMap || {};

        // 新增单元格提醒时在这里写入 recordMeta.fieldExtraMap, 单元格提醒改为异步创建后移除这段代码
        if (resultSet.toCreateAlarms.size) {
          const createAlarms = resultSet.toCreateAlarms.get(recordId) || [];
          createAlarms.forEach((alarm: IRecordAlarm) => {
            const alarmCopy = { ...alarm };
            delete alarmCopy.recordId;
            delete alarmCopy.fieldId;

            fieldExtraMap[alarm.fieldId] = { alarm: alarmCopy };
          });
        }

        if (recordData) {
          Object.keys(recordData).forEach(fieldId => {
            fieldUpdatedMap[fieldId] = fieldUpdatedMap[fieldId] ? {
              ...fieldUpdatedMap[fieldId],
              at: updatedAt,
              by: uuid,
            } : { at: updatedAt, by: uuid };
          });
        }
        // 合并原 data 存在的字段数据
        for (const [fieldId, cellVal] of Object.entries(deletedRecordMap[recordId].data)) {
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
        // 这是重复使用相同的recordId，替换data值
        restoreRecordMap.set(recordId, curRecordInfo);
      } else {
        const updateFieldIds = Object.keys(recordData);
        const fieldUpdatedMap: IFieldUpdatedMap = {};

        // 需要初始化的 fieldId，需要记录其修改时间、修改人
        if (updateFieldIds.length) {
          updateFieldIds.forEach(fieldId => {
            fieldUpdatedMap[fieldId] = { at: updatedAt, by: uuid };
          });
        }

        // 处理 AutoNumber 字段类型，存储于 fieldUpdatedMap 中
        if (autoNumberFields.length > 0) {
          autoNumberFields.forEach(field => {
            const fieldId = field.id;
            const nextId = (field.property.nextId + recordIndex) || 1;
            fieldUpdatedMap[fieldId] = { autoNumber: nextId };
          });
          recordIndex++; // 每多添加一行，自增 1
        }

        // 1. 若直接创建行，则不需要添加修改时间、修改人，即 fieldUpdatedMap 不更新
        // 2. 若直接复制多行，粘贴时若行数不够且单元格非空，则会直接新建并初始化单元格，此时需要添加修改时间、修改人，即 fieldUpdatedMap 更新
        // 3. 若增加了 AutoNumber 列，则必须更新 fieldUpdatedMap
        const newRecordMeta = (updateFieldIds.length || autoNumberFields.length) ? {
          createdAt,
          createdBy: uuid,
          fieldUpdatedMap,
        } : { createdAt, createdBy: uuid };

        // 新增单元格提醒时在这里写入 recordMeta.fieldExtraMap, 单元格提醒改为异步创建后移除这段代码
        const fieldExtraMap = {};
        if (resultSet.toCreateAlarms.size) {
          const createAlarms = resultSet.toCreateAlarms.get(recordId) || [];
          createAlarms.forEach((alarm: IRecordAlarm) => {
            const alarmCopy = { ...alarm };
            delete alarmCopy.recordId;
            delete alarmCopy.fieldId;

            fieldExtraMap[alarm.fieldId] = { alarm: alarmCopy };
          });
        }

        const newMetaWithFieldExtra = isEmpty(fieldExtraMap) ? newRecordMeta : { ...newRecordMeta, fieldExtraMap };

        // 创建新的Record
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

        const recordAction = DatasheetOtService.generateJotAction(OTActionName.ObjectInsert, ['recordMap', recordId,
          'recordMeta'], newMetaWithFieldExtra);
        recordMapActions.push(recordAction);
        recordMetaMap[recordId] = newRecordMeta;
      }
    }

    // === 快速插入数据 ===
    if (saveRecordEntities.length > 0) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${dstId}]批量插入行记录`);
      }
      // 自定义批量插入会快100倍
      if (saveRecordEntities.length > 3000) {
        // 分批次插入，防止SQL语句长度超过限制，一次插入3000条
        const chunkList = chunk(saveRecordEntities, 3000);
        for (const entities of chunkList) {
          await manager.createQueryBuilder()
            .insert()
            .into(DatasheetRecordEntity)
            .values(entities)
            // 如果不设置为false，插入完成后会执行select语句，严重影响性能
            .updateEntity(false)
            .execute();
        }
      } else {
        // 不超过则直接批量插入
        await manager.createQueryBuilder()
          .insert()
          .into(DatasheetRecordEntity)
          .values(saveRecordEntities)
          // 如果不设置为false，插入完成后会执行select语句，严重影响性能
          .updateEntity(false)
          .execute();
      }
      // 由于中间层所有的变更需要协同到前端，因此这里会进行副作用的更改 => meta
      const createdByFields = (fieldList as IField[]).filter(fld => fld.type === FieldType.CreatedBy || fld.type === FieldType.LastModifiedBy);
      const processFields = [...createdByFields, ...autoNumberFields];
      // 组装需要同步给前端的 actions<setFieldAttr>
      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields: processFields, nextId: recordIndex }, effectMap);
      metaActions.push(...fieldAttrActions);
    }

    // === 批量恢复记录 ===
    if (restoreRecordMap.size > 0) {
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(`[${dstId}]批量恢复行记录`);
      }
      for (const [recordId, recordInfo] of restoreRecordMap.entries()) {
        await manager.createQueryBuilder()
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
      }
      // 由于中间层所有的变更需要协同到前端，因此这里会进行副作用的更改 => meta
      // 筛选出 LastModifiedBy 相关的 && 不是即将被删除的 Field
      const updatedByFields = fieldList.filter(({ id, type }) => type === FieldType.LastModifiedBy && !resultSet.cleanFieldMap.get(id));
      // 收集 uuid 到 field.property.uuids，并返回对应 actions
      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields: updatedByFields }, effectMap);
      metaActions.push(...fieldAttrActions);
    }

    // 更新 remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);

    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量创建单元格结束......总耗时: ${endTime - beginTime}ms`);
  }

  private async deleteRecordComment(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toDeleteCommentIds.size) {
      return;
    }

    const { userId, dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量删除记录评论开始......`);
    for (const [recordId, commentIds] of resultSet.toDeleteCommentIds.entries()) {
      const { comments } = await this.recordCommentService.getComments(dstId, recordId);
      const deleteCommentId = commentIds[0];
      if (!comments.find(item => item.commentId === deleteCommentId)) {
        throw new ServerException(OtException.REVISION_ERROR);
      }
      await manager.createQueryBuilder()
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
    this.logger.info(`[${dstId}] ====> 批量删除记录评论结束......总耗时: ${endTime - beginTime}ms`);
  }

  private async handleCommentEmoji(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toUpdateCommentEmoji.size) {
      return;
    }

    const { dstId } = commonData;
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 批量修改评论Emoji表情开始......`);
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
          // 没有emoji表情时跳过本次处理
          continue;
        }
        const oldEmjiList: string[] = oldEmojis[firstKey];
        const currentEmjiUuid = commentMsg.emojis[firstKey][0];
        const oldEmojiIndex = oldEmjiList?.indexOf(currentEmjiUuid) ?? -1;

        if (emojiAction) {
          if (oldEmojiIndex === -1) {
            let insertEmojiSqlTemp;
            if (isEmpty(oldEmojis)) {
              // 第一次新增点赞 栗子：comment_msg -> emojis 不存在
              insertEmojiSqlTemp = `JSON_INSERT(comment_msg, '$.emojis', JSON_OBJECT('${firstKey}', JSON_ARRAY(:emojiActionUuid)))`;
            } else if (!oldEmojis.hasOwnProperty(firstKey)) {
              // 第一次新增点赞emoji 栗子：comment_msg -> emojis -> 'good' 不存在
              insertEmojiSqlTemp = `JSON_INSERT(comment_msg, '$.emojis.${firstKey}', JSON_ARRAY(:emojiActionUuid))`;
            } else {
              // 结构存在点赞 栗子：comment_msg -> emojis -> good -> [...uuid] 不存在
              insertEmojiSqlTemp = `JSON_ARRAY_INSERT(comment_msg , '$.emojis.${firstKey}[0]', :emojiActionUuid)`;
            }
            // 添加
            await manager.createQueryBuilder()
              .update(RecordCommentEntity)
              .set({
                commentMsg: () => insertEmojiSqlTemp
              })
              .where('dst_id = :dstId', { dstId: dstId })
              .andWhere('record_id = :recordId', { recordId: recordId })
              .andWhere('comment_id = :commentId', { commentId: commentId })
              .setParameters({ emojiActionUuid: currentEmjiUuid })
              .execute();
          }
        } else {
          if (oldEmojiIndex !== -1) {
            // 取消
            await manager.createQueryBuilder()
              .update(RecordCommentEntity)
              .set({
                commentMsg: () => `JSON_REMOVE(comment_msg, '$.emojis.${firstKey}[${oldEmojiIndex}]')`
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
    this.logger.info(`[${dstId}] ====> 批量修改评论Emoji表情结束......总耗时: ${endTime - beginTime}ms`);
  }

  private async handleRecordAlarm(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    const { dstId } = commonData;
    const profiler = this.logger.startTimer();
    this.logger.info(`[${dstId}] ====> 处理提醒开始`);

    // 删除提醒
    await this.deleteRecordAlarms(manager, commonData, resultSet);
    // 新增提醒
    await this.createRecordAlarms(manager, commonData, resultSet);
    // 更新提醒, 从 replaceCellMap 中有日期字段 CellValue 改变中收集需要更新的 Record Alarm // TODO refactor: 未来应该由事件处理
    await this.updateRecordAlarms(manager, commonData, resultSet);

    profiler.done({ message: `[${dstId}] ====> 处理提醒结束` });
  }

  private getFieldValueOfRecord(recordId: string, record: IRecord, targetFieldId: string, resultSet: { [key: string]: any }) {
    if (resultSet.toCreateRecord.size) {
      const addRecordData = resultSet.toCreateRecord.get(recordId) || {};
      if (addRecordData[targetFieldId]) {
        return addRecordData[targetFieldId];
      }
    }

    if (resultSet.replaceCellMap.size) {
      const fieldData = resultSet.replaceCellMap.get(recordId) || [];

      const matchedFieldData = fieldData.filter(({ fieldId }) => fieldId === targetFieldId);
      if (matchedFieldData.length > 0) {
        return matchedFieldData[0].data;
      }
    }

    if (!record) return null;

    return record.data[targetFieldId];
  }

  private async createRecordAlarms(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toCreateAlarms.size) return;
    const { userId, spaceId, dstId } = commonData;

    const profiler = this.logger.startTimer();
    this.logger.info(`新增提醒开始 size: ${resultSet.toCreateAlarms.size}`);

    const involvedRecordIds = Array.from(resultSet.toCreateAlarms.keys()) as string[];
    const involvedRecordMap: RecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, involvedRecordIds);

    const newAlarmEntities = involvedRecordIds.reduce((acc, recordId: string) => {
      resultSet.toCreateAlarms.get(recordId).forEach((alarm: IRecordAlarm) => {
        const record = involvedRecordMap[recordId];
        const dateCellValue = this.getFieldValueOfRecord(recordId, record, alarm.fieldId, resultSet) as number;

        const alarmEntity = this.recordAlarmService.convertRecordAlarmToEntity(alarm, dateCellValue, spaceId, dstId, recordId, userId);
        if (alarmEntity) {
          acc.push(alarmEntity);
          resultSet.updatedAlarmIds.push(alarmEntity.alarmId); // 记录已更新的闹钟，避免 updateRecordAlarms 环节重复处理
        }
      });
      return acc;
    }, []);

    // 批量创建提醒
    await this.recordAlarmService.batchCreateRecordAlarms(newAlarmEntities, userId);

    // 将提醒写入 datasheet_record.field_update_info (RecordMeta). // TODO refactor: O(2N) -> O(N)
    await Promise.all(involvedRecordIds.map((recordId: string) => {
      const createAlarms = resultSet.toCreateAlarms.get(recordId) || [];
      if (!involvedRecordMap[recordId]) {
        return null;
      }

      const recordMeta = involvedRecordMap[recordId].recordMeta || {};
      const existFieldExtraMap = recordMeta.fieldExtraMap || {};

      const fieldUpdatedMapChanges = createAlarms.reduce((acc, cur: IRecordAlarm) => {
        const alarmCopy = { ...cur };
        delete alarmCopy.recordId;
        delete alarmCopy.fieldId;

        acc[cur.fieldId] = { ...existFieldExtraMap[cur.fieldId], alarm: alarmCopy };
        return acc;
      }, {});

      recordMeta.fieldExtraMap = Object.assign(existFieldExtraMap, fieldUpdatedMapChanges);

      return manager.createQueryBuilder()
        .update(DatasheetRecordEntity)
        .set({ recordMeta: recordMeta })
        .where([{ dstId, recordId }])
        .execute();
    }));
    profiler.done({ message: '新增提醒结束' });
  }

  private async updateRecordAlarms(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.replaceCellMap.size) return;
    const { userId, dstId } = commonData;

    const profiler = this.logger.startTimer();
    this.logger.info(`更新提醒开始 size: ${resultSet.replaceCellMap.size}`);

    const fieldMap = resultSet.temporaryFieldMap;

    const involvedRecordIds = [];
    const involvedFieldIds = [];
    Array.from(resultSet.replaceCellMap.keys()).forEach((recordId: string) => {
      const fieldData = resultSet.replaceCellMap.get(recordId);
      fieldData.forEach(({ fieldId, data }) => {
        const field = fieldMap[fieldId] as IField;
        if (field && field.type === FieldType.DateTime) {
          involvedRecordIds.push(recordId);
          involvedFieldIds.push(fieldId);
        }
      });
    });

    const relatedAlarms = await this.recordAlarmService.getRecordAlarmsByRecordIdsAndFieldIds(dstId, involvedRecordIds, involvedFieldIds);
    if (isEmpty(relatedAlarms)) return;

    const involvedAlarms = relatedAlarms.filter((alarm) => !resultSet.updatedAlarmIds.includes(alarm.alarmId));
    if (isEmpty(involvedAlarms)) return;

    const involvedRecordMap: RecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, involvedRecordIds);
    const nowTime = dayjs(new Date());

    // TypeORM 不支持一次更新多个 Entities 为各自不同的值 (https://github.com/typeorm/typeorm/issues/5126)
    involvedAlarms.forEach((alarmEntity: DatasheetRecordAlarmEntity) => {
      const record = involvedRecordMap[alarmEntity.recordId];
      if (!record.recordMeta.fieldExtraMap) return;

      const dateCellValue = this.getFieldValueOfRecord(record.id, record, alarmEntity.fieldId, resultSet);
      if (!dateCellValue) return;

      const fieldExtraInfo = record.recordMeta.fieldExtraMap[alarmEntity.fieldId];
      if (!fieldExtraInfo || !fieldExtraInfo.alarm) return;

      const alarmMeta = fieldExtraInfo.alarm;
      const alarmAt = this.recordAlarmService.calculateAlarmAt(dateCellValue, alarmMeta.time, alarmMeta.subtract);
      if (!alarmAt || nowTime.isAfter(alarmAt)) return;

      manager.createQueryBuilder()
        .update(DatasheetRecordAlarmEntity)
        .set({
          alarmAt: alarmAt,
          status: RecordAlarmStatus.PENDING,
          updatedBy: userId,
          updatedAt: nowTime.toDate()
        })
        .where('id = :id', { id: alarmEntity.id })
        .execute();
    });
    profiler.done({ message: '更新提醒结束' });
  }

  private async deleteRecordAlarms(
    manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.toDeleteAlarms.size) return;
    const { userId, dstId } = commonData;

    const profiler = this.logger.startTimer();
    this.logger.info(`删除提醒开始 size: ${resultSet.toDeleteAlarms.size}`);

    let deletedAlarmIds = [];
    const deletedAlarmRecordIdsByFieldId = {};
    Array.from(resultSet.toDeleteAlarms.keys()).forEach((recordId: string) => {
      const deleteAlarms = resultSet.toDeleteAlarms.get(recordId) || [];
      if (isEmpty(deleteAlarms)) return;
      deletedAlarmIds = deletedAlarmIds.concat(deleteAlarms.map((alarm: IRecordAlarm) => alarm.id));

      deleteAlarms.forEach((alarm: IRecordAlarm) => {
        if (!deletedAlarmRecordIdsByFieldId[alarm.fieldId]) {
          deletedAlarmRecordIdsByFieldId[alarm.fieldId] = [];
        }
        deletedAlarmRecordIdsByFieldId[alarm.fieldId].push(recordId);
      });
    });

    // 批量删除提醒
    await this.recordAlarmService.batchDeleteRecordAlarms(deletedAlarmIds, userId);

    // 批量将提醒从 datasheet_record.field_update_info (RecordMeta) 中移除
    await Promise.all(Object.keys(deletedAlarmRecordIdsByFieldId).map((fieldId: string) => {
      const relatedRecordIds = deletedAlarmRecordIdsByFieldId[fieldId];
      const jsonParam = `'$.fieldExtraMap.${fieldId}.alarm'`;

      return manager.createQueryBuilder()
        .update(DatasheetRecordEntity)
        .set({ recordMeta: () => `JSON_REMOVE(field_updated_info, ${jsonParam})` })
        .where('dstId = :dstId', { dstId: dstId })
        .andWhere('recordId IN (:recordIds)', { recordIds: relatedRecordIds })
        .execute();
    }));
    profiler.done({ message: '删除提醒结束' });
  }

  /**
   * 初始化部分特殊的 Field (如 AutoNumber)
   * @param manager 数据库管理器
   * @param commonData 公共信息，包含 userId, uuid, dstId 和 revision
   * @param effectMap 副作用变量集合
   * @param resultSet
   */
  private async handleBatchInitField(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>,
    resultSet: { [key: string]: any }
  ) {
    if (!resultSet.initFieldMap.size) {
      return;
    }

    const { userId, uuid, dstId, revision } = commonData;
    const metaActions: IJOTAction[] = [];
    const recordMapActions: IJOTAction[] = [];
    const meta: IMeta = await this.getMetaDataByCache(dstId, effectMap);
    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 初始化特殊字段 RecordMeta 数据开始......`);

    for (const [viewIdx, fields] of resultSet.initFieldMap) {
      // 需要根据当前 view 来确定自增顺序
      const recordIds = meta.views[viewIdx].rows.map(row => row.recordId);

      // 当前视图无记录，则只需进行 nextId 的初始化，略过其余逻辑
      if (!recordIds.length) {
        const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields, nextId: 1 }, effectMap);
        metaActions.push(...fieldAttrActions);
        continue;
      }

      // 当前视图有记录，执行正常逻辑
      const prevRecordMap: RecordMap = await this.recordService.getRecordsByDstIdAndRecordIds(dstId, recordIds);
      const recordMetaMap: Map<string, IRecordMeta> = effectMap.get(EffectConstantName.RecordMetaMap);
      const recordIdMap = new Map<string, number>();
      let nextId = 1;

      // 需要根据当前 view 视图进行排序，以空间换时间来降低计算的复杂度
      recordIds.forEach(recordId => recordIdMap.set(recordId, nextId++));

      // 这里不能使用 forEach，否则会导致内部 async 回调函数失效
      for (const record of Object.values(prevRecordMap)) {
        const recordId = record.id;
        // 这里需要获取的 record 是最新状态的，如果在本次 OP 的记录中取不到，就直接取数据库中的记录
        const oldRecordMeta = recordMetaMap[recordId] || record?.recordMeta || {};
        const fieldUpdatedMap = oldRecordMeta.fieldUpdatedMap || {};

        fields.map(field => {
          const fieldId = field.id;
          const value = recordIdMap.get(recordId);
          // autoNumber 不会有更新时间和更新人
          fieldUpdatedMap[fieldId] = { autoNumber: value };
        });

        // 组装最新的 recordMeta
        const newRecordMeta = {
          ...oldRecordMeta,
          fieldUpdatedMap,
        };

        await manager.createQueryBuilder()
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

        // 中间层 => 前端: 协同 Actions<setRecord>
        const recordAction = DatasheetOtService.generateJotAction(
          OTActionName.ObjectReplace,
          ['recordMap', recordId, 'recordMeta'],
          newRecordMeta,
          oldRecordMeta
        );
        recordMapActions.push(recordAction);
      }

      const fieldAttrActions = await this.getMetaActionByFieldType({ uuid, fields, nextId }, effectMap);
      metaActions.push(...fieldAttrActions);
    }
    // 由于中间层所有的变更需要协同到前端，因此这里会进行副作用的更改，包括 meta 和 remoteChangeset
    this.updateEffectRemoteChangeset(effectMap, metaActions, recordMapActions);
    const endTime = +new Date();
    this.logger.info(`[${commonData.dstId}] ====> 初始化特殊字段 RecordMeta 数据结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * 处理meta
   * @param manager 数据库管理器
   * @param commonData 公共信息，包含 userId, uuid, dstId 和 revision
   * @param effectMap 副作用变量集合
   */
  private async handleMeta(
    manager: EntityManager,
    commonData: ICommonData,
    effectMap: Map<string, any>
  ) {
    const { userId, dstId, revision } = commonData;
    const metaActions = effectMap.get(EffectConstantName.MetaActions);
    if (metaActions.length === 0) {
      return;
    }
    // 获取数据库meta
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}]获取数表的Meta`);
    }

    const beginTime = +new Date();
    this.logger.info(`[${dstId}] ====> 数据库查询Meta开始......`);
    const meta = await this.getMetaDataByCache(dstId, effectMap);
    const endTime = +new Date();
    this.logger.info(`[${dstId}] ====> 数据库查询Meta结束......总耗时: ${endTime - beginTime}ms`);

    // 合并Meta
    try {
      jot.apply({ meta }, metaActions);
    } catch (e) {
      this.logger.error(e);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}]修改数表的Meta`);
    }

    if (meta.views.find(view => view == null)) {
      // 在成功应用 OP 之后检查一遍 views ,如果发现有 null 存在就直接报错
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    await manager.update(DatasheetMetaEntity, { dstId }, { metaData: meta, revision, updatedBy: userId });
  }

  /**
   * 创建新的changeset存储db
   * @param manager 数据库管理器
   * @param commonData
   * @param remoteChangeset 存储db的changeset
   */
  private async createNewChangeset(manager: EntityManager, commonData: ICommonData, remoteChangeset: IRemoteChangeset) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${remoteChangeset.resourceId}]插入新变更集`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> 数据库保存变更集开始......`);
    const { userId } = commonData;
    await manager.createQueryBuilder()
      .insert()
      .into(DatasheetChangesetEntity)
      .values([{
        id: IdWorker.nextId().toString(),
        messageId: remoteChangeset.messageId,
        dstId: remoteChangeset.resourceId,
        memberId: userId,
        operations: remoteChangeset.operations,
        revision: remoteChangeset.revision,
        createdBy: userId,
        updatedBy: userId,
      }])
      // 如果不设置为false，插入完成后会执行select语句，严重影响性能
      .updateEntity(false)
      .execute();
    const endTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> 数据库保存变更集结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * @param manager 数据库管理器
   * @param commonData
   */
  private async updateRevision(manager: EntityManager, commonData: ICommonData) {
    const { userId, dstId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${dstId}]修改主表操作版本号`);
    }
    await manager.update(DatasheetEntity, { dstId }, { revision, updatedBy: userId });
  }

  /**
   * 更新 effectMap 中的 remoteChange
   * @param effectMap 副作用变量集合
   * @param metaActions meta 相关的 actions
   * @param recordMapActions recordMap 相关的 actions
   */
  private updateEffectRemoteChangeset(
    effectMap: Map<string, any>, metaActions: IJOTAction[] | null, recordMapActions: IJOTAction[] | null
  ) {
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
   * 获取 meta 元数据
   * @param dstId 数表id
   * @param effectMap 副作用变量集合
   */
  private async getMetaDataByCache(dstId: string, effectMap: Map<string, any>): Promise<IMeta> {
    if (effectMap.has(EffectConstantName.Meta)) {
      return effectMap.get(EffectConstantName.Meta);
    }

    const meta = await this.metaService.getMetaDataByDstId(dstId, OtException.META_LOST_ERROR);
    effectMap.set(EffectConstantName.Meta, meta);
    return meta;
  }

  /**
   * 获取改变 meta 的 action
   * @param data 携带的 data
   * @param effectMap 副作用变量集合
   */
  private getMetaActionByFieldType(data: { uuid?: string; fields: IField[]; nextId?: number; }, effectMap: Map<string, any>) {
    const metaActions: IJOTAction[] = [];
    const { uuid, fields } = data;

    if (!fields?.length) {
      return [];
    }
    for (const field of fields) {
      const { id: fieldId, property, type } = field;

      switch (type) {
        case FieldType.AutoNumber: {
          const nextId = (!property.nextId ? data.nextId : property.nextId + data.nextId) || 1;
          const newField = produce(field, draft => {
            draft.property.nextId = nextId;
            return draft;
          });
          const metaAction = DatasheetOtService.generateJotAction(OTActionName.ObjectReplace, ['meta', 'fieldMap', fieldId], newField, field);
          metaActions.push(metaAction);
          break;
        }
        case FieldType.CreatedBy:
        case FieldType.LastModifiedBy: {
          if (property.uuids.includes(uuid)) {
            break;
          }
          const newField = produce(field, draft => {
            draft.property.uuids.push(uuid);
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
   * 根据对应 constantName 更新 effectMap
   * @param effectMap 副作用变量集合
   * @param constantName effectMap 中的键名
   * @param value 更新的值
   */
  private updateEffectMap(effectMap: Map<string, any>, constantName: EffectConstantName, value) {
    const base = effectMap.get(constantName);
    const current = produce(base, (draft) => {
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
}

