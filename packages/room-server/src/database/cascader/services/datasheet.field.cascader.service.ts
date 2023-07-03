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

import { databus, IRecordMap, isBasicField, IViewRow } from '@apitable/core';
import { IAuthHeader } from 'shared/interfaces';
import { CascaderLinkedField } from '../models/cascader.link.field';
import { CascaderVo } from '../vos/cascader.vo';
import { CascaderDatabusService, CascaderSourceDataView } from './cascader.databus.service';
import { groupBy, reduce, slice } from 'lodash';
import { CascaderChildren } from '../models/cascader.children';
import sha1 from 'sha1';
import { getTextByCellValue, IFieldMethods } from '../utils/cell.value.to.string';
import { Injectable } from '@nestjs/common';
import { ILinkRecordData } from '../models/link.record.data';
import { getBranch, getNode, initStorageContainers, linkNodeToParentNode, setNode } from '../utils/tree.util';

@Injectable()
export class DatasheetFieldCascaderService {
  constructor(private readonly cascaderDataBusService: CascaderDatabusService) {}

  public async cascaderPack(auth: IAuthHeader, dstId: string, viewId: string, linkedFieldIds?: string[]): Promise<CascaderVo> {
    const datasheet = await this.cascaderDataBusService.getDatasheet(dstId);
    if (datasheet === null) {
      throw new Error('datasheet no exist');
    }
    const cascaderSourceDataView = await this.cascaderDataBusService.getView(datasheet, { auth, viewId });
    if (cascaderSourceDataView === null) {
      throw new Error('view no exist');
    }
    const linkedFields: CascaderLinkedField[] = await this.getCascaderLinkedFields(cascaderSourceDataView.view);
    const fieldIds: string[] = linkedFieldIds || slice(linkedFields, 0, 2).map(i => i.id);
    if (fieldIds.length === 0) {
      return {
        linkedFields: [],
        treeSelects: [],
      };
    }
    const treeSelects = this.getCascaderLinkedRecords(datasheet, cascaderSourceDataView, fieldIds);
    return {
      linkedFields,
      treeSelects,
    };
  }

  public async getCascaderLinkedFields(view: databus.View): Promise<CascaderLinkedField[]> {
    const fields = await view.getFields({});
    const fieldMap = groupBy(fields, 'id');
    return view.columns.reduce((result, column) => {
      if (fieldMap[column.fieldId] && isBasicField(fieldMap[column.fieldId]![0]!.type)) {
        result.push({
          id: column.fieldId,
          name: fieldMap[column.fieldId]![0]!.name,
          type: fieldMap[column.fieldId]![0]!.type,
        });
      }
      return result;
    }, [] as CascaderLinkedField[]);
  }

  public getCascaderLinkedRecords(
    datasheet: databus.Datasheet,
    cascaderSourceDataView: CascaderSourceDataView,
    linkedFieldIds: string[],
  ): CascaderChildren[] {
    const { recordMap, viewRows } = { recordMap: datasheet.snapshot.recordMap, viewRows: cascaderSourceDataView.view.rows };

    return this.buildByRecursive(viewRows, recordMap, linkedFieldIds, cascaderSourceDataView.fieldMethods);
  }

  private buildByRecursive(rows: IViewRow[], recordMap: IRecordMap, linkedFieldIds: string[], fieldMethods: IFieldMethods): CascaderChildren[] {
    const { fieldIdToParentFieldId, treeNodesMap, groupToTextToSet } = initStorageContainers(linkedFieldIds);
    const treeNodes: CascaderChildren[] = [];
    for (const row of rows) {
      const fieldIdToCellValue = recordMap[row.recordId]!.data;
      const linkedRecordData: ILinkRecordData = reduce(
        fieldIdToCellValue,
        (result, cellValue, fldId) => {
          if(fieldMethods[fldId]) {
            result[fldId] = { text: getTextByCellValue(cellValue, fldId, fieldMethods) };
          }
          return result;
        },
        {} as ILinkRecordData,
      );
      for (const linkedFieldId of linkedFieldIds) {
        if (!linkedRecordData[linkedFieldId]) {
          continue;
        }

        // -------------------------Begin get the node-----------------------------//
        const branch = getBranch(linkedRecordData, linkedFieldId, fieldIdToParentFieldId);
        const branchKey = sha1(branch);
        let node: CascaderChildren = getNode(treeNodesMap, linkedFieldId, branchKey);
        let isNewNode: boolean = false;
        if (!node) {
          isNewNode = true;
          node = {
            text: linkedRecordData[linkedFieldId]!.text,
            linkedFieldId,
            linkedRecordId: row.recordId,
            children: [],
          };
          setNode(treeNodesMap, linkedFieldId, branchKey, node);
        }
        // ------------------------------- End --------------------------------------//
        linkNodeToParentNode(
          { fieldIdToParentFieldId, treeNodesMap, groupToTextToSet, treeNodes },
          linkedFieldId,
          linkedRecordData,
          node,
          isNewNode,
        );
      }
    }
    return treeNodes;
  }
}
