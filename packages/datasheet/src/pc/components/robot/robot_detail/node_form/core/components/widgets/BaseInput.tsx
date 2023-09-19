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
import { ChangeEvent } from 'react';

interface IBaseInputProps {
  id: string;
  placeholder?: string;
  value: any;
  required?: boolean;
}

function BaseInput(props: IBaseInputProps & any) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    // console.log('No id for', props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    options,
    schema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uiSchema,
    formContext,
    registry,
    rawErrors,
    ...inputProps
  } = props;

  // If options.inputType is set use that as the input type
  if (options.inputType) {
    inputProps.type = options.inputType;
  } else if (!inputProps.type) {
    // If the schema is of type number or integer, set the input type to number
    if (schema.type === 'number') {
      inputProps.type = 'number';
      // Setting step to 'any' fixes a bug in Safari where decimals are not
      // allowed in number inputs
      inputProps.step = 'any';
    } else if (schema.type === 'integer') {
      inputProps.type = 'number';
      // Since this is integer, you always want to step up or down in multiples
      // of 1
      inputProps.step = '1';
    } else {
      inputProps.type = 'text';
    }
  }

  if (options.autocomplete) {
    inputProps.autoComplete = options.autocomplete;
  }

  // If multipleOf is defined, use this as the step value. This mainly improves
  // the experience for keyboard users (who can use the up/down KB arrows).
  if (schema.multipleOf) {
    inputProps.step = schema.multipleOf;
  }

  if (typeof schema.minimum !== 'undefined') {
    inputProps.min = schema.minimum;
  }

  if (typeof schema.maximum !== 'undefined') {
    inputProps.max = schema.maximum;
  }

  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    return props.onChange(value === '' ? options.emptyValue : value);
  };

  return [
    <input
      key={inputProps.id}
      className="form-control"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={value == null ? '' : value}
      {...inputProps}
      list={schema.examples ? `examples_${inputProps.id}` : null}
      onChange={_onChange}
      onBlur={onBlur && ((event) => onBlur(inputProps.id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(inputProps.id, event.target.value))}
    />,
    schema.examples ? (
      <datalist key={`datalist_${inputProps.id}`} id={`examples_${inputProps.id}`}>
        {[...new Set(schema.examples.concat(schema.default ? [schema.default] : []))].map((example: any) => (
          <option key={example} value={example} />
        ))}
      </datalist>
    ) : null,
  ];
}

export default BaseInput;
