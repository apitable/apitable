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

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';
import { DeleteOutlined } from '@apitable/icons';
import { IElement, IElementRenderProps } from '../../interface/element';
import styles from './divider.module.less';

const Divider = React.memo(({ children, element }: IElementRenderProps<IElement>) => {
  const readOnly = useReadOnly();
  const editor = useSlate() as ReactEditor;

  const handleDelete = useCallback(() => {
    try {
      const path = ReactEditor.findPath(editor, element);
      Transforms.removeNodes(editor, { at: path });
    } catch (error) {
      console.log(error);
    }
  }, [editor, element]);

  const DotList = useMemo(() => {
    return Array(4)
      .fill('')
      .map((_item, idx) => <i key={idx} className={styles.dot} />);
  }, []);

  return (
    <div className={styles.wrap}>
      <div contentEditable={false} className={styles.divider}>
        {DotList}
        {!readOnly && <DeleteOutlined className={styles.deleteBtn} onClick={handleDelete} />}
      </div>
      {children}
    </div>
  );
});

export default Divider;
