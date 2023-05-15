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
import { BasicOpenValueType, IExpressionOperand } from '@apitable/core';
import { ITrigger, ITriggerFactory, IParam } from './trigger.factory';
import { getTriggerOutput, triggerInputParser } from './trigger.helper';

export interface IRecordCreatedParamExtra {
  datasheetId: string;
  datasheetName: string;
  recordId: string;
  eventFields: { [fieldId: string]: BasicOpenValueType | null };
}

export class RecordCreatedTriggerFactory implements ITriggerFactory<IParam<IRecordCreatedParamExtra>> {
  createTrigger(param: IParam<IRecordCreatedParamExtra>): ITrigger | null {
    const triggerInput = triggerInputParser.render(param.input! as IExpressionOperand, {});
    if (triggerInput.datasheetId === param.extra.datasheetId) {
      return {
        input: triggerInput,
        output: getTriggerOutput(param.extra.datasheetId, param.extra.datasheetName, param.extra.recordId, param.extra.eventFields),
      };
    }
    return null;
  }
}
