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

  /**
   * Member avatar / user picture
   */
  avatar?: string;
}

export interface ILinkFieldOpenValue {
  /**
   * record's ID
   */
  recordId: string,

  /**
   * record's title
   */
  title: string
}

export interface IAttachmentFieldOpenValue extends IAttachmentValue {
  /**
   * attachment full url
   */
  url: string;
  /**
   * attachment preview url
   */
  previewUrl?: string;
}

export type BasicOpenValueTypeBase =
  string | number | boolean | IMemberFieldOpenValue | ISelectFieldBaseOpenValue | ISelectFieldBaseOpenValue[] | ILinkFieldOpenValue[] |
  IAttachmentFieldOpenValue[];

export type ILookUpOpenValue = BasicOpenValueTypeBase[];

export type BasicOpenValueType = ILookUpOpenValue | BasicOpenValueTypeBase;
