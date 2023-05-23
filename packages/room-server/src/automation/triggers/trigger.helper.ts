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
import {
  BasicOpenValueType,
  InputParser,
  MagicVariableParser,
  TRIGGER_INPUT_FILTER_FUNCTIONS,
  TRIGGER_INPUT_PARSER_FUNCTIONS
} from '@apitable/core';
import { getRecordUrl } from 'shared/helpers/env';
import { ITriggerOutput } from './trigger.factory';

export const triggerInputParser = new InputParser(new MagicVariableParser<any>(TRIGGER_INPUT_PARSER_FUNCTIONS));

export const triggerFilterInputParser = new InputParser(new MagicVariableParser<any>(TRIGGER_INPUT_FILTER_FUNCTIONS));

export const getTriggerOutput = (datasheetId: string, datasheetName: string, recordId: string, eventFields:  { [fieldId: string]: BasicOpenValueType | null }): ITriggerOutput=> {
  return {
    datasheetId,
    datasheetName,
    recordId,
    recordUrl: getRecordUrl(datasheetId, recordId),
    ...eventFields,
    datasheet: {
      id: datasheetId,
      name: datasheetName
    },
    record: {
      id: recordId,
      url: getRecordUrl(datasheetId, recordId),
      fields: eventFields
    }
  } as ITriggerOutput;
}
