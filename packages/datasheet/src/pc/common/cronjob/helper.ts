import { store } from 'pc/store';
import { ComputeRefManager, getComputeRefManager, FieldType, Selectors } from '@vikadata/core';

type Group = 'Link' | 'Dst' | 'Formula' | 'Lookup' | 'BaseField';
type Node = {
  id: string;
  label: string;
  group: Group;
};

type Edge = {
  from: string,
  to: string,
  label?: string,
  dashes?: boolean,
};

/**
 * 以指定数表为起点，获取其关联引用关系网络。
 * @param dstId 数表id
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
  // 表与表关联关系
  const dstLinkIds = new Set<string>();

  let computeRefManager = getComputeRefManager(state);
  if (dstId) {
    computeRefManager = new ComputeRefManager();
    const currSnapshot = Selectors.getSnapshot(state, dstId);
    const fieldMap = currSnapshot?.meta.fieldMap;
    if (!fieldMap) return data;
    computeRefManager.computeRefMap(fieldMap, dstId, state);
  }

  // 收集所有节点
  computeRefManager.reRefMap.forEach((item, key) => {
    const [selfDstId] = key.split('-');
    dstIds.add(selfDstId);
    fieldIds.add(key);
    item.forEach(key => {
      const [dstId] = key.split('-');
      dstIds.add(dstId);
      fieldIds.add(key);
      if (selfDstId !== dstId) {
        dstLinkIds.add(`${selfDstId}-${dstId}`);
      }
    });
  });

  // 整理所有的数表节点
  dstIds.forEach(dstId => {
    const datasheet = Selectors.getDatasheet(state, dstId);
    if (datasheet) {
      data.nodes.push({
        id: dstId,
        label: `${datasheet.name}(${datasheet.id})`,
        group: 'Dst',
      });
    }
  });

  // 整理所有的字段节点 
  fieldIds.forEach(key => {
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

  // 处理表内边的关系
  fieldIds.forEach(key => {
    const [dstId] = key.split('-');
    data.edges.push({
      from: key,
      to: dstId,
      dashes: true,
      // label?: key,
    });
  });

  // 表-表关联关系
  dstLinkIds.forEach(key => {
    const [a, b] = key.split('-');
    data.edges.push({
      from: a,
      to: b,
      // label?: key,
    });
  });

  // 字段依赖关系
  computeRefManager.reRefMap.forEach((item, key) => {
    item.forEach(otherKey => {
      data.edges.push({
        from: key,
        to: otherKey,
        // label?: key,
      });
    });
  });
  return data;
};