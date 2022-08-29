import { DatasheetActions } from './datasheet';
import { without } from 'lodash';
import { ILinkField, FieldType, BasicValueType } from 'types/field_types';
import { Selectors, ISnapshot, IReduxState } from 'store';
import { ILinkedActions } from 'command_manager';
import { handleEmptyCellValue } from './utils';

enum ActionFlag {
  Add = '+',
  Del = '-',
}

/**
 * 用于记录关联字段的变化
 * 下方 Map 中的 string 分别为: datasheetId => brotherFieldId => linkedRecordId
 * 两个 Set 中的 string 为 recordId 分别是表示增加还是删除。
 * 在选区删除和批量粘贴的过程中，是有可能会一次性影响到不同的 datasheet 中不同的 brotherField 中不同的 linkedRecord
 * 并在其中 增加 或者 删除 recordId
 */
type ILinkedChange = Map<string, Map<string, Map<string, { add: Set<string>, del: Set<string> }>>>;

/**
 * 用于维护关联字段数据一致性的公用类。
 * 在对 record 进行增删该查的时候，如果 record 中有关联字段，则需要同时更新关联字段中相关的 record
 */
export class LinkedDataConformanceMaintainer {
  linkedChange: ILinkedChange = new Map();

  /**
   * 对比 value 和 oldValue 的值，自动计算出关联的 record 中的变化，并进行记录
   * 在一次 command 周期中，可以多次调用 insert。
   */
  insert(
    state: IReduxState,
    linkedSnapshot: ISnapshot,
    recordId: string,
    field: ILinkField,
    value: string[] | null,
    oldValue: string[] | null,
  ) {
    const { brotherFieldId = field.id, foreignDatasheetId } = field.property!;

    if (!value && !oldValue) {
      return;
    }

    // value 里面有，而 oldValue 没有，则需要增加
    const toAdd = without(value, ...(oldValue || []));
    // oldValue 里面有，而 value 没有，则需要删除
    const toDel = without(oldValue, ...(value || []));

    toAdd.forEach(linkedRecordId => {
      this.insertLinkedRecordChange(
        foreignDatasheetId,
        brotherFieldId!,
        linkedRecordId,
        recordId,
        ActionFlag.Add,
      );
    });

    toDel.forEach(linkedRecordId => {
      const cellValueInLinkedCell = Selectors.getCellValue(
        state,
        linkedSnapshot,
        linkedRecordId,
        brotherFieldId!,
        undefined,
        undefined,
        true
      ) as string[] | null;

      if (!cellValueInLinkedCell) {
        console.error(`关联的记录中内容为空, 本记录: ${recordId}`);
        return;
      }

      if (!cellValueInLinkedCell.includes(recordId)) {
        console.error(`没有在被关联记录中找到本表的记录, 本记录: ${recordId} 关联记录 ${cellValueInLinkedCell}`);
        return;
      }

      this.insertLinkedRecordChange(
        foreignDatasheetId,
        brotherFieldId!,
        linkedRecordId,
        recordId,
        ActionFlag.Del,
      );
    });
  }

  private insertLinkedRecordChange(
    datasheetId: string,
    brotherFieldId: string,
    linkedRecordId: string,
    recordId: string,
    actionFlag: ActionFlag,
  ) {
    let datasheet = this.linkedChange.get(datasheetId);
    if (!datasheet) {
      datasheet = new Map();
      this.linkedChange.set(datasheetId, datasheet);
    }

    let brotherField = datasheet.get(brotherFieldId);
    if (!brotherField) {
      brotherField = new Map();
      datasheet.set(brotherFieldId, brotherField);
    }

    let linkedRecord = brotherField.get(linkedRecordId);
    if (!linkedRecord) {
      linkedRecord = { add: new Set<string>(), del: new Set<string>() };
      brotherField.set(linkedRecordId, linkedRecord);
    }

    if (actionFlag === ActionFlag.Add) {
      linkedRecord.add.add(recordId);
    }

    if (actionFlag === ActionFlag.Del) {
      linkedRecord.del.add(recordId);
    }
  }

  /**
   * 对关联表中的值变化批量转化为 LinkedActions。
   * 该方法会清空值变化缓存。在一次 command 周期中，只能执行一次。
   */
  flushLinkedActions(state: IReduxState) {
    const linkedActions: ILinkedActions[] = [];
    if (this.linkedChange.size > 0) {
      this.linkedChange.forEach((datasheet, datasheetId) => {
        const snapshot = Selectors.getSnapshot(state, datasheetId)!;

        const linkedAction: ILinkedActions = { datasheetId, actions: [] };
        linkedActions.push(linkedAction);

        datasheet.forEach((field, fieldId) => {
          field.forEach((changeIds, recordId) => {
            if (!snapshot.recordMap[recordId]) {
              console.error(`record: ${recordId} 在 datasheet: ${datasheetId} 中不存在！`);
              return;
            }

            const fieldType = snapshot.meta.fieldMap[fieldId] && snapshot.meta.fieldMap[fieldId].type;
            // 保证在外键字段确实是关联字段类型的时候，才进行单元格填充。
            const cellValueInLinkedCell = fieldType === FieldType.Link ?
              Selectors.getCellValue(state, snapshot, recordId, fieldId, undefined, undefined, true) as string[] || [] : [];
            let newLinkedCellValue: string[] | null = without(cellValueInLinkedCell, ...changeIds.del);
            newLinkedCellValue.push(...changeIds.add);
            newLinkedCellValue = handleEmptyCellValue(newLinkedCellValue, BasicValueType.Array);
            const action = DatasheetActions.setRecord2Action(
              snapshot,
              { recordId, fieldId, value: newLinkedCellValue },
            );

            action && linkedAction.actions.push(action);
          });
        });
      });
    }
    this.linkedChange.clear();
    return linkedActions;
  }
}
