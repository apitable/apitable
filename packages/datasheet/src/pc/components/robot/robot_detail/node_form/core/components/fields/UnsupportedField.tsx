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

import { JSONSchema7 } from 'json-schema';
import { IdSchema } from '../../interface';

interface IUnexpectedFieldProps {
  schema: JSONSchema7;
  idSchema: IdSchema;
  reason: string;
}

function UnsupportedField({ schema, idSchema, reason }: IUnexpectedFieldProps) {
  return (
    <div className="unsupported-field">
      <p>
        Unsupported field schema
        {idSchema && idSchema.$id && (
          <span>
            {' for'} field <code>{idSchema.$id}</code>
          </span>
        )}
        {reason && <em>: {reason}</em>}.
      </p>
      {schema && <pre>{JSON.stringify(schema, null, 2)}</pre>}
    </div>
  );
}

export default UnsupportedField;
