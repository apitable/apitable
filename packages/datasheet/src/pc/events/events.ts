import { Field, Selectors } from '@apitable/core';
import { store } from 'pc/store';
import { verificationPermission } from './notification_verification';
export interface IReqMap {
  [id: string]: {
    recordIds: string[];
    unitIds: string[];
    recordTitle: string;
    fieldName?: string;
  }[];
}

interface IRemindUnit {
  recordIds: string[];
  fieldIds: string[];
}

const remindUnitRecordsMap = new Map<string, IRemindUnit>();

class RemindAggregation {
  constructor() {
    setInterval(this.commitRemind, 1000);
  }

  commitRemind() {
    if (remindUnitRecordsMap.size) {
      const reqMap: IReqMap = {};
      const state = store.getState();
      for (const key of remindUnitRecordsMap.keys()) {
        const { recordIds = [], fieldIds } = remindUnitRecordsMap.get(key) || {};
        const [isNotify, linkId, nodeId, viewId, unitId] = key.split('-');
        const reqKey = [isNotify, linkId, nodeId, viewId].join('-');
        const snapshot = Selectors.getSnapshot(state, nodeId)!;
        const firstRecordId = recordIds[0];
        const firstFieldId = snapshot!.meta.views[0].columns[0].fieldId;
        const cv = Selectors.getCellValue(state, snapshot, firstRecordId, firstFieldId);
        const primaryText = Field.bindModel(snapshot.meta.fieldMap[firstFieldId]).cellValueToString(cv);

        const { fieldId: firstMemberFieldId }: any = Selectors.getViewById(snapshot, viewId)?.columns.find(({ fieldId }) => {
          return fieldIds?.includes(fieldId);
        }) || {};

        const firstMemberFieldName = firstMemberFieldId && snapshot.meta.fieldMap[firstMemberFieldId]?.name;

        if (reqMap[reqKey]) {
          reqMap[reqKey].push({
            recordIds: recordIds,
            unitIds: [unitId],
            recordTitle: primaryText || '',
            fieldName: firstMemberFieldName
          });
        } else {
          reqMap[reqKey] = [{
            recordIds: recordIds,
            unitIds: [unitId],
            recordTitle: primaryText || '',
            fieldName: firstMemberFieldName
          }];
        }
      }
      // Consume the message first, failure will not resend
      remindUnitRecordsMap.clear();
      for (const item of Object.entries(reqMap)) {
        const [key, unitRecs] = item;
        const [isNotify, linkId, nodeId, viewId] = key.split('-');
        const mirrorId = state.pageParams.datasheetId === nodeId && state.pageParams.mirrorId;
        if(isNotify === '1') {
          verificationPermission({
            isNotify: isNotify === '1',
            nodeId: mirrorId || nodeId,
            viewId,
            unitRecs,
            linkId,
          });
        }
      }
    }
  }

  /**
   * @param {string} id `${isNotify}-${nodeId}-${viewId}-${unitId}`
   * @param {*} recordId
   * @memberof RemindAggregation
   */
  addRemindUnit(id: string, remindUnit: { fieldId: string, recordId: string }) {
    const aggrRemind = remindUnitRecordsMap.get(id);
    if (aggrRemind) {
      aggrRemind.fieldIds = Array.from(new Set([...aggrRemind.fieldIds, remindUnit.fieldId]));
      aggrRemind.recordIds = Array.from(new Set([...aggrRemind.recordIds, remindUnit.recordId]));
    } else {
      remindUnitRecordsMap.set(id, {
        fieldIds: [remindUnit.fieldId],
        recordIds: [remindUnit.recordId]
      });
    }
  }
}
export const remindAggregation = new RemindAggregation();

interface ICreateRemindKeyProps {
  isNotify: boolean;
  linkId: string | undefined;
  datasheetId: string;
  viewId: string;
  unitId: string;
}

export function createRemindKey({ isNotify, linkId, datasheetId, viewId, unitId }: ICreateRemindKeyProps) {
  return `${isNotify ? 1 : 0}-${linkId || ''}-${datasheetId}-${viewId}-${unitId}`;
}
