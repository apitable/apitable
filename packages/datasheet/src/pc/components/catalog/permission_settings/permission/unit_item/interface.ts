// import { Role } from '@apitable/core';

export interface IUnitItemProps {
  className?: string;
  /**
   * @description Permission list, base information for unit
   * This may refer to a specific person or a department
   */
  unit: IUnitInfo;

  /**
   * @description The identity of the current unit.
   */
  identity?: IUnitIdentity;

  /**
   * @description Identifies whether changes to the current user's permission status are allowed
   */
  disabled?: boolean;

  /**
   * @description Non-actionable tips that can be left out
   */
  disabledTip?: string;
  /**
   * @description unit The status of the authority role at this time
   */
  // role: Role.Editor | Role.Member | Role.ReadOnly;
  role: string;

  /**
   * @description The identity that can be assigned to the current unit
   */
  roleOptions?: IRoleOption[];

  /**
   * @description Whether to allow the unit to be removed from the permission list
   * @default true
   */
  allowRemove?: boolean

  /**
   * @description Callback for removing a unit
   * @param {string} unitId
   */
  onRemove?: (unitId: string) => void;

  /**
   * @description Modified callbacks for permission roles
   * @param {string} unitId
   * @param {string} role
   */
  onChange?: (unitId: string, role: string) => void;

  /**
   * @description Whether the current user's permission status is abnormal
   */
  roleInvalid?: boolean;
}

export interface IRoleOption {
  // Unique in the data, identifies the value of the current option
  value: string;
  // Descriptions displayed for the user to see
  label: string;
  // Is the current option unavailable
  disabled?: boolean;
  // Non-selectable prompts
  disabledTip?: string
}

export interface IUnitInfo {
  id: string;
  avatar: string;
  name: string;
  info: string;
  isTeam: boolean;
  isMemberNameModified?: boolean;
}

interface IUnitIdentity {
  // Space Station Manager
  admin?: boolean;
  // People who have opened specified permissions
  permissionOpener?: boolean;
  // Content in tooltip
  permissionOpenerTip?: string
}
