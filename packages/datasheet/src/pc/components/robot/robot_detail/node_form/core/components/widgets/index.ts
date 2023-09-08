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

// import AltDateWidget from "./AltDateWidget";
// import AltDateTimeWidget from "./AltDateTimeWidget";
import BaseInput from './BaseInput';
import { CheckboxesWidget } from './CheckboxesWidget';
import { CheckboxWidget } from './CheckboxWidget';
import HiddenWidget from './HiddenWidget';
import PasswordWidget from './PasswordWidget';
import { RadioGroupWidget } from './RadioGroupWidget';
import SelectWidget from './SelectWidget';
import { SwitchWidget } from './SwitchWidget';
// import ColorWidget from "./ColorWidget";
// import DateWidget from "./DateWidget";
// import DateTimeWidget from "./DateTimeWidget";
// import EmailWidget from "./EmailWidget";
// import FileWidget from "./FileWidget";
// import RadioWidget from "./RadioWidget";
// import RangeWidget from "./RangeWidget";
import TextareaWidget from './TextareaWidget';
import TextWidget from './TextWidget';
// import URLWidget from "./URLWidget";
// import UpDownWidget from "./UpDownWidget";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  BaseInput,
  PasswordWidget,
  // RadioWidget,
  // UpDownWidget,
  // RangeWidget,
  SelectWidget,
  TextWidget,
  // DateWidget,
  // DateTimeWidget,
  // AltDateWidget,
  // AltDateTimeWidget,
  // EmailWidget,
  // URLWidget,
  TextareaWidget,
  HiddenWidget,
  // ColorWidget,
  // FileWidget,
  CheckboxWidget,
  SwitchWidget,
  CheckboxesWidget,
  RadioGroupWidget,
};
