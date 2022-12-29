import { IFormProps } from '@apitable/core';

export interface IToolBarBase {
  formId: string;
  formProps: IFormProps,
  updateProps: (props: Object) => void,
}