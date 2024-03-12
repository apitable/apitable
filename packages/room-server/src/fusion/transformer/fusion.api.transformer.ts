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
  ISetRecordOptions,
  ApiTipConstant,
  CellFormatEnum,
  databus,
  getEmojiIconNativeString,
  ICellValue,
  IField,
  IFieldMap,
  IMeta,
  INode,
  IRecord,
  IRecordMap,
  IReduxState,
  ISortedField,
  ISpaceInfo,
  IViewColumn,
  IViewProperty,
  IViewRow,
  Selectors,
  CollaCommandName,
  ICollaCommandOptions,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Store } from 'redux';
import { InjectLogger } from 'shared/common';
import { OrderEnum } from 'shared/enums';
import { FieldTypeEnum } from 'shared/enums/field.type.enum';
import { ApiException } from 'shared/exception';
import { getApiNodePermission, getAPINodeType } from 'shared/helpers/fusion.helper';
import { IFieldValue, IFieldValueMap, IFieldVoTransformOptions, IViewInfoOptions } from 'shared/interfaces';
import { IAPIFolderNode, IAPINode, IAPINodeDetail } from 'shared/interfaces/node.interface';
import { IAPISpace } from 'shared/interfaces/space.interface';
import { Logger } from 'winston';
import { ApiRecordDto } from '../dtos/api.record.dto';
import { FieldManager } from '../field.manager';
import { IFieldTransformInterface } from '../i.field.transform.interface';
import { FieldCreateRo } from '../ros/record.field.create.ro';
import { FieldUpdateRo } from '../ros/record.field.update.ro';
import { RecordQueryRo } from '../ros/record.query.ro';

@Injectable()
export class FusionApiTransformer implements IFieldTransformInterface {
  constructor(@InjectLogger() private readonly logger: Logger) {}

  getAddRecordCommandOptions(dstId: string, records: FieldCreateRo[], meta: IMeta): ICollaCommandOptions {
    const cellValues = records.map((record) => record.fields);
    return {
      cmd: CollaCommandName.AddRecords,
      datasheetId: dstId,
      viewId: meta.views[0]!.id,
      index: meta.views[0]!.rows.length,
      count: cellValues.length,
      cellValues,
      ignoreFieldPermission: true,
      ignoreFieldLimit: true,
    };
  }

  getUpdateCellOptions(records: FieldUpdateRo[]): ISetRecordOptions[] {
    return records.flatMap((record) =>
      Object.keys(record.fields).map((fieldId) => ({
        recordId: record.recordId,
        fieldId,
        value: record.fields[fieldId]!,
      })),
    );
  }

  public nodeDetailVoTransform(nodeItem: INode): IAPINodeDetail {
    const res: IAPINodeDetail = {
      id: nodeItem.nodeId,
      name: nodeItem.nodeName,
      type: getAPINodeType(nodeItem.type),
      icon: getEmojiIconNativeString(nodeItem.icon),
      isFav: nodeItem.nodeFavorite,
      permission: getApiNodePermission(nodeItem.role),
    };
    if (nodeItem.children && nodeItem.children.length) {
      (res as IAPIFolderNode).children = nodeItem.children.map((item) => this.nodeDetailVoTransform(item));
    }
    return res;
  }

  public nodeListVoTransform(nodeList: INode[]): IAPINode[] {
    return nodeList.map((nodeItem) => {
      return {
        id: nodeItem.nodeId,
        name: nodeItem.nodeName,
        type: getAPINodeType(nodeItem.type),
        icon: getEmojiIconNativeString(nodeItem.icon),
        isFav: nodeItem.nodeFavorite,
        permission: getApiNodePermission(nodeItem.role)!,
      };
    });
  }

  public spaceListVoTransform(spaceList: ISpaceInfo[]): IAPISpace[] {
    return spaceList.map((spaceItem) => {
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

  public recordVoTransform(record: IRecord, options: databus.IRecordVoTransformOptions, cellFormat = CellFormatEnum.JSON): ApiRecordDto {
    const { store, fieldKeys, columnMap, fieldMap } = options;
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state)!;
    const fields: IFieldValueMap = {};
    fieldKeys.forEach((field) => {
      // Filter hidden
      const column = columnMap[fieldMap[field]!.id];
      if (column && !column.hidden) {
        const cellValue = Selectors.getCellValue(state, snapshot, record.id, fieldMap[field]!.id);
        const value = this.voTransform(cellValue, fieldMap[field]!, {
          fieldMap,
          record,
          store,
          cellFormat,
        });
        if (value !== undefined) {
          fields[field] = value;
        }
      }
    });
    return {
      recordId: record.id,
      createdAt: record.createdAt!,
      updatedAt: record.updatedAt!,
      fields,
    };
  }

  // eslint-disable-next-line require-await
  async roTransform(fieldValue: IFieldValue, field: IField, fieldMap: IFieldMap): Promise<ICellValue> {
    // All fields are only converted if they are not null
    if (fieldValue) {
      const transformer = FieldManager.findService(FieldTypeEnum.get(field.type)!.name);
      if (!transformer) {
        this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type)!.name, trace: 'Field converter not found' }));
        return null;
      }
      return transformer.roTransform(fieldValue, field, fieldMap);
    }
    return null;
  }

  public voTransform(fieldValue: ICellValue, field: IField, options: IFieldVoTransformOptions): IFieldValue | undefined {
    // All non-computed fields are only converted if they are not null
    if (!FieldTypeEnum.get(field.type)) {
      this.logger.error(JSON.stringify({ validator: { field }, trace: 'Field converter not found' }));
      return undefined;
    }
    const transformer = FieldManager.findService(FieldTypeEnum.get(field.type)!.name);
    if (!transformer) {
      this.logger.error(JSON.stringify({ validator: FieldTypeEnum.get(field.type)!.name, trace: 'Field converter not found' }));
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
  getGroupInfo(query: RecordQueryRo, store: Store<IReduxState>, datasheetId: string): ISortedField[] {
    const rules: ISortedField[] = [];
    // sort with desc in front
    if (query.sort) {
      query.sort.forEach((sort) => {
        rules.push({ fieldId: sort.field, desc: sort.order === OrderEnum.DESC });
      });
    }
    if (!query.recordIds && query.viewId) {
      const view = Selectors.getViewByIdWithDefault(store.getState(), datasheetId, query.viewId);
      // compatible with old data
      if (view && view.sortInfo) {
        if (Array.isArray(view.sortInfo)) {
          rules.push(...view.sortInfo);
        }
        if (view.sortInfo.rules) {
          rules.push(...view.sortInfo.rules);
        }
      }
      if (view && view.groupInfo) {
        if (Array.isArray(view.groupInfo)) {
          rules.push(...view.groupInfo);
        }
      }
    }
    return rules;
  }

  getRecordRows(recordMap: IRecordMap, recordIds: string[]): IViewRow[] {
    const rows: IViewRow[] = [];
    for (const recordId of recordIds) {
      if (recordMap[recordId]) {
        rows.push({ recordId });
      }
    }
    return rows;
  }

  getViewInfo(options: IViewInfoOptions): IViewProperty {
    const { recordIds, viewId, sortRules, snapshot, state } = options;
    if (!recordIds && viewId) {
      const view = Selectors.getViewByIdWithDefault(state, snapshot.datasheetId, viewId);
      // compatible with old data
      if (view) {
        if (view.groupInfo) {
          if (Array.isArray(view.groupInfo)) {
            sortRules.push(...view.groupInfo);
          }
        }
        if (view.sortInfo) {
          if (Array.isArray(view.sortInfo)) {
            sortRules.push(...view.sortInfo);
          } else if (view.sortInfo.rules) {
            sortRules.push(...view.sortInfo.rules);
          }
        }
      }
    }

    // Default first, use the order of the first view rows + user-defined order
    const view: IViewProperty = {
      ...Selectors.getViewByIdWithDefault(state, snapshot.datasheetId)!,
      groupInfo: sortRules,
    };

    // Use the sorting/filtering criteria inside the view
    if (viewId) {
      const queryView = Selectors.getViewByIdWithDefault(state, snapshot.datasheetId, viewId);
      if (!queryView) {
        throw ApiException.tipError(ApiTipConstant.api_query_params_view_id_not_exists, { viewId });
      }
      view.name = queryView.name;
      view.id = viewId;
      view.columns = queryView.columns;
      view.filterInfo = queryView.filterInfo;
      view.rows = queryView.rows;
    } else {
      // Get all data without explicitly specifying a view, unhide records, unhide view filter conditions, unhide columns.
      view.rows = view.rows.map((item) => ({
        recordId: item.recordId,
      }));
      view.filterInfo = undefined;
      view.columns = (view.columns as IViewColumn[]).map((item) => ({ fieldId: item.fieldId }));
    }

    // First use the sort using the incoming recordId + user-defined sort
    if (recordIds) {
      // recordMap may contain extra records for rendering records specified by recordIds, but we only
      // need records specified by recordIds in the view.
      view.rows = this.getRecordRows(snapshot.recordMap, recordIds);
    }

    return view;
  }
}
