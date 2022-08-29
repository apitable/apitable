export const REQUIRED_FIELD_SYMBOL = '*';

export const COMPONENT_TYPES = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  null: 'NullField',
};

export const ADDITIONAL_PROPERTY_FLAG = '__additional_property';

export const widgetMap = {
  boolean: {
    checkbox: 'CheckboxWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    hidden: 'HiddenWidget',
    switch: 'SwitchWidget'
  },
  string: {
    text: 'TextWidget',
    // password: "PasswordWidget",
    // email: "EmailWidget",
    // hostname: "TextWidget",
    // ipv4: "TextWidget",
    // ipv6: "TextWidget",
    // uri: "URLWidget",
    // "data-url": "FileWidget",
    // radio: "RadioWidget",
    select: 'SelectWidget',
    textarea: 'TextareaWidget',
    hidden: 'HiddenWidget',
    // date: "DateWidget",
    // datetime: "DateTimeWidget",
    // "date-time": "DateTimeWidget",
    // "alt-date": "AltDateWidget",
    // "alt-datetime": "AltDateTimeWidget",
    // color: "ColorWidget",
    // file: "FileWidget",
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget',
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget',
  },
  array: {
    select: 'SelectWidget',
    checkboxes: 'CheckboxesWidget',
    // files: "FileWidget",
    hidden: 'HiddenWidget',
  },
};
