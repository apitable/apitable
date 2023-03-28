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

import { databus, IRecordMap, IViewRow } from '@apitable/core';
import { IAuthHeader } from 'shared/interfaces';
import { CascaderLinkedField } from '../models/cascader.link.field';
import { CascaderVo } from '../vos/cascader.vo';
import { CascaderDatabusService, CascaderSourceDataView } from './cascader.databus.service';
import { groupBy, indexOf, slice } from 'lodash';
import { CascaderChildren } from '../models/cascader.children';
import sha1 from 'sha1';
import { getText, IFieldMethods } from '../utils/cell.value.to.string';
import { Injectable } from '@nestjs/common';

type TreeNode = Omit<CascaderChildren, 'children'> & { children: Map<string, TreeNode> };

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
      if (fieldMap[column.fieldId]) {
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
    const trees = new Map<string, any>();
    for (const row of rows) {
      const text = getText(recordMap[row.recordId]!, linkedFieldIds[0]!, fieldMethods);
      // There is no straight skip in the first column
      if (!text) {
        continue;
      }
      const textSha1 = sha1(text);
      // The child nodes have been traversed.
      if (trees.has(textSha1)) {
        continue;
      }
      const children = this.findChildren(
        {
          text,
          linkedRecordId: row.recordId,
          linkedFieldId: linkedFieldIds[0]!,
          children: new Map<string, TreeNode>(),
        },
        rows,
        recordMap,
        text,
        linkedFieldIds[0]!,
        linkedFieldIds[1]!,
        linkedFieldIds,
        fieldMethods,
      );
      trees.set(textSha1, children);
    }
    return this.formatByRecursive(trees);
  }

  private findChildren(
    treeSelect: TreeNode,
    rows: IViewRow[],
    recordMap: IRecordMap,
    parentValue: string,
    parentLinkedFieldId: string,
    linkedFieldId: string | undefined,
    linkedFieldIds: string[],
    fieldMethods: IFieldMethods,
  ): TreeNode {
    if (!linkedFieldId) {
      return treeSelect;
    }
    for (const row of rows) {
      const text = getText(recordMap[row.recordId]!, linkedFieldId, fieldMethods);
      const treeNode = {
        text,
        linkedRecordId: row.recordId,
        linkedFieldId,
        children: new Map<string, TreeNode>(),
      };
      if (getText(recordMap[row.recordId]!, parentLinkedFieldId, fieldMethods) === parentValue) {
        if (!text) {
          continue;
        }
        const textSha1 = sha1(text);
        if (treeSelect.children.has(textSha1)) {
          continue;
        }
        const childFieldId = linkedFieldIds[indexOf(linkedFieldIds, linkedFieldId) + 1];
        treeSelect.children.set(
          textSha1,
          this.findChildren(treeNode, rows, recordMap, text, linkedFieldId, childFieldId, linkedFieldIds, fieldMethods),
        );
      }
    }
    return treeSelect;
  }

  private formatByRecursive(trees: Map<string, TreeNode>): CascaderChildren[] {
    const treeSelect: CascaderChildren[] = [];
    trees.forEach(value => {
      const tree = { ...value, children: [] };
      treeSelect.push(this.formatChildren(tree, value));
    });
    return treeSelect;
  }

  private formatChildren(tree: CascaderChildren, treeSelect: TreeNode): CascaderChildren {
    treeSelect.children.forEach(value => {
      const childTree = { ...value, children: [] };
      tree.children.push(this.formatChildren(childTree, value));
    });
    return tree;
  }
}
