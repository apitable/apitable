// import { Role } from '@vikadata/core';

export interface IUnitItemProps {
  className?: string;
  /**
   * @description 权限列表中，unit 的基础信息
   * 这里指的可能是具体的人，也可能是部门
   */
  unit: IUnitInfo;

  /**
   * @description 当前 unit 的标识身份，
   */
  identity?: IUnitIdentity;

  /**
   * @description 标识是否允许更改当前用户的权限身份
   */
  disabled?: boolean;

  /**
   * @description 不可操作的提示，可以不传
   */
  disabledTip?: string;
  /**
   * @description unit 此时的权限角色状态
   */
  // role: Role.Editor | Role.Member | Role.ReadOnly;
  role: string;

  /**
   * @description 能给当前 unit 指定的身份
   */
  roleOptions?: IRoleOption[];

  /**
   * @description 是否允许从权限列表中移除该 unit
   * @default true
   */
  allowRemove?: boolean

  /**
   * @description 移除某个 unit 的回调
   * @param {string} unitId
   */
  onRemove?: (unitId: string) => void;

  /**
   * @description 修改了权限角色的回调
   * @param {string} unitId
   * @param {string} role
   */
  onChange?: (unitId: string, role: string) => void;

  /**
   * @description 当期用户的权限状态是否异常
   */
  roleInvalid?: boolean;
  /**
   * 权限来自继承
   */
  isAppointMode?: boolean;
  /**
   * 是否来自详情的列表
   */
  isDetail?: boolean;
}

export interface IRoleOption {
  // 数据中唯一，标识当前选项的值
  value: string;
  // 展示给用户看的描述
  label: string;
  // 当前选项是否不可选
  disabled?: boolean;
  // 不可选的提示语
  disabledTip?: string
}

export interface IUnitInfo {
  id: string;
  avatar: string;
  name: string;
  info: string;
  isTeam: boolean;
  // 企微
  isMemberNameModified?: boolean;
}

interface IUnitIdentity {
  // 空间站管理员
  admin?: boolean;
  // 开启指定权限的人
  permissionOpener?: boolean;
  // tooltip 中的内容
  permissionOpenerTip?: string
}
