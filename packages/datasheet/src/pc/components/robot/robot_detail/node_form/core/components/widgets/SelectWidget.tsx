import { JSONSchema7 } from 'json-schema';

import { asNumber, guessType } from '../../utils';

const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue(schema: JSONSchema7, value: any) {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type } = schema;
  const items = schema.items as JSONSchema7;
  if (value === '') {
    return undefined;
  } else if (type === 'array' && items && items.type && nums.has(items.type as any)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every(x => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every(x => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
}

function getValue(event: any, multiple: any) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter((o: any) => o.selected)
      .map((o: any) => o.value);
  } 
  return event.target.value;
  
}

function SelectWidget(props: any) {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
  } = props;
  const { enumOptions, enumDisabled } = options;
  const emptyValue = multiple ? [] : '';
  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      value={typeof value === 'undefined' ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onBlur={
        onBlur &&
        (event => {
          const newValue = getValue(event, multiple);
          onBlur(id, processValue(schema, newValue));
        })
      }
      onFocus={
        onFocus &&
        (event => {
          const newValue = getValue(event, multiple);
          onFocus(id, processValue(schema, newValue));
        })
      }
      onChange={event => {
        const newValue = getValue(event, multiple);
        onChange(processValue(schema, newValue));
      }}>
      {!multiple && schema.default === undefined && (
        <option value="">{placeholder}</option>
      )}
      {enumOptions.map(({ value, label }: any, i: number) => {
        const disabled = enumDisabled && enumDisabled.indexOf(value) != -1;
        return (
          <option key={i} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

// SelectWidget.defaultProps = {
//   autofocus: false,
// };

// if (process.env.NODE_ENV !== "production") {
//   SelectWidget.propTypes = {
//     schema: PropTypes.object.isRequired,
//     id: PropTypes.string.isRequired,
//     options: PropTypes.shape({
//       enumOptions: PropTypes.array,
//     }).isRequired,
//     value: PropTypes.any,
//     required: PropTypes.bool,
//     disabled: PropTypes.bool,
//     readonly: PropTypes.bool,
//     multiple: PropTypes.bool,
//     autofocus: PropTypes.bool,
//     onChange: PropTypes.func,
//     onBlur: PropTypes.func,
//     onFocus: PropTypes.func,
//   };
// }

export default SelectWidget;
