import { getSnapshot } from 'store/selector';
import { IJOTAction } from 'engine';
import { DatasheetActions } from 'model/datasheet';
import { FieldType, IMemberField } from 'types';
import { IReduxState } from 'store';

/**
 * 当前类为了解决 pasteSetRecord 中同时使用 setRecord 和 addRecord 对成员信息做变更时，生成的多个对列头数据的修改，相互覆盖的问题
 * 参考 linkDataMaintainer 的思路，在 setRecord 和 addRecord 中不再直接生成对列头数据的变更，而是交由该类的失灵进行数据管理，在最终提交数据前，统一生成
 * 一次对猎头数据修改的变更集
 *
 * TODO: 目前先先解决线上的问题，保持旧的逻辑，对整列的数据进行变更，后续迭代为和 linkContainer 一样的对数量的检查，该步骤需要足够的测试
 */
export class MemberFieldMaintainer {
  /**
   * datasheetId -> fieldId -> unitIds
   * @type {Map<string, Map<string, string[]>>}
   * @private
   */
  private memberDataChanges: Map<string, Map<string, string[]>>;

  constructor() {
    this.memberDataChanges = new Map();
  }

  /**
   * @description 插入当前 action 中对成员数据的修改，目前只需要以 fieldId 为 key，对数据进行一次聚合
   * @param {string} fieldId
   * @param {string} datasheetId
   * @param {string[]} insertUnitIds
   */
  insert(fieldId: string, insertUnitIds: string[], datasheetId: string) {
    const memberFieldMap = this.memberDataChanges.get(datasheetId) || new Map();
    const unitIds = memberFieldMap.get(fieldId) || [];
    memberFieldMap.set(fieldId, [...new Set([...unitIds, ...insertUnitIds])]);
    this.memberDataChanges.set(datasheetId, memberFieldMap);

  }

  /**
   * @description 检查是否存在缓存的数据，在其他 action 的末尾进行一次统一对成员列的修改 action
   * @param {IReduxState} state
   * @returns {any[] | IJOTAction[]}
   */
  flushMemberAction(state: IReduxState) {
    if (this.memberDataChanges.size === 0) {
      return [];
    }

    const actions: IJOTAction[] = [];

    /**
     * 这里针对数据进行处理，不用考虑是否要和旧的列头数据做去重、筛选类的处理，目前的处理交给了 insert 之前，insert 的数据就是最终的完整数据
     */
    this.memberDataChanges.forEach((memberFieldMap, datasheetId) => {
      const snapshot = getSnapshot(state, datasheetId)!;
      const fieldMap = snapshot.meta.fieldMap;

      memberFieldMap.forEach((cellValueForUnitIds, fieldId) => {
        const field = fieldMap[fieldId];

        // 这里对字段类型做一次冗余的检查，兜底行为
        if (field.type !== FieldType.Member) {
          return;
        }

        const action = DatasheetActions.setFieldAttr2Action(snapshot, {
          field: {
            ...field,
            property: {
              ...field.property,
              unitIds: cellValueForUnitIds,
            },
          } as IMemberField,
        });

        if (!action) {
          return;
        }

        actions.push(action);
      });

    });

    this.memberDataChanges.clear();
    return actions;
  }
}