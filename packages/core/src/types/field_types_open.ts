import { IAttachmentValue } from './field_types';

export interface ISelectFieldBaseOpenValue {
  id: string;
  name: string;
  color: {
    name: string;
    value: string;
  };
}

export interface IMemberFieldOpenValue {
  id: string;
  name: string;
  type: 'Team' | 'Member';
  /** 头像 */
  avatar?: string;
}

export interface ILinkFieldOpenValue {
  /** 记录ID */
  recordId: string,
  /** 记录标题 */
  title: string
}

export interface IAttachmentFieldOpenValue extends IAttachmentValue {
  /** 文件的完整地址 */
  url: string;
  /** 预览的完整地址 */
  previewUrl?: string;
}

export type BasicOpenValueTypeBase =
  string | number | boolean | IMemberFieldOpenValue | ISelectFieldBaseOpenValue | ISelectFieldBaseOpenValue[] | ILinkFieldOpenValue[] |
  IAttachmentFieldOpenValue[];

export type ILookUpOpenValue = BasicOpenValueTypeBase[];

export type BasicOpenValueType = ILookUpOpenValue | BasicOpenValueTypeBase;
