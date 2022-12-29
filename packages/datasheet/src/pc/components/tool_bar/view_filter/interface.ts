import {
  FieldType, IField, IFilterCondition,
  IFilterInfo,
} from '@apitable/core';

export interface IFilterValueProps {
  field: IField;
  conditionIndex: number;
  condition: IFilterCondition<FieldType>;
  changeFilter: (cb: ExecuteFilterFn) => void;
  hiddenClientOption?: boolean;
  style?: React.CSSProperties;
}

export interface IFilterOptionProps {
  field: IField;
  condition: IFilterCondition<FieldType>;
  onChange: (value: string | string[] | null) => void;
}

export type IFilterMemberProps = IFilterOptionProps;

export interface IFilterBaseProps {
  field: IField;
  condition: IFilterCondition<FieldType>;
}
export interface IFilterDateProps extends IFilterBaseProps {
  onChange: (value: string | string[] | null) => void;
  conditionIndex: number;
  changeFilter: (cb: ExecuteFilterFn) => void;
}

export interface IFilterNumberProps extends IFilterBaseProps {
  onChange: (value: string | string[] | null) => void;
}

export interface IFilterCheckboxProps extends IFilterBaseProps {
  onChange: (value: boolean | null) => void;
}

export type ExecuteFilterFn = (value: IFilterInfo) => IFilterInfo | null;
