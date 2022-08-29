import { IFormProps } from '@vikadata/core';

export enum IModeEnum {
  Preview = 'Preview',
  Edit = 'Edit'
}

export interface IBasePropEditorProps {
  formId: string;
  mode: IModeEnum;
  updateProps: (props: Partial<IFormProps>) => void;
}