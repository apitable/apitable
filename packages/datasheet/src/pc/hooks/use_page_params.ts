import { StoreActions } from '@vikadata/core';
import { useRouter } from 'next/router';
import { dispatch } from 'pc/worker/store';
import { useEffect } from 'react';

export const spaceIdReg = /\/(spc\w+)/;
export const datasheetIdReg = /\/(dst\w+)/;
const viewIdReg = /\/(viw\w+)/;
export const shareIdReg = /\/(shr\w+)/;
const recordIdReg = /\/(rec\w+)/;
const fieldIdReg = /\/(fld\w+)/;
export const folderIdReg = /\/(fod\w+)/;
export const formIdReg = /\/(fom\w+)/;
const templateIdReg = /\/(tpl\w+)/;
const categoryIdReg = /\/(tpc\w+)/;
const addressReg = /org\/(\w+)/;
const widgetIdReg = /\/(wdt\w+)/;
export const dashboardReg = /\/(dsb\w+)/;
export const resourceReg = /\/((dsb|dst)\w+)/;
export const mirrorIdReg = /\/((mir)\w+)/;

export const getRegResult = (path: string, reg: RegExp) => {
  const r = path.match(reg);
  return r ? r[1] : undefined;
};

export const getPageParams = (path: string) => {
  const datasheetId = getRegResult(path, datasheetIdReg);
  const viewId = getRegResult(path, viewIdReg);
  const shareId = getRegResult(path, shareIdReg);
  const recordId = getRegResult(path, recordIdReg);
  const fieldId = getRegResult(path, fieldIdReg);
  const folderId = getRegResult(path, folderIdReg);
  const formId = getRegResult(path, formIdReg);
  const templateId = getRegResult(path, templateIdReg);
  const categoryId = getRegResult(path, categoryIdReg);
  const memberId = getRegResult(path, addressReg);
  const widgetId = getRegResult(path, widgetIdReg);
  const dashboardId = getRegResult(path, dashboardReg);
  const resourceId = getRegResult(path, resourceReg);
  const mirrorId = getRegResult(path, mirrorIdReg);
  const nodeId = mirrorId || datasheetId || folderId || dashboardId || formId;

  return {
    datasheetId, viewId, shareId, recordId,
    fieldId, folderId, formId, templateId, categoryId, memberId,
    widgetId, dashboardId,
    resourceId, nodeId, mirrorId,
  };
};

export const usePageParams = () => {
  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const action = StoreActions.setPageParams({
      ...getPageParams(path)
    });
    dispatch(action);
  }, [router]);
};

