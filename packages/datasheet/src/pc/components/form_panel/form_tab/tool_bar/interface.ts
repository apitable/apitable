import { IFormProps } from '@vikadata/core';

export interface IToolBarBase {
  formId: string;
  formProps: IFormProps,
  updateProps: (props: Object) => void,
}