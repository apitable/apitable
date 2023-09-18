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
import { ChangeEvent, useState } from 'react';
import { TextInput } from '@apitable/components';
import { map2Text } from 'pc/components/robot/robot_detail/magic_variable_container';
import { literal2Operand } from 'pc/components/robot/robot_detail/node_form/ui/utils';

interface IBaseInputProps {
  id: string;
  placeholder?: string;
  value: any;
  required?: boolean;
}

function PasswordWidget(props: IBaseInputProps & any) {
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

  const [inputValue, setInputValue] = useState(value == null ? '' : value.value);

  const ids = props.id.split('_');
  const placeholderKey = ids[ids.length - 1];

  const _onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setInputValue(value === '' ? options.emptyValue : value);
  };

  return (
    <TextInput
      key={inputProps.id}
      className="form-control form-control-password"
      readOnly={readonly}
      disabled={disabled}
      autoFocus={autofocus}
      value={inputValue}
      {...inputProps}
      list={schema.examples ? `examples_${inputProps.id}` : null}
      onChange={_onChange}
      onBlur={onBlur && ((event) => props.onChange(literal2Operand(event.target.value || null)))}
      onFocus={onFocus && ((event) => onFocus(inputProps.id, literal2Operand(event.target.value)))}
      placeholder={map2Text[placeholderKey]}
      type={'password'}
      style={{
        borderColor: 'none',
        width: '100%',
      }}
    />
  );
}

export default PasswordWidget;
