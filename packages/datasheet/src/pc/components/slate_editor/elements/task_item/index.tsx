import { useCallback, useMemo } from 'react';
import { Checkbox } from '../../components/checkbox';
import { useSlate, ReactEditor, useReadOnly } from 'slate-react';
// import { Transforms } from 'slate';
import { updateElementData } from '../../commands';

import { IElementRenderProps, IElement, ITaskElementData } from '../../interface/element';

import styles from './task_item.module.less';

import Decorate from '../element_decorate';

const TaskItem = (props: IElementRenderProps<IElement<ITaskElementData>>) => {
  const editor = useSlate() as ReactEditor;
  const { children, attributes, element } = props;
  const data = useMemo(() => (element.data || {}), [element.data]);
  const checked = data.checked;
  const readOnly = useReadOnly();

  const handleChange = useCallback((next) => {
    try {
      const path = ReactEditor.findPath(editor, element);
      updateElementData(editor, { ...data, checked: next }, path, false);
      // if (!next) {
      //   Transforms.collapse(editor, { edge: 'end' });
      // }
    } catch (error) {
      console.log(error);
    }
  }, [data, editor, element]);

  return <Decorate element={element} indentProperty="marginLeft">
    <dd {...attributes} className={styles.taskItem} data-completed={checked}>
      <span contentEditable={false} className={styles.checkboxWrap}>
        <Checkbox size={16} disabled={readOnly} checked={checked} onChange={handleChange} />
      </span>
      {children}
    </dd>
  </Decorate>;
};

export default TaskItem;