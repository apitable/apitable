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

import { Datasheet } from 'model';
import { FieldType } from './field_types';
import { ViewType } from './view_types';

export interface IFieldPicker {
  /** An array indicating which field types can be selected. */
  allowedTypes?: FieldType[];
  /** A function to be called when the selected field changes. */
  onChange?: (option: IOption) => void;
  /** 
   * The corresponding view ID, after specifying the view, 
   * the order of the options in the field selector will be in the order of the fields in that view, 
   * and the fields hidden by that view will also appear in the options.
   */
  viewId: string | undefined;
  /** The selected field ID. */
  fieldId?: string;
  /** The placeholder text when no field is selected. . Defaults to 'Please pick' */
  placeholder?: string;
  /** If set to true, the user cannot interact with the select. */
  disabled?: boolean;
  /** The parent datasheet model to select fields from. If null or undefined, the picker default datasheet associated with the widget. */
  datasheet?: Datasheet;
}

export interface IOption {
  label: string;
  value: string
}

export interface IViewPicker {
  /** An array indicating which view types can be selected. */
  allowedTypes?: ViewType[];
  /** The placeholder text when no view is selected. Defaults to 'Please pick' */
  placeholder?: string;
  /** A function to be called when the selected view changes. */
  onChange?: (option: IOption) => void;
  /** The selected view ID. */
  viewId?: string;
  /** If set to true, the user cannot interact with the select. */
  disabled?: boolean;
  /** The parent datasheet model to select view from. If null or undefined, the picker default datasheet associated with the widget. */
  datasheet?: Datasheet;
  /**
   * `Beta API`, possible feature changes.
   * 
   * If this option is turned on, the selected view in this ViewPicker will be used as 
   * the target view for "Jump to link datasheet" in the dashboard.
   * 
   * The jump to the link datasheet can only be the datasheet to which the widget is bound.
   * 
   * Note: In the same widget, the controlJump option can only be set in one ViewPicker; 
   * if the controlJump option is set in multiple ViewPickers, the function will not be guaranteed to work properly.
   * 
   * Recommendation: When this feature is enabled, 
   * you should use useCloudStorage to do persistent storage for the selected view, otherwise it may cause exceptions.
  */
  controlJump?: boolean;
}