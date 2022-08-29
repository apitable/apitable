import { useState } from 'react';
import {
  getDefaultFormState,
  getMatchingOption, getUiOptions,
  getWidget,
  guessType,
  retrieveSchema
} from '../../utils';

const AnyOfField = (props) => {
  const _getMatchingOption = (formData, options) => {
    const { rootSchema } = props.registry;

    const option = getMatchingOption(formData, options, rootSchema);
    if (option !== 0) {
      return option;
    }
    // If the form data matches none of the options, use the currently selected
    // option, assuming it's available; otherwise use the first option
    return 0;
  };
  const { formData, options } = props;
  const [state, setState] = useState({
    selectedOption: _getMatchingOption(formData, options),
  });

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     !deepEquals(this.props.formData, prevProps.formData) &&
  //     this.props.idSchema.$id === prevProps.idSchema.$id
  //   ) {
  //     const matchingOption = this.getMatchingOption(
  //       this.props.formData,
  //       this.props.options
  //     );

  //     if (!prevState || matchingOption === this.state.selectedOption) {
  //       return;
  //     }

  //     this.setState({
  //       selectedOption: matchingOption,
  //     });
  //   }
  // }

  const onOptionChange = option => {
    const selectedOption = parseInt(option, 10);
    const { formData, onChange, options, registry } = props;
    const { rootSchema } = registry;
    const newOption = retrieveSchema(
      options[selectedOption],
      rootSchema,
      formData
    );

    // If the new option is of type object and the current data is an object,
    // discard properties added using the old option.
    let newFormData: {} | undefined = undefined;
    if (
      guessType(formData) === 'object' &&
      (newOption.type === 'object' || newOption.properties)
    ) {
      newFormData = Object.assign({}, formData);

      const optionsToDiscard = options.slice();
      optionsToDiscard.splice(selectedOption, 1);

      // Discard any data added using other options
      for (const option of optionsToDiscard) {
        if (option.properties) {
          for (const key in option.properties) {
            if (newFormData!.hasOwnProperty(key)) {
              delete newFormData![key];
            }
          }
        }
      }
    }
    // Call getDefaultFormState to make sure defaults are populated on change.
    onChange(
      getDefaultFormState(options[selectedOption], newFormData, rootSchema)
    );

    setState({
      selectedOption: parseInt(option, 10),
    });
  };

  const {
    baseType,
    disabled,
    errorSchema,
    idPrefix,
    idSchema,
    onBlur,
    onChange,
    onFocus,
    registry,
    uiSchema,
    schema,
  } = props;

  const _SchemaField = registry.fields.SchemaField;
  const { widgets } = registry;
  const { selectedOption } = state;
  const { widget = 'select', ...uiOptions } = getUiOptions(uiSchema)!;
  const Widget = getWidget({ type: 'number' }, widget as any, widgets) as any;

  const option = options[selectedOption] || null;
  let optionSchema;

  if (option) {
    // If the subschema doesn't declare a type, infer the type from the
    // parent schema
    optionSchema = option.type
      ? option
      : Object.assign({}, option, { type: baseType });
  }

  const enumOptions = options.map((option, index) => ({
    label: option.title || `Option ${index + 1}`,
    value: index,
  }));

  return (
    <div className="panel panel-default panel-body">
      <div className="form-group">
        <Widget
          id={`${idSchema.$id}${schema.oneOf ? '__oneof_select' : '__anyof_select'
          }`}
          schema={{ type: 'number', default: 0 }}
          onChange={onOptionChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={selectedOption}
          options={{ enumOptions }}
          {...uiOptions}
        />
      </div>

      {option !== null && (
        <_SchemaField
          schema={optionSchema}
          uiSchema={uiSchema}
          errorSchema={errorSchema}
          idSchema={idSchema}
          idPrefix={idPrefix}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={registry}
          disabled={disabled}
        />
      )}
    </div>
  );
};

// AnyOfField.defaultProps = {
//   disabled: false,
//   errorSchema: {},
//   idSchema: {},
//   uiSchema: {},
// };

// if (process.env.NODE_ENV !== "production") {
//   AnyOfField.propTypes = {
//     options: PropTypes.arrayOf(PropTypes.object).isRequired,
//     baseType: PropTypes.string,
//     uiSchema: PropTypes.object,
//     idSchema: PropTypes.object,
//     formData: PropTypes.any,
//     errorSchema: PropTypes.object,
//     registry: types.registry.isRequired,
//   };
// }

export default AnyOfField;
