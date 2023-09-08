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

import { ComputeRefManager, getComputeRefManager, FieldType, Selectors } from '@apitable/core';
import { store } from 'pc/store';

type Group = 'Link' | 'Dst' | 'Formula' | 'Lookup' | 'BaseField';
type Node = {
  id: string;
  label: string;
  group: Group;
};

type Edge = {
  from: string;
  to: string;
  label?: string;
  dashes?: boolean;
};

/**
 * Take the specified datasheet as a starting point and obtain its network of associated reference relations.
 * @param dstId datasheet id
 */
export const getDstNetworkData = (dstId?: string) => {
  const state = store.getState();
  const data: {
    nodes: Node[];
    edges: Edge[];
  } = {
    nodes: [],
    edges: [],
  };
  const dstIds = new Set<string>();
  const fieldIds = new Set<string>();
  // Table-to-Table Relationships
  const dstLinkIds = new Set<string>();

  let computeRefManager = getComputeRefManager(state);
  if (dstId) {
    computeRefManager = new ComputeRefManager();
    const currSnapshot = Selectors.getSnapshot(state, dstId);
    const fieldMap = currSnapshot?.meta.fieldMap;
    if (!fieldMap) return data;
    computeRefManager.computeRefMap(fieldMap, dstId, state);
  }

  // Collect all nodes
  computeRefManager.reRefMap.forEach((item, key) => {
    const [selfDstId] = key.split('-');
    dstIds.add(selfDstId);
    fieldIds.add(key);
    item.forEach((key) => {
      const [dstId] = key.split('-');
      dstIds.add(dstId);
      fieldIds.add(key);
      if (selfDstId !== dstId) {
        dstLinkIds.add(`${selfDstId}-${dstId}`);
      }
    });
  });

  // Collate all number datasheet nodes
  dstIds.forEach((dstId) => {
    const datasheet = Selectors.getDatasheet(state, dstId);
    if (datasheet) {
      data.nodes.push({
        id: dstId,
        label: `${datasheet.name}(${datasheet.id})`,
        group: 'Dst',
      });
    }
  });

  // Collate all field nodes
  fieldIds.forEach((key) => {
    const [dstId, fieldId] = key.split('-');
    const field = Selectors.getField(state, fieldId, dstId);
    let group: Group = 'BaseField';
    switch (field.type) {
      case FieldType.Link:
        data.edges.push({
          from: key,
          to: `${field.property.foreignDatasheetId}-${field.property.brotherFieldId}`,
          dashes: true,
        });
        group = 'Link';
        break;
      case FieldType.Formula:
        group = 'Formula';
        break;
      case FieldType.LookUp:
        group = 'Lookup';
        break;
      default:
        group = 'BaseField';
    }
    data.nodes.push({
      id: key,
      group,
      label: `${field.name}(${field.id})`,
    });
  });

  fieldIds.forEach((key) => {
    const [dstId] = key.split('-');
    data.edges.push({
      from: key,
      to: dstId,
      dashes: true,
      // label?: key,
    });
  });

  dstLinkIds.forEach((key) => {
    const [a, b] = key.split('-');
    data.edges.push({
      from: a,
      to: b,
      // label?: key,
    });
  });

  // Field dependencies
  computeRefManager.reRefMap.forEach((item, key) => {
    item.forEach((otherKey) => {
      data.edges.push({
        from: key,
        to: otherKey,
        // label?: key,
      });
    });
  });
  return data;
};
