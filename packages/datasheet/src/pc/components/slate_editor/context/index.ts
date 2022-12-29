import { createContext } from 'react';
import i18nText from '../strings';

export const EditorContext = createContext({
  i18nText,
  operationAble: true,
  placeholder: '',
  mode: 'full',
});
