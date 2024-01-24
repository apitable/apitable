import { CollaCommandName } from 'commands/enum';
import { IResourceOpsCollect } from 'command_manager';
import { IJOTAction, OTActionName } from 'engine/ot';
import { IReduxState } from 'exports/store/interfaces';
import { getDatasheet } from 'modules/database/store/selectors/resource/datasheet/base';
import { getMirror } from 'modules/database/store/selectors/resource/mirror';
import { ResourceType } from 'types';
import { FieldType, ILinkFieldProperty, ILinkIds } from 'types/field_types';

export type ILinkConsistencyError = {
  mainDstId: string;
  mainDstName: string;
  /**
   * dstId -> recordId:fieldId -> set of missing and/or redundant recordIds
   */
  errorRecordIds: Map<string, Map<string, { missing?: Set<string>; redundant?: Set<string> }>>;
};

export function checkLinkConsistency(state: IReduxState, _loadedForeignDstId: string): ILinkConsistencyError | undefined {
  const datasheet = getDatasheet(state);
  if (!datasheet || datasheet.isPartOfData) {
    return;
  }

  const { snapshot, id: mainDstId, name: mainDstName } = datasheet;

  // the check of data consistency
  // datasheet is the only object that should be attention
  // if all the permission of datasheet is ok, no need to check more
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

  /** does not include self-linking fields */
  const linkFieldIds: string[] = [];
  const linkedForeignDstIds: Set<string> = new Set();
  for (const fieldId in fieldMap) {
    if (fieldMap[fieldId]!.type === FieldType.Link) {
      const prop = fieldMap[fieldId]!.property as ILinkFieldProperty;
      if (prop.foreignDatasheetId !== mainDstId && prop.brotherFieldId) {
        linkFieldIds.push(fieldId);
        linkedForeignDstIds.add(prop.foreignDatasheetId);
      }
    }
  }

  // no valid link fields, don't check consistency
  if (!linkFieldIds.length) {
    return;
  }

  // Loaded foreign datasheet is not directly linked, ignore.
  // if (!linkedForeignDstIds.has(loadedForeignDstId)) {
  //   return;
  // }

  // Only when all linked datasheets are fully loaded then link consistency is checked.
  for (const dstId of linkedForeignDstIds) {
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

  const errorRecordIds: Map<string, Map<string, { missing?: Set<string>; redundant?: Set<string> }>> = new Map();

  const addRecordId = (type: 'missing' | 'redundant', dstId: string, recordId: string, fieldId: string, recordIdInCell: string) => {
    let data = errorRecordIds.get(dstId);
    if (!data) {
      data = new Map();
      errorRecordIds.set(dstId, data);
    }
    const cellId = recordId + ':' + fieldId;
    let recordIds = data.get(cellId);
    if (!recordIds) {
      recordIds = {};
      data.set(cellId, recordIds);
    }
    if (recordIds[type]) {
      recordIds[type]!.add(recordIdInCell);
    } else {
      recordIds[type] = new Set([recordIdInCell]);
    }
  };

  const addMissingRecordId = (dstId: string, recordId: string, fieldId: string, missingRecordId: string) =>
    addRecordId('missing', dstId, recordId, fieldId, missingRecordId);

  const addRedundantRecordId = (dstId: string, recordId: string, fieldId: string, redundantRecordId: string) =>
    addRecordId('redundant', dstId, recordId, fieldId, redundantRecordId);

  // Check all link fields that link foreign datasheets
  for (const fieldId of linkFieldIds) {
    const { foreignDatasheetId, brotherFieldId } = fieldMap[fieldId]!.property as ILinkFieldProperty;
    const {
      snapshot: {
        recordMap: foreignRecordMap,
        meta: { archivedRecordIds }
      },
    } = getDatasheet(state, foreignDatasheetId)!;

    // check recordIds that are missing in link cells in foreign datasheet
    for (const recordId in recordMap) {
      const record = recordMap[recordId]!;
      const cellValue = record.data[fieldId] as ILinkIds | undefined;
      if (!Array.isArray(cellValue)) {
        continue;
      }
      for (const linkedRecordId of cellValue) {
        const foreignRecord = foreignRecordMap[linkedRecordId];
        const isArchivedRecord = archivedRecordIds?.includes(linkedRecordId);
        // ignore archived records
        if (isArchivedRecord) {
          continue;
        }
        if (!foreignRecord) {
          addRedundantRecordId(mainDstId, recordId, fieldId, linkedRecordId);
        } else if (!(foreignRecord.data[brotherFieldId!] as ILinkIds | undefined)?.includes(recordId)) {
          addMissingRecordId(foreignDatasheetId, linkedRecordId, brotherFieldId!, recordId);
        }
      }
    }

    // check recordIds that are missing in link cells in main datasheet
    for (const foreignRecordId in foreignRecordMap) {
      const foreignRecord = foreignRecordMap[foreignRecordId]!;
      const foreignCellValue = foreignRecord.data[brotherFieldId!] as ILinkIds | undefined;
      if (!Array.isArray(foreignCellValue)) {
        continue;
      }

      for (const recordId of foreignCellValue) {
        const record = recordMap[recordId];
        if (!record) {
          addRedundantRecordId(foreignDatasheetId, foreignRecordId, brotherFieldId!, recordId);
        } else if (!(record.data[fieldId] as ILinkIds | undefined)?.includes(foreignRecordId)) {
          addMissingRecordId(mainDstId, recordId, fieldId, foreignRecordId);
        }
      }
    }
  }

  return errorRecordIds.size ? { mainDstId, mainDstName, errorRecordIds } : undefined;
}

export function generateFixLinkConsistencyChangesets(error: ILinkConsistencyError, state: IReduxState): IResourceOpsCollect[] {
  const resourceOps: IResourceOpsCollect[] = [];

  for (const [dstId, cells] of error.errorRecordIds) {
    const datasheet = getDatasheet(state, dstId);
    if (!datasheet) {
      continue;
    }

    const {
      snapshot: { recordMap },
    } = datasheet;

    const actions: IJOTAction[] = [];

    for (const [cellId, changes] of cells) {
      const [recordId, fieldId] = cellId.split(':', 2) as [string, string];
      const { missing, redundant } = changes;
      const record = recordMap[recordId];
      if (!record) {
        continue;
      }
      const oldRecordIds = (record.data[fieldId] as ILinkIds) ?? [];
      let newRecordIds = oldRecordIds;
      if (redundant) {
        newRecordIds = newRecordIds.filter(newRecordIds => !redundant.has(newRecordIds));
      }
      if (missing) {
        newRecordIds = [...newRecordIds, ...missing];
      }
      if (oldRecordIds.length && newRecordIds.length) {
        actions.push({
          n: OTActionName.ObjectReplace,
          od: oldRecordIds,
          oi: newRecordIds,
          p: ['recordMap', recordId, 'data', fieldId],
        });
      } else if (oldRecordIds.length) {
        actions.push({
          n: OTActionName.ObjectDelete,
          od: oldRecordIds,
          p: ['recordMap', recordId, 'data', fieldId],
        });
      } else if (newRecordIds.length) {
        actions.push({
          n: OTActionName.ObjectInsert,
          oi: newRecordIds,
          p: ['recordMap', recordId, 'data', fieldId],
        });
      }
    }

    if (actions.length) {
      resourceOps.push({
        resourceId: dstId,
        resourceType: ResourceType.Datasheet,
        operations: [
          {
            cmd: CollaCommandName.FixConsistency,
            actions,
          },
        ],
      });
    }
  }

  return resourceOps;
}
