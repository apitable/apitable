/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { DatasheetActions } from 'commands_actions/datasheet';
import { ExecuteResult, ICollaCommandDef } from 'command_manager';
import { CollaCommandName } from '..';
import { ResourceType } from 'types';
import { isEmpty } from 'lodash';
import { IJOTAction } from '../../engine';
import {
  getSnapshot,
} from 'modules/database/store/selectors/resource/datasheet/base';
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
    const { state: state } = context;
    const { datasheetId, fieldId, data } = options;
    const snapshot = getSnapshot(state, datasheetId);

    if (isEmpty(data) || !snapshot) {
      return null;
    }

    const field = snapshot.meta.fieldMap[fieldId]!;

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
