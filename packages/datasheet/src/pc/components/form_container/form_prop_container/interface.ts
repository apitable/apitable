import { IFormProps } from '@apitable/core';

export enum IModeEnum {
  Preview = 'Preview',
  Edit = 'Edit'
}

export interface IBasePropEditorProps {
  formId: string;
  mode: IModeEnum;
  updateProps: (props: Partial<IFormProps>) => void;
}