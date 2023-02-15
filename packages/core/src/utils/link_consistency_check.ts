import { IReduxState } from 'exports/store';
import { getDatasheet, getMirror } from 'exports/store/selectors';
import { FieldType, ILinkFieldProperty, ILinkIds } from 'types';

export type ILinkConsistencyError = {
  mainDstId: string;
  /**
   * dstId -> recordId:fieldId -> set of missing recordIds
   */
  missingRecords: Map<string, Map<string, Set<string>>>;
};

export function checkLinkConsistency(state: IReduxState): ILinkConsistencyError | undefined {
  const datasheet = getDatasheet(state);
  if (!datasheet || datasheet.isPartOfData) {
    return;
  }

  const { snapshot, id: mainDstId } = datasheet;

  // the check of data consistency
  // datasheet is the only object that should be attention
  // if if all the permission of datasheet is ok, no need to check more
  if (!datasheet.permissions?.editable) {
    // when the permission of datasheet is not ok, then check other factors
    if (!state.pageParams.mirrorId) {
      return;
    }

    const mirror = getMirror(state, state.pageParams.mirrorId);

    if (mirror?.sourceInfo.datasheetId !== mainDstId) {
      return;
    }

    // mirror's editable permission can go through the original datasheet's permission
    if (!mirror?.permissions.editable) {
      return;
    }
  }

  const { recordMap } = snapshot;
  const fieldMap = snapshot.meta.fieldMap;

  const linkFieldIds: string[] = [];
  const linkedDstIds: Set<string> = new Set();
  const selfLinkingFieldIds: Set<string> = new Set();
  for (const fieldId in fieldMap) {
    if (fieldMap[fieldId]!.type === FieldType.Link && !selfLinkingFieldIds.has(fieldId)) {
      const prop = fieldMap[fieldId]!.property as ILinkFieldProperty;
      if (prop.foreignDatasheetId === mainDstId) {
        selfLinkingFieldIds.add(fieldId);
      }
      if (prop.brotherFieldId) {
        linkFieldIds.push(fieldId);
        linkedDstIds.add(prop.foreignDatasheetId);
      }
    }
  }

  // no valid link fields, don't check consistency
  if (!linkFieldIds.length) {
    return;
  }

  // Only when all linked datasheets are fully loaded then link consistency is checked.
  for (const dstId of linkedDstIds) {
    const foreignDst = getDatasheet(state, dstId);
    if (!foreignDst) {
      return;
    }

    if (foreignDst.isPartOfData) {
      return;
    }

    if (!foreignDst.permissions?.editable) {
      return;
    }
  }

  const missingRecords: Map<string, Map<string, Set<string>>> = new Map();

  const addMissingRecord = (dstId: string, recordId: string, fieldId: string, missingRecordId: string) => {
    let data = missingRecords.get(dstId);
    if (!data) {
      data = new Map();
      missingRecords.set(dstId, data);
    }
    const cellId = recordId + ':' + fieldId;
    let recordIds = data.get(cellId);
    if (!recordIds) {
      recordIds = new Set();
      data.set(cellId, recordIds);
    }
    recordIds.add(missingRecordId);
  };

  // Check all link fields
  for (const fieldId of linkFieldIds) {
    const { foreignDatasheetId, brotherFieldId } = fieldMap[fieldId]!.property as ILinkFieldProperty;
    const {
      snapshot: { recordMap: foreignRecordMap },
    } = getDatasheet(state, foreignDatasheetId)!;

    // check recordIds that are missing in link cells in foreign datasheet
    for (const recordId in recordMap) {
      const record = recordMap[recordId]!;
      const cellValue = record.data[fieldId] as ILinkIds | undefined;
      if (!cellValue) {
        continue;
      }
      for (const linkedRecordId of cellValue) {
        if (!(foreignRecordMap[linkedRecordId]?.data[brotherFieldId!] as ILinkIds | undefined)?.includes(recordId)) {
          addMissingRecord(foreignDatasheetId, linkedRecordId, brotherFieldId!, recordId);
        }
      }
    }

    // check recordIds that are missing in link cells in main datasheet
    for (const foreignRecordId in foreignRecordMap) {
      const foreignRecord = foreignRecordMap[foreignRecordId]!;
      const foreignCellValue = foreignRecord.data[brotherFieldId!] as ILinkIds | undefined;
      if (!foreignCellValue) {
        continue;
      }

      for (const recordId of foreignCellValue) {
        if (!(recordMap[recordId]?.data[fieldId] as ILinkIds | undefined)?.includes(foreignRecordId)) {
          addMissingRecord(mainDstId, recordId, fieldId, foreignRecordId);
        }
      }
    }
  }

  return missingRecords.size ? { mainDstId, missingRecords } : undefined;
}
