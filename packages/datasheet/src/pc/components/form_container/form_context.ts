import { IFormProps } from '@apitable/core';
import { createContext } from 'react';

export interface IFormContext {
  formProps: IFormProps;
  formData: { [key: string]: any };
  formErrors: { [key: string]: any };
  setFormData: (fieldId, value) => void;
  setFormErrors: (fieldId: string, errMsg: string) => void;
  setFormToStorage?: (fieldId: string, value: string) => void;
}

export const FormContext = createContext({} as IFormContext);