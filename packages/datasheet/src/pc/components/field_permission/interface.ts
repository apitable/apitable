import { IField, IUnitValue } from '@apitable/core';
import { IOption, IDoubleOptions } from '@vikadata/components';

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
  permissionList: IDoubleOptions[]

  // Administrator and creator unitId arrays
  adminAndOwnerUnitIds?: string[];
  showTeams?: boolean;

  searchEmail?: boolean;
}

export interface IDisabledPermission extends IFieldPermissionProps {
  setPermissionStatus: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export interface IEnablePermission {
  field: IField;
  permissionStatus: boolean;

  /**
   * @description Callback handling for closing permissions
   */
  onClose(): void
}

export interface IEnablePermissionPlus {
  field: IField;
}
