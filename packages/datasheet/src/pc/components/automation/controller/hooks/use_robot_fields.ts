import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState, IServerFormPack, Selectors, StoreActions } from '@apitable/core';
import { fetchFormPack } from '@apitable/core/dist/modules/database/api/form_api';
import { getDatasheetId } from 'pc/components/automation/controller/hooks/get_datasheet_id';
import { getFormId } from 'pc/components/automation/controller/hooks/get_form_id';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { getAllFieldsByDstIdFp, useAllFieldsByDstId } from '../../../robot/hooks';
import { AutomationScenario, IRobotTrigger } from '../../../robot/interface';
import { automationStateAtom, automationTriggerAtom, loadableFormMeta } from '../index';

export const getRelativedId = (automationTrigger?: Pick<IRobotTrigger, 'input'>) => {
  if (!automationTrigger) {
    return null;
  }
  const formId = getFormId(automationTrigger);
  const datasheetId = getDatasheetId(automationTrigger);
  return formId ?? datasheetId;
};

export type IFetchedDatasheet = string | undefined;

export const getTriggerDstId = (relatedResourceId: string): Promise<IFetchedDatasheet> => {
  if (relatedResourceId?.startsWith('dst')) {
    return new Promise((r) => r(relatedResourceId));
  }

  const formId = relatedResourceId;
  if (formId && formId.startsWith('fom')) {
    return fetchFormPack(String(formId)).then(res => res?.data?.data ?? {} as IServerFormPack).then(res => res?.sourceInfo?.datasheetId);
  }

  return new Promise<IFetchedDatasheet>(r => r(undefined));
};

export const getTriggerDatasheetId: (triggers: IRobotTrigger[]) => Promise<IFetchedDatasheet[]> = async (triggers: IRobotTrigger[]) => {
  const arr = triggers.map(automationTrigger => automationTrigger.relatedResourceId).map(item=> getTriggerDstId(item ?? ''));
  const list = await Promise.all(arr);
  return list;
};

export const getTriggerDatasheetId2: (triggers: string[]) => Promise<IFetchedDatasheet[]> = async (triggers: string[]) => {
  const arr = triggers.map(item=> getTriggerDstId(item ?? ''));
  const list = await Promise.all(arr);
  return list;
};

export const useAutomationFieldInfo = (triggers: string[]) => {
  const fieldPermissionMap = useSelector((state: IReduxState) => {
    return triggers.map((trigger) => ({
      fields: getAllFieldsByDstIdFp(state, trigger),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state, trigger)
    }));
  });

  return fieldPermissionMap;
};
