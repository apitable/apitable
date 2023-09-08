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

import { IOption, IDoubleOptions } from '@apitable/components';
import { IField, IUnitValue } from '@apitable/core';

export interface IFieldPermissionProps {
  field: IField;
  onModalClose(): void;
}

export interface IUnitPermissionSelectProps {
  classNames?: string;
  /**
   * @description Callback function for submission
   * @param {IMemberValue[]} unitInfos A collection of selected member information, if it is an empty array, no data should be submitted
   * @param {IOption} permission The permissions assigned to the selected member, such as editable, viewable, etc.,
   * are consistent with the structure of the object passed into the permissionList
   */
  onSubmit(unitInfos: IUnitValue[], permission: IOption): void;

  /**
   * @description Current list of options to be displayed
   */
  permissionList: IDoubleOptions[];

  // Administrator and creator unitId arrays
  adminAndOwnerUnitIds?: string[];
  showTeams?: boolean;

  searchEmail?: boolean;
}

export interface IDisabledPermission extends IFieldPermissionProps {
  setPermissionStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export interface IEnablePermission {
  field: IField;
  permissionStatus: boolean;

  /**
   * @description Callback handling for closing permissions
   */
  onClose(): void;
}

export interface IEnablePermissionPlus {
  field: IField;
}
