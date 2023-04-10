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

import { ILinkRecordData } from '../models/link.record.data';
import { CascaderChildren } from '../models/cascader.children';
import sha1 from 'sha1';

export
interface ITreeNodeMap {
  [_: string]: { [_: string]: CascaderChildren };
}

export function getBranch(linkRecordData: ILinkRecordData, linkedFieldId: string, fieldIdToParentFieldId: { [p: string]: string }) {
  let branch = linkRecordData[linkedFieldId]!.text;
  let parentNodePosition = fieldIdToParentFieldId[linkedFieldId];
  while (parentNodePosition) {
    branch += linkRecordData[parentNodePosition!] ? linkRecordData[parentNodePosition!]!.text : '';
    parentNodePosition = fieldIdToParentFieldId[parentNodePosition];
  }
  return branch;
}

export function getValueByGroupAndKey(
  groupToMap: { [_: string]: { [_: string]: Set<CascaderChildren> } },
  group: string,
  key: string,
): Set<CascaderChildren> {
  groupToMap[group] = groupToMap[group] || {};
  groupToMap[group]![key] = groupToMap[group]![key] || new Set();
  return groupToMap[group]![key]!;
}

export function getNode(nodesMap: ITreeNodeMap, group: string, key: string): CascaderChildren {
  return nodesMap[group]![key]!;
}

export function setNode(nodesMap: ITreeNodeMap, group: string, key: string, value: CascaderChildren) {
  nodesMap[group]![key] = value;
}

export function initStorageContainers(linkedFieldIds: string[]) {
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

export function linkNodeToParentNode(
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
    const branch = getBranch(linkRecordData, parentFieldId, fieldIdToParentFieldId);
    const branchKey = sha1(branch);
    const parentNode: CascaderChildren = getNode(treeNodesMap, parentFieldId, branchKey);
    // the link exist, save that node has more than one parent node
    const parentSet: Set<CascaderChildren> = getValueByGroupAndKey(groupToTextToSet, linkedFieldId, node.linkedRecordId);
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