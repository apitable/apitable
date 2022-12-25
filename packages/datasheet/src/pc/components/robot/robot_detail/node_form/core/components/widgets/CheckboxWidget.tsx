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

import { Checkbox } from '@apitable/components';
import { IWidgetProps } from '../../interface';

export const CheckboxWidget = (props: IWidgetProps) => {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label,
    // autofocus = false,
    // onBlur,
    // onFocus,
    onChange,
    DescriptionField,
  } = props;

  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  // const required = schemaRequiresTrueValue(schema);

  return (
    <div className={`checkbox ${disabled || readonly ? 'disabled' : ''}`} id={id}>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <label>
        <Checkbox
          checked={typeof value === 'undefined' ? false : value}
          disabled={disabled || readonly}
          onChange={(value) => onChange(value)}
        >
          {label}
        </Checkbox>
        {/* <input
          type="checkbox"
          id={id}
          checked={typeof value === 'undefined' ? false : value}
          required={required}
          disabled={disabled || readonly}
          autoFocus={autofocus}
          onChange={event => onChange(event.target.checked)}
          onBlur={onBlur && (event => onBlur(id, event.target.checked))}
          onFocus={onFocus && (event => onFocus(id, event.target.checked))}
        />
        <span>{label}</span> */}
      </label>
    </div>
  );
};

// CheckboxWidget.defaultProps = {
//   autofocus: false,
// };

// if (process.env.NODE_ENV !== "production") {
//   CheckboxWidget.propTypes = {
//     schema: PropTypes.object.isRequired,
//     id: PropTypes.string.isRequired,
//     value: PropTypes.bool,
//     required: PropTypes.bool,
//     disabled: PropTypes.bool,
//     readonly: PropTypes.bool,
//     autofocus: PropTypes.bool,
//     onChange: PropTypes.func,
//   };
// }