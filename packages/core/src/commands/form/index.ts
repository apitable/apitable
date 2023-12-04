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

import { ResourceType } from 'types';
import { ExecuteResult, ICollaCommandDef, ICollaCommandExecuteContext } from '../../command_manager';
import { FormAction } from '../../commands_actions/form';
import { IFormProps } from '../../exports/store/interfaces';
import { CollaCommandName } from '..';
import { getFormSnapshot } from 'modules/database/store/selectors/resource/form';

export interface IUpdateFormProps {
  cmd: CollaCommandName.UpdateFormProps;
  formId: string;
  partialProps: Partial<IFormProps>
}

export const updateFormProps: ICollaCommandDef<IUpdateFormProps> = {
  undoable: false,

  execute(context: ICollaCommandExecuteContext, options) {
    const { state: state } = context;
    const { formId, partialProps } = options;
    const snapshot = getFormSnapshot(state, formId);
    if (!snapshot) {
      return null;
    }

    const updateFormPropsAction = FormAction.updatePropsAction(snapshot.formProps, { partialProps });
    if (updateFormPropsAction.length === 0) {
      return null;
    }
    return {
      result: ExecuteResult.Success,
      resourceId: formId,
      resourceType: ResourceType.Form,
      actions: updateFormPropsAction,
    };
  },
};