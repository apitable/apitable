import { IField, IUnitValue } from '@vikadata/core';
import { IOption, IDoubleOptions } from '@vikadata/components';

export interface IFieldPermissionProps {
  field: IField;
  onModalClose(): void;
}

export interface IUnitPermissionSelectProps {
  classNames?: string;
  /**
   * @description 提交的回调函数
   * @param {IMemberValue[]} unitInfos 已选择的成员信息的集合，如果是空数组，则不应该提交数据
   * @param {IOption} permission 给所选择成员指定的权限，比如可编辑、可查看等，这个和 permissionList 中传入的对象结构一致
   */
  onSubmit(unitInfos: IUnitValue[], permission: IOption): void;

  /**
   * @description 当前需要展示选项列表
   */
  permissionList: IDoubleOptions[]

  // 管理员和创建人unitId数组
  adminAndOwnerUnitIds?: string[];
}

export interface IDisabledPermission extends IFieldPermissionProps {
  setPermissionStatus: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export interface IEnablePermission {
  field: IField;
  permissionStatus: boolean;

  /**
   * @description 关闭权限的回调处理
   */
  onClose(): void
}

export interface IEnablePermissionPlus {
  field: IField;
}
