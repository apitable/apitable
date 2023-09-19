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

function TextareaWidget(props: any) {
  const { id, options, placeholder, value, required, disabled, readonly, autofocus, onChange, onBlur, onFocus } = props;
  const _onChange = ({ target: { value } }: any) => {
    return onChange(value === '' ? options.emptyValue : value);
  };
  return (
    <textarea
      id={id}
      className="form-control"
      value={value ? value : ''}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={options.rows}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  );
}

// TextareaWidget.defaultProps = {
//   autofocus: false,
//   options: {},
// };

// if (process.env.NODE_ENV !== "production") {
//   TextareaWidget.propTypes = {
//     schema: PropTypes.object.isRequired,
//     id: PropTypes.string.isRequired,
//     placeholder: PropTypes.string,
//     options: PropTypes.shape({
//       rows: PropTypes.number,
//     }),
//     value: PropTypes.string,
//     required: PropTypes.bool,
//     disabled: PropTypes.bool,
//     readonly: PropTypes.bool,
//     autofocus: PropTypes.bool,
//     onChange: PropTypes.func,
//     onBlur: PropTypes.func,
//     onFocus: PropTypes.func,
//   };
// }

export default TextareaWidget;
// The text input component will be replaced by the dynamic parameter input component
