import { DatasheetActions } from 'model';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';
import { isEmpty } from 'lodash';
import { IJOTAction } from '../../engine';
import { Selectors } from '../../store';

export interface IFixOneWayLinkDstId {
  cmd: CollaCommandName.FixOneWayLinkDstId;
  data: IFixOneWayLinkOptions[];
  datasheetId: string;
  fieldId: string;
}

export interface IFixOneWayLinkOptions {
  oldBrotherFieldId: string;
  oldForeignDatasheetId?: string;
  newBrotherFieldId: string;
  newForeignDatasheetId?: string;
}

export const fixOneWayLinkDstId: ICollaCommandDef<IFixOneWayLinkDstId> = {
  undoable: false,

  execute: (context, options) => {
    const { model: state } = context;
    const { datasheetId, fieldId, data } = options;
    const snapshot = Selectors.getSnapshot(state, datasheetId);

    if (isEmpty(data) || !snapshot) {
      return null;
    }

    const field = snapshot.meta.fieldMap[fieldId];

    const actions = data.reduce<IJOTAction[]>((collected, linkFieldOption) => {
      if (!linkFieldOption) return collected;

      const newField = {
        ...field,
        property: {
          ...field.property,
          brotherFieldId: linkFieldOption.newBrotherFieldId,
        },
      };

      const action = DatasheetActions.changeOneWayLinkDstId2Action(snapshot,{ fieldId: fieldId, newField });
      action && collected.push(action);
      return collected;
    }, []);

    if (actions.length === 0) {
      return null;
    }

    return {
      result: ExecuteResult.Success,
      resourceId: datasheetId,
      resourceType: ResourceType.Datasheet,
      actions
    };
  },
};
