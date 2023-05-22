import { IField, FOperator } from '@apitable/core';

export interface IFilterValueProps {
  value: any;
  field: IField;
  operator: FOperator;
  onChange: (condition: any) => void;
}

export interface IFilterValueBaseProps {
  field: IField
  onChange: (condition: any) => void
}

export interface IFilterCheckboxProps extends IFilterValueBaseProps {
  value: boolean;
}

export interface IFilterTextProps extends IFilterValueBaseProps {
  value: string[];
}

export interface IFilterRatingProps extends IFilterValueBaseProps {
  value: string[];
}

export interface IFilterSelectProps extends IFilterValueBaseProps {
  operator: FOperator;
  value: string[] | null;
}

export interface IFilterDateProps extends IFilterValueBaseProps {
  operator: FOperator;
  value: string[] | null;
}
