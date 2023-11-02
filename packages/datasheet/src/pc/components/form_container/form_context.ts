/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { createContext } from 'react';
import { IFormProps } from '@apitable/core';

export interface IFormContext {
  mount: boolean;
  formProps: IFormProps;
  formData: { [key: string]: any };
  formErrors: { [key: string]: any };
  setFormData: (fieldId: string, value: any) => void;
  setFormErrors: (fieldId: string, errMsg: string) => void;
  setFormToStorage?: (fieldId: string, value: string) => void;
  showWorkdoc: boolean;
  setShowWorkdoc: (show: boolean) => void;
}

export const FormContext = createContext({} as IFormContext);
