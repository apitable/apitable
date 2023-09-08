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
    switch: 'SwitchWidget',
  },
  string: {
    text: 'TextWidget',
    password: 'PasswordWidget',
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
