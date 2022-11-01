import { isEmpty } from 'lodash';
import { IJOTAction, jot } from 'engine/ot';
import { DatasheetActions } from 'model';
import { Selectors, DropDirectionType } from 'store';
import { ISetRecordOptions, setRecords } from './set_records';
import { t, Strings } from 'i18n';
import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ILinkedActions } from 'command_manager';
import { CollaCommandName } from 'commands';
import { Events, Player } from 'player';

export interface IMoveRow {
  recordId: string;
  overTargetId: string;
  direction: DropDirectionType;
}

export interface IMoveRowOptions {
  cmd: CollaCommandName.MoveRow;
  data: IMoveRow[];
  recordData?: ISetRecordOptions[] | null;
  viewId: string;
}

export const moveRow: ICollaCommandDef<IMoveRowOptions> = {
  undoable: true,

  execute: (context, options) => {
    const { model: state } = context;
    const { data, recordData, viewId } = options;
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const snapshot = Selectors.getSnapshot(state, datasheetId);
    const recordMap = Selectors.getRowsIndexMap(state, datasheetId)!;

    if (!snapshot) {
      return null;
    }

    const views = snapshot.meta.views;

    if (isEmpty(data)) {
      return null;
    }

    if (!views.some(item => item.id === viewId)) {
      throw new Error(t(Strings.error_move_row_failed_invalid_params));
    }

    const linkedActions: ILinkedActions[] = [];
    const actions = data.reduce<IJOTAction[]>((collected, recordOption) => {
      const { recordId, overTargetId: targetRecordId, direction } = recordOption;
      const originRowIndex = recordMap.get(recordId);
      const targetRowIndex = recordMap.get(targetRecordId);
      if (targetRowIndex == null || originRowIndex == null) {
        Player.doTrigger(Events.app_error_logger, {
          error: new Error('There is a problem with the moved row record data'),
          metaData: {
            recordId,
            targetRecordId,
            targetRowIndex,
            originRowIndex,
            rowIndexMap: JSON.stringify(recordMap),
            recordIds: JSON.stringify(Object.keys(snapshot.recordMap)),
            rows: JSON.stringify(snapshot.meta.views[0].rows)
          },
        });
        return collected;
      }
      
      let targetIndex = originRowIndex > targetRowIndex ? targetRowIndex + 1 : targetRowIndex;
      if (direction === DropDirectionType.BEFORE) {
        targetIndex--;
      }
      const action = DatasheetActions.moveRow2Action(snapshot, { recordId, target: targetIndex, viewId });

      if (!action) {
        return collected;
      }

      if (collected.length) {
        const transformedAction = jot.transform([action], collected, 'right');
        collected.push(...transformedAction);
      } else {
        collected.push(action);
      }

      return collected;
    }, []);

    if (recordData) {
      const rst = setRecords.execute(context, {
        cmd: CollaCommandName.SetRecords,
        data: recordData,
      });
      if (rst) {
        if (rst.result === ExecuteResult.Fail) {
          return rst;
        }
        actions.push(...rst.actions);
        linkedActions.push(...(rst.linkedActions || []));
      }
    }

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions,
      linkedActions,
    };
  },
};
