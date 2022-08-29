import { ICollaCommandDef, ExecuteResult } from 'command_manager';
import { DatasheetActions } from 'model';
import { Selectors } from 'store';
import { FieldType, ILinkField, ResourceType } from 'types';
import { Player, Events } from 'player';
import { CollaCommandName } from 'commands';

export interface IDeleteRecordOptions {
  cmd: CollaCommandName.DeleteRecords;
  data: string[];
  datasheetId?: string
}

export const deleteRecord: ICollaCommandDef<IDeleteRecordOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state, ldcMaintainer } = context;
    const { data } = options;
    const datasheetId = options.datasheetId || Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    if (!snapshot) {
      return null;
    }

    const linkField: ILinkField[] = [];
    for (const fieldId in snapshot.meta.fieldMap) {
      const field = snapshot.meta.fieldMap[fieldId];
      if (field.type === FieldType.Link) {
        linkField.push(field);
      }
    }

    const getFieldByFieldId = (fieldId: string) => {
      return Selectors.getField(state, fieldId, datasheetId);
    };

    const actions = DatasheetActions.deleteRecords(snapshot, {
      recordIds: data,
      getFieldByFieldId,
      state,
    });

    /**
     * 根据自关联 field，生成一个 map，key 为 recordId，值为关联了这个 recordId 的那些 records 的 id 数组。
     * 多个自关联 field 会有多个这样的 map
     */
    const fieldRelinkMap: { [fieldId: string]: { [recordId: string]: string[] } } = {};
    linkField.filter(field => {
      // 过滤出字表关联 field
      return !field.property.brotherFieldId;
    }).forEach(field => {
      const reLinkRecords: { [recordId: string]: string[] } = {};
      Object.values(snapshot.recordMap).forEach(v => {
        const linkRecords = v.data[field.id] as string[] | undefined;
        if (linkRecords) {
          linkRecords.forEach(id => {
            if (!reLinkRecords[id]) {
              reLinkRecords[id] = [];
            }
            reLinkRecords[id].push(v.id);
          });
        }
      });
      fieldRelinkMap[field.id] = reLinkRecords;
    });

    data.forEach(recordId => {
      const record = snapshot.recordMap[recordId];
      if (!record) {
        return;
      }
      linkField.forEach((field: ILinkField) => {
        let oldValue: string[] | null = null;
        // 两表关联
        if (field.property.brotherFieldId) {
          oldValue = record.data[field.id] as string[] | null;
        } else {
          // 自关联
          oldValue = fieldRelinkMap[field.id][record.id] || null;
          // 自表关联并且关联记录包含被删除记录本身时，不生成linkedActions
          oldValue = oldValue?.filter(item => !data.includes(item));
        }

        const linkedSnapshot = Selectors.getSnapshot(state, field.property.foreignDatasheetId)!;

        // 当关联字段单元格本身就没有值的时候，则什么都不用做
        if (!oldValue?.length) {
          return;
        }
        if (!linkedSnapshot) {
          return Player.doTrigger(Events.app_error_logger, {
            error: new Error(`foreignDatasheet:${field.property.foreignDatasheetId} has been deleted`),
            metaData: { foreignDatasheetId: field.property.foreignDatasheetId },
          });
        }
        ldcMaintainer.insert(state, linkedSnapshot, record.id, field, null, oldValue);
      });
    }, []);

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
    };
  },
};

/*

 declare module 'command_manager/command_manager' {
 interface CollaCommandManager {
 execute(options: IAddRecordsOptions & { cmd: 'AddRecords' }): ICollaCommandExecuteResult<IAddRecordsResult>;
 }
 }

 */
