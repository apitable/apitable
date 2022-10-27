import { ConfigConstant, IDPrefix } from '@apitable/core';
import { isJSON } from 'class-validator';
import { NodeTypeEnum } from 'shared/enums/node.enum';

/**
 * 从url解析数表id
 * @param url 地址
 */
export const parseDstIdFromUrl = (url: string) => {
  let datasheetId;
  url.split('/').forEach(item => {
    if (item.startsWith(IDPrefix.Table)) {
      datasheetId = item;
    }
  });
  return datasheetId;
};

/**
 * 从url 解析spaceId
 * @param url
 */
export const parseSpaceIdFromUrl = (url: string) => {
  let spaceId;
  url.split('/').forEach(item => {
    if (item.startsWith(IDPrefix.SPACE)) {
      spaceId = item;
    }
  });
  return spaceId;
};

export const getApiVersionFromUrl = (url: string) => {
  const urlArr = url.split('/');
  let version = 'v1';
  urlArr.map((value, index) => {
    if (value === 'fusion') {
      version = urlArr[index + 1];
    }
    if (value === 'nest') {
      version = urlArr[index + 1];
    }
  });
  return version;
};

export const isNull = value => {
  return value === 'null' || value === 'undefined' || value === '' || value === '{}';
};

export const stringToArray = value => {
  if (isNull(value)) return null;
  const valueArray = Array.isArray(value) ? value : value.split(',');
  return valueArray.filter(v => !isNull(v));
};

export const objStringToArray = (value: string) => {
  if (isNull(value)) return null;
  const valueArray = Array.isArray(value) ? (value as any[]) : value.replace(/},/g, '}|').split('|');
  try {
    return valueArray.reduce<any[]>((pre, cur) => {
      if (isNull(cur)) return pre;
      if (isJSON(cur)) {
        pre.push(JSON.parse(cur));
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);
  } catch (e) {
    return null;
  }
};

export const getAPINodeType = (nodeType: ConfigConstant.NodeType) => {
  const NODE_TYPE_MAP = {
    [ConfigConstant.NodeType.FOLDER]: NodeTypeEnum.Folder,
    [ConfigConstant.NodeType.DATASHEET]: NodeTypeEnum.Datasheet,
    [ConfigConstant.NodeType.FORM]: NodeTypeEnum.Form,
    [ConfigConstant.NodeType.DASHBOARD]: NodeTypeEnum.Dashboard,
    [ConfigConstant.NodeType.MIRROR]: NodeTypeEnum.Mirror,
  };
  return NODE_TYPE_MAP[nodeType] || 'ERROR NODE TYPE';
};

const EFFECTIVE_OPTION_ID_LENGTH = 13;
export const isOptionId = (optionId: string) => {
  return optionId && optionId.startsWith('opt') && optionId.length === EFFECTIVE_OPTION_ID_LENGTH;
};

