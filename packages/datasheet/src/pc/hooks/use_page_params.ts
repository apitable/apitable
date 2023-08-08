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

import { StoreActions } from '@apitable/core';
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
const aiIdReg = /\/(ai\w+)/;
export const dashboardReg = /\/(dsb\w+)/;
export const resourceReg = /\/((dsb|dst)\w+)/;
export const mirrorIdReg = /\/((mir)\w+)/;
export const embedIdReg = /\/(emb\w{8,})/;

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
  const embedId = getRegResult(path, embedIdReg);
  const aiId = getRegResult(path, aiIdReg);
  const nodeId = mirrorId || datasheetId || folderId || dashboardId || formId || aiId;

  return {
    datasheetId, viewId, shareId, recordId,
    fieldId, folderId, formId, templateId, categoryId, memberId,
    widgetId, dashboardId,
    resourceId, nodeId, mirrorId, embedId, aiId,
  };
};

export const usePageParams = () => {
  const router = useRouter();
  useEffect(() => {
    const path = router.asPath;
    const action = StoreActions.setPageParams({
      ...getPageParams(path),
    });
    dispatch(action);
  }, [router]);
};

