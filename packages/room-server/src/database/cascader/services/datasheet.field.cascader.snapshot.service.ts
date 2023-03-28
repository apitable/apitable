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
import { Injectable } from '@nestjs/common';
import { CascaderSnapshotQueryDto } from '../dtos/cascader.snapshot.query.dto';
import { CascaderDatabusService } from './cascader.databus.service';
import { CascaderSnapshotVo } from '../vos/cascader.snapshot.vo';
import { DatasheetCascaderFieldRepository } from '../repositories/datasheet.cascader.field.repository';
import { DatasheetCascaderFieldEntity } from '../entities/datasheet.cascader.field.entity';
import { CascaderChildren } from '../models/cascader.children';
import { ILinkRecordData } from '../models/link.record.data';
import sha1 from 'sha1';
import { IAuthHeader } from 'shared/interfaces';
import { reduce } from 'lodash';
import { IRecordMap, IViewRow } from '@apitable/core';
import { getTextByCellValue, IFieldMethods } from '../utils/cell.value.to.string';
import { CascaderSnapshotUpdateDto } from '../dtos/cascader.snapshot.update.dto';
import { CascaderSnapshotDeleteDto } from '../dtos/cascader.snapshot.delete.dto';

@Injectable()
export class DatasheetFieldCascaderSnapshotService {
  constructor(
    private readonly datasheetCascaderFieldRepository: DatasheetCascaderFieldRepository,
    private readonly cascaderDataBusService: CascaderDatabusService,
  ) {}

  public async getCascaderSnapshot(dto: CascaderSnapshotQueryDto): Promise<CascaderSnapshotVo> {
    const { spaceId, datasheetId, fieldId, linkedFieldIds } = dto;
    const cascaderData: DatasheetCascaderFieldEntity[] = await this.datasheetCascaderFieldRepository.selectRecordData(spaceId, datasheetId, fieldId,);
    if (!linkedFieldIds || linkedFieldIds.length > 100) { // Prevents DoS.
      return {
        treeSelectNodes: [],
      };
    }
    const treeNodes = this.flatDataToTree(linkedFieldIds, cascaderData);
    return {
      treeSelectNodes: treeNodes,
    };
  }

  public async updateCascaderSnapshot(auth: IAuthHeader, userId: string, dto: CascaderSnapshotUpdateDto): Promise<boolean> {
    const { spaceId, datasheetId, fieldId, linkedDatasheetId, linkedViewId } = dto;
    const cascaderSourceDataDatasheet = await this.cascaderDataBusService.getDatasheet(linkedDatasheetId);
    if (cascaderSourceDataDatasheet === null) {
      throw new Error('datasheet no exist');
    }
    const cascaderSourceDataView = await this.cascaderDataBusService.getView(cascaderSourceDataDatasheet, {
      auth,
      viewId: linkedViewId,
    });
    if (cascaderSourceDataView === null) {
      throw new Error('view no exist');
    }
    const { recordMap, viewRows } = {
      recordMap: cascaderSourceDataDatasheet.snapshot.recordMap,
      viewRows: cascaderSourceDataView.view.rows,
    };
    const cascaderSnapshot: DatasheetCascaderFieldEntity[] = this.buildCascaderSnapshot(
      recordMap,
      viewRows,
      cascaderSourceDataView.fieldMethods,
      userId,
      spaceId,
      datasheetId,
      fieldId,
    );
    await this.datasheetCascaderFieldRepository.delete({
      spaceId,
      datasheetId,
      fieldId,
    });
    await this.datasheetCascaderFieldRepository.save(cascaderSnapshot);
    return true;
  }

  public async deleteCascaderSnapshot(dto: CascaderSnapshotDeleteDto): Promise<boolean> {
    const { spaceId, datasheetId, fieldId } = dto;
    await this.datasheetCascaderFieldRepository.delete({
      spaceId,
      datasheetId,
      fieldId,
    });
    return true;
  }

  private buildCascaderSnapshot(
    recordMap: IRecordMap,
    viewRows: IViewRow[],
    fieldMethods: IFieldMethods,
    userId: string,
    spaceId: string,
    datasheetId: string,
    fieldId: string,
  ): DatasheetCascaderFieldEntity[] {
    return viewRows.reduce((result, viewRow) => {
      const recordId = viewRow.recordId;
      const fieldIdToCellValue = recordMap[recordId]!.data;
      const linkedRecordData: ILinkRecordData = reduce(
        fieldIdToCellValue,
        (result, cellValue, fldId) => {
          result[fldId] = { text: getTextByCellValue(cellValue, fldId, fieldMethods) };
          return result;
        },
        {} as ILinkRecordData,
      );
      const entity = this.datasheetCascaderFieldRepository.create({
        spaceId,
        datasheetId,
        fieldId,
        linkedRecordData,
        linkedRecordId: recordId,
        createdBy: userId,
      });
      result.push(entity);
      return result;
    }, [] as DatasheetCascaderFieldEntity[]);
  }

  private initStorageContainers(linkedFieldIds: string[]) {
    // fieldIdToParentFieldId
    const fieldIdToParentFieldId: { [index: string]: string } = {};
    // fieldIdToTextToNode
    const treeNodesMap: ITreeNodeMap = {};
    // fieldIdToRecordIdToSet
    const groupToTextToSet: { [index: string]: { [index: string]: Set<CascaderChildren> } } = {};
    for (let i = 0; i < linkedFieldIds.length; i++) {
      const linkedFieldId: string = linkedFieldIds[i]!;
      if (i == 0) {
        fieldIdToParentFieldId[linkedFieldId] = '';
      } else {
        fieldIdToParentFieldId[linkedFieldId] = linkedFieldIds[i - 1]!;
      }
      treeNodesMap[linkedFieldId] = {};
    }
    return {
      fieldIdToParentFieldId,
      treeNodesMap,
      groupToTextToSet,
    };
  }

  /**
   *           ｜ fld41 ｜ fld24
   *  rec1  ｜ level-1-1 ｜level-2-1
   *  rec2  ｜ level-1-1 ｜ level-2-2
   *  fieldIdToParentFieldId: the field's parent field, such as: { fld41: '', fld24: 'fld41' }
   *  treeNodesMap: the text's node, such as:
   *  {
   *    fld41: { 'level-1-1': { text: 'level-1-1', children: [ { text: 'level-2-1', ...}, { text: 'level-2-2', ... } ], ... } }
   *    fld24: { 'level-2-1': { text: 'level-2-1', ... }, 'level-2-2': { text: 'level-2-2', ... } }
   *  }
   *  groupToTextToSet：
   *  {
   *      fld24: {
   *      'rec1' : { { text: 'level-1-1', children: [ { text: 'level-2-1', ...}, { text: 'level-2-2', ... } ], ... }, ...},
   *      'rec2' : { { text: 'level-1-1', children: [ { text: 'level-2-1', ...}, { text: 'level-2-2', ... } ], ... }, ...}
   *      }
   *  }
   *
   *  ps: Depth-First traversing to build tree.
   *  Breadth-First traversing to build tree see datasheet.field.cascader.service.ts#buildByRecursive.
   */
  private flatDataToTree(linkedFieldIds: string[], rows: DatasheetCascaderFieldEntity[]): CascaderChildren[] {
    const { fieldIdToParentFieldId, treeNodesMap, groupToTextToSet } = this.initStorageContainers(linkedFieldIds);
    const treeNodes: CascaderChildren[] = [];
    // transform flat data structure to tree.
    for (const row of rows) {
      const linkRecordData: ILinkRecordData = row.linkedRecordData;
      for (const linkedFieldId of linkedFieldIds) {
        if (!linkRecordData[linkedFieldId]) {
          continue;
        }
        // -------------------------Begin get the node-----------------------------//
        let node: CascaderChildren = this.getNode(treeNodesMap, linkedFieldId, linkRecordData[linkedFieldId]!.text);
        let isNewNode: boolean = false;
        if (!node) {
          isNewNode = true;
          node = {
            text: linkRecordData[linkedFieldId]!.text,
            linkedFieldId,
            linkedRecordId: row.linkedRecordId,
            children: [],
          };
          this.setNode(treeNodesMap, linkedFieldId, node.text, node);
        }
        // ------------------------------- End --------------------------------------//
        this.linkNodeToParentNode(
          { fieldIdToParentFieldId, treeNodesMap, groupToTextToSet, treeNodes },
          linkedFieldId,
          linkRecordData,
          node,
          isNewNode,
        );
      }
    }
    return treeNodes;
  }

  private linkNodeToParentNode(
    context: {
      fieldIdToParentFieldId: { [p: string]: string };
      treeNodesMap: ITreeNodeMap;
      groupToTextToSet: { [p: string]: { [p: string]: Set<CascaderChildren> } };
      treeNodes: CascaderChildren[];
    },
    linkedFieldId: string,
    linkRecordData: ILinkRecordData,
    node: CascaderChildren,
    isNewNode: boolean,
  ) {
    const { fieldIdToParentFieldId, treeNodesMap, groupToTextToSet, treeNodes } = context;
    // parent node
    const parentFieldId: string = fieldIdToParentFieldId[linkedFieldId]!;
    if (!!parentFieldId) {
      // -----------------Begin link node and parent node---------------------//
      if (!linkRecordData[parentFieldId]) {
        return;
      }
      const parentNode: CascaderChildren = this.getNode(treeNodesMap, parentFieldId, linkRecordData[parentFieldId]!.text);
      // the link exist, save that node has more than one parent node
      const parentSet: Set<CascaderChildren> = this.getValueByGroupAndKey(groupToTextToSet, linkedFieldId, node.linkedRecordId);
      if (!parentSet.has(parentNode)) {
        // set link
        parentNode.children.push(node);
        parentSet.add(parentNode);
      }
      // ----------------End link node and parent node------------------------//
    } else {
      // root node
      if (isNewNode) {
        treeNodes.push(node);
      }
    }
  }

  private getValueByGroupAndKey(
    groupToMap: { [_: string]: { [_: string]: Set<CascaderChildren> } },
    group: string,
    key: string,
  ): Set<CascaderChildren> {
    groupToMap[group] = groupToMap[group] || {};
    groupToMap[group]![key] = groupToMap[group]![key] || new Set();
    return groupToMap[group]![key]!;
  }

  private getNode(nodesMap: ITreeNodeMap, group: string, key: string): CascaderChildren {
    const keySha1 = sha1(key);
    return nodesMap[group]![keySha1]!;
  }

  private setNode(nodesMap: ITreeNodeMap, group: string, key: string, value: CascaderChildren) {
    const keySha1 = sha1(key);
    nodesMap[group]![keySha1] = value;
  }
}

interface ITreeNodeMap {
  [_: string]: { [_: string]: CascaderChildren };
}
