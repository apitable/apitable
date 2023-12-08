import { useSelector } from 'react-redux';
import { IReduxState, IServerFormPack, Selectors } from '@apitable/core';
import { fetchFormPack } from '@apitable/core/dist/modules/database/api/form_api';
import { getDatasheetId } from 'pc/components/automation/controller/hooks/get_datasheet_id';
import { getFormId } from 'pc/components/automation/controller/hooks/get_form_id';
import { getAllFieldsByDstIdFp } from '../../../robot/hooks';
import { IRobotTrigger } from '../../../robot/interface';

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

export const useTriggerDatasheetId = (activeDatasheetId?: string): string | undefined => {

  const automationTrigger = useAtomValue(automationTriggerAtom);
  const automationState = useAtomValue(automationStateAtom);
  const data = useMemo(() => ({
    formId: getFormId(automationTrigger),
    datasheetId: getDatasheetId(automationTrigger)
  }), [automationTrigger]);

  const formMeta = useAtomValue(loadableFormMeta);

  const dispatch = useAppDispatch();
  useEffect(() => {
    // @ts-ignore
    const dId = formMeta?.data?.sourceInfo?.datasheetId;
    if (dId) {
      dispatch(StoreActions.fetchDatasheet(dId));
    }

  }, [dispatch, formMeta]);

  if (data.datasheetId) {
    return data.datasheetId;
  }

  if (automationState?.scenario === AutomationScenario.datasheet) {
    return activeDatasheetId;
  }
  // @ts-ignore
  return formMeta?.data?.sourceInfo?.datasheetId;
};

export const useAutomationRobotFields = (dstId: string) => {
  const fieldPermissionMap = useSelector((state: IReduxState) => {
    return Selectors.getFieldPermissionMap(state, dstId);
  });
  const fields = useAllFieldsByDstId(dstId);
  return { fields, fieldPermissionMap };
};

export const useAutomationFieldInfo = (triggers: IRobotTrigger[], dstIds: IFetchedDatasheet[]) => {
  const fieldPermissionMap = useSelector((state: IReduxState) => {
    return triggers.map((trigger, index) => ({
      fields: getAllFieldsByDstIdFp(state, dstIds[index]),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state, dstIds[index])
    }));
  });

  return fieldPermissionMap;
};
