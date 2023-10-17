import { Api, DatasheetApi } from '@apitable/core';

export const getParentNode = (folderId: string) => {
  return Api.getParents(folderId).then(res => {
    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  });
};

export const getChildrenNode = (folderId: string) => {
  return Api.getChildNodeList(folderId).then(res => {
    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  });
};

export const getDatasheetMeta = (datasheetId: string) => {
  return DatasheetApi.fetchDatasheetMeta(datasheetId).then(res => {
    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  });
};
