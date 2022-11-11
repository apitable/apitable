import {
  ApiTipConstant,
  CellFormatEnum, CollaCommandName, getEmojiIconNativeString, ICellValue, ICollaCommandOptions, IField, IFieldMap, IMeta, INode, IRecordMap,
  IReduxState, ISnapshot, ISortedField, ISpaceInfo, IViewColumn, IViewProperty, IViewRow, Selectors,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { keyBy, map } from 'lodash';
import { Store } from 'redux';
import { InjectLogger } from 'shared/common';
import { OrderEnum } from 'shared/enums';
import { FieldTypeEnum } from 'shared/enums/field.type.enum';
import { ApiException } from 'shared/exception';
import { getAPINodeType } from 'shared/helpers/fusion.helper';
import { ICellValueMap, IFieldValue, IFieldValueMap, IFieldVoTransformOptions, IRecordsTransformOptions } from 'shared/interfaces';
import { IAPIFolderNode, IAPINode, IAPINodeDetail } from 'shared/interfaces/node.interface';
import { IAPISpace } from 'shared/interfaces/space.interface';
import { Logger } from 'winston';
import { ApiRecordDto } from '../dtos/api.record.dto';
import { FieldManager } from '../field.manager';
import { IFieldTransformInterface } from '../i.field.transform.interface';
import { FieldCreateRo } from '../ros/record.field.create.ro';
import { FieldUpdateRo } from '../ros/record.field.update.ro';
import { RecordQueryRo } from '../ros/record.query.ro';
import { ListVo } from '../vos/list.vo';
import { PageVo } from '../vos/page.vo';

@Injectable()
export class FusionApiTransformer implements IFieldTransformInterface {
  constructor(
    @InjectLogger() private readonly logger: Logger
  ) {}

  getUpdateFieldCommandOptions(dstId: string, field: IField, meta: IMeta): ICollaCommandOptions {
    return {
      cmd: CollaCommandName.SetFieldAttr,
      datasheetId: dstId,
      fieldId: field.id,
      data: field,
    };
  }

  getAddRecordCommandOptions(dstId: string, records: FieldCreateRo[], meta: IMeta): ICollaCommandOptions {
    const cellValues = records.reduce<ICellValueMap[]>((pre, cur) => {
      // Looping the map here is for getting the default value
      Object.keys(cur.fields);
      // Already converted Command with defaultValue inside
      pre.push(cur.fields);
      return pre;
    }, []);
    return {
      cmd: CollaCommandName.AddRecords,
      datasheetId: dstId,
      viewId: meta.views[0].id,
      index: meta.views[0].rows.length,
      count: cellValues.length,
      cellValues,
      ignoreFieldPermission: true,
    };
  }

  getUpdateRecordCommandOptions(dstId: string, records: FieldUpdateRo[], meta: IMeta): ICollaCommandOptions {
    const data = records.reduce<{
      recordId: string;
      fieldId: string;
      field?: IField; // [Optional], pass in field information. Applies to addRecords on fields that have not yet been applied to a snapshot
      value: ICellValue;
    }[]>((pre, cur) => {
      Object.keys(cur.fields).forEach(fieldId => {
        pre.push({ recordId: cur.recordId, fieldId, value: cur.fields[fieldId] });
      });
      return pre;
    }, []);
    return {
      cmd: CollaCommandName.SetRecords,
      datasheetId: dstId,
      data,
    };
  }

  getDeleteRecordCommandOptions(recordIds: string[]): ICollaCommandOptions {
    return {
      cmd: CollaCommandName.DeleteRecords,
      data: recordIds,
    };
  }

  public nodeDetailVoTransform(nodeItem: INode): IAPINodeDetail {
    const res: IAPINodeDetail = {
      id: nodeItem.nodeId,
      name: nodeItem.nodeName,
      type: getAPINodeType(nodeItem.type),
      icon: getEmojiIconNativeString(nodeItem.icon),
      isFav: nodeItem.nodeFavorite,
    };
    if (nodeItem.children && nodeItem.children.length) {
      (res as IAPIFolderNode).children = nodeItem.children.map(item => this.nodeDetailVoTransform(item));
    }
    return res;
  }

  public nodeListVoTransform(nodeList: INode[]): IAPINode[] {
    return nodeList.map(nodeItem => {
      return {
        id: nodeItem.nodeId,
        name: nodeItem.nodeName,
        type: getAPINodeType(nodeItem.type),
        icon: getEmojiIconNativeString(nodeItem.icon),
        isFav: nodeItem.nodeFavorite,
      };
    });
  }

  public spaceListVoTransform(spaceList: ISpaceInfo[]): IAPISpace[] {
    return spaceList.map(spaceItem => {
      const res: IAPISpace = {
        id: spaceItem.spaceId,
        name: spaceItem.name,
      };
      if (spaceItem.admin) {
        res.isAdmin = spaceItem.admin;
      }
      return res;
    });
  }

  public async recordPageVoTransform(options: IRecordsTransformOptions, query: RecordQueryRo): Promise<PageVo> {
    // Pagination
    const maxRecords = query.maxRecords && query.maxRecords <= options.rows.length ? query.maxRecords : options.rows.length;
    const rows = options.rows.slice(0, maxRecords);
    const start = (query.pageNum - 1) * query.pageSize;
    const end = start + query.pageSize;
    const pageRows = query.pageSize == -1 ? rows : rows.slice(start, end);
    // Convert after paging to reduce calculations
    const listVo: ListVo = await this.recordsVoTransform({ ...options, rows: pageRows }, query.cellFormat);
    return {
      total: maxRecords,
      pageNum: query.pageNum,
      pageSize: pageRows.length,
      records: listVo.records,
    };
  }

  public recordsVoTransform(options: IRecordsTransformOptions, cellFormat = CellFormatEnum.JSON): ListVo {
    const dto: ApiRecordDto[] = [];
    const snapshot = Selectors.getSnapshot(options.store.getState());
    if (!snapshot) {
      return null;
    }
    const recordMap = snapshot.recordMap;
    const fieldKeys = Object.keys(options.fieldMap);
    const columnMap = keyBy(options.columns, 'fieldId');
    options.rows.map(row => {
      const fields: IFieldValueMap = {};
      const record = recordMap[row.recordId];
      if (record) {
        fieldKeys.forEach(field => {
          // Filter hidden
          const column = columnMap[options.fieldMap[field].id];
          if (column && !column.hidden) {
            const cellValue = Selectors.getCellValue(
              options.store.getState(),
              Selectors.getSnapshot(options.store.getState()),
              row.recordId,
              options.fieldMap[field].id,
            );
            fields[field] = this.voTransform(cellValue, options.fieldMap[field], {
              fieldMap: options.fieldMap,
              record,
              store: options.store,
              cellFormat,
            });
          }
        });
        dto.push({
          recordId: recordMap[row.recordId].id,
          createdAt: recordMap[row.recordId].createdAt,
          updatedAt: recordMap[row.recordId].updatedAt,
          fields,
        });
      }
    });
    return { records: dto };
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField, fieldMap: IFieldMap): Promise<ICellValue> {
    // All fields are only converted if they are not null
    if (fieldValue) {
      const transformer = FieldManager.findService(FieldTypeEnum.get(field.type).name);
      if (!transformer) {
        this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type).name, trace: 'Field converter not found' }));
        return null;
      }
      return transformer.roTransform(fieldValue, field, fieldMap);
    }
    return null;
  }

  public voTransform(fieldValue: ICellValue, field: IField, options: IFieldVoTransformOptions): IFieldValue {
    // All non-computed fields are only converted if they are not null
    if (!FieldTypeEnum.get(field.type)) {
      this.logger.error(JSON.stringify({ validator: { field }, trace: 'Field converter not found' }));
      return undefined;
    }
    const transformer = FieldManager.findService(FieldTypeEnum.get(field.type).name);
    if (!transformer) {
      this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type).name, trace: 'Field converter not found' }));
      return undefined;
    }
    const value = transformer.voTransform(fieldValue, field, options);
    if (isNil(value)) {
      return undefined;
    }
    return value;
  }

  /**
   * get view group info
   * @param query RecordQueryRo
   * @param findView the default view info
   * @return ISortedField[]
   */
  getGroupInfo(query: RecordQueryRo, findView?: (viewId?: string) => IViewProperty): ISortedField[] {
    let rules = [];
    // sort with desc in front
    if (query.sort) {
      query.sort.forEach(sort => {
        rules.push({ fieldId: sort.field, desc: sort.order === OrderEnum.DESC });
      });
    }
    if (!query.recordIds && query.viewId && findView) {
      const view = findView(query.viewId);
      // compatible with old data
      if (view && view.sortInfo) {
        if (Array.isArray(view.sortInfo)) {
          rules = rules.concat(view.sortInfo);
        }
        if (view.sortInfo.rules) {
          rules = rules.concat(view.sortInfo.rules);
        }
      }
      if (view && view.groupInfo) {
        if (Array.isArray(view.groupInfo)) {
          rules = rules.concat(view.groupInfo);
        }
      }
    }
    return rules;
  }

  getRecordRows(recordMap: IRecordMap): IViewRow[] {
    return map(recordMap, record => {
      return { recordId: record.id };
    });
  }

  getViewByViewIdOrDefault(state: IReduxState, datasheetId: string) {
    return (viewId?: string) => {
      return Selectors.getViewByIdWithDefault(state, datasheetId, viewId);
    };
  }

  getViewInfo(query: RecordQueryRo, snapshot: ISnapshot, store: Store<IReduxState>): IViewProperty {
    const findView = this.getViewByViewIdOrDefault(store.getState(), snapshot.datasheetId);
    // Default first, use the order of the first view rows + user-defined order
    const view: IViewProperty = {
      ...findView(),
      groupInfo: this.getGroupInfo(query, findView),
    };
    // Use the sorting/filtering criteria inside the view
    if (query.viewId) {
      const queryView = findView(query.viewId);
      if (!queryView) {
        throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId: query.viewId });
      }
      view.name = queryView.name;
      view.id = query.viewId;
      view.columns = queryView.columns;
      view.filterInfo = queryView.filterInfo;
      view.rows = queryView.rows;
    } else {
      // Get all data without explicitly specifying a view, unhide records, unhide view filter conditions, unhide columns.
      view.rows = view.rows.map(item => ({
        recordId: item.recordId,
      }));
      view.filterInfo = undefined;
      view.columns = (view.columns as IViewColumn[]).map(item => ({ fieldId: item.fieldId }));
    }
    // First use the sort using the incoming recordId + user-defined sort
    if (query.recordIds) {
      view.rows = this.getRecordRows(snapshot.recordMap);
    }
    return view;
  }
}
