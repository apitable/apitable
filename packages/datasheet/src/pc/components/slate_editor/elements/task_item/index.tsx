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

import { useCallback, useMemo } from 'react';
import { useSlate, ReactEditor, useReadOnly } from 'slate-react';
// import { Transforms } from 'slate';
import { updateElementData } from '../../commands';
import { Checkbox } from '../../components/checkbox';

import { IElementRenderProps, IElement, ITaskElementData } from '../../interface/element';

import Decorate from '../element_decorate';
import styles from './task_item.module.less';

const TaskItem = (props: IElementRenderProps<IElement<ITaskElementData>>) => {
  const editor = useSlate() as ReactEditor;
  const { children, attributes, element } = props;
  const data = useMemo(() => element.data || {}, [element.data]);
  const checked = data.checked;
  const readOnly = useReadOnly();

  const handleChange = useCallback(
    (next: any) => {
      try {
        const path = ReactEditor.findPath(editor, element);
        updateElementData(editor, { ...data, checked: next }, path, false);
        // if (!next) {
        //   Transforms.collapse(editor, { edge: 'end' });
        // }
      } catch (error) {
        console.log(error);
      }
    },
    [data, editor, element],
  );

  return (
    <Decorate element={element} indentProperty="marginLeft">
      <dd {...attributes} className={styles.taskItem} data-completed={checked}>
        <span contentEditable={false} className={styles.checkboxWrap}>
          <Checkbox size={16} disabled={readOnly} checked={checked} onChange={handleChange} />
        </span>
        {children}
      </dd>
    </Decorate>
  );
};

export default TaskItem;
