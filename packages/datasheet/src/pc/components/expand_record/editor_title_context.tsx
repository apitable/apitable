import { IFuncUpdater } from 'ahooks/lib/createUseStorageState';
import { createContext } from 'react';
import { IFieldDescCollapseStatus } from './field_editor';

interface IEditorTitleContext {
  updateFocusFieldId: (fieldId: string | null) => void;
  fieldDescCollapseStatusMap: IFieldDescCollapseStatus | undefined;
  setFieldDescCollapseStatusMap: (value: IFieldDescCollapseStatus | IFuncUpdater<IFieldDescCollapseStatus>) => void;
}

const EditorTitleContext = createContext({} as IEditorTitleContext);

export default EditorTitleContext;
