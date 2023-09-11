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

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as React from 'react';

import { Transforms } from 'slate';
import { useSlate, ReactEditor, useReadOnly } from 'slate-react';
import { MemberItem } from 'pc/components/multi_grid/cell/cell_member/member_item';
import { IElement, IElementRenderProps, IMentionElementData } from '../../interface/element';

import styles from './mention.module.less';

const Mention = React.memo(({ children, element, attributes }: IElementRenderProps<IElement<IMentionElementData>>) => {
  const elementData = useMemo(() => element.data || {}, [element.data]);
  const editor = useSlate() as ReactEditor;
  const readOnly = useReadOnly();
  const timer = useRef<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      if (readOnly) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      try {
        const path = ReactEditor.findPath(editor, element);
        ReactEditor.focus(editor);
        Transforms.select(editor, path);
        /**
         * Insert a space by default when inserting, so the cursor goes back two frames
         * No asynchronous immediately back, most of the time the cursor back in the target element of the last two frames flash,
         * and then focus on the clicked element, add the eventDefault also failed to prevent, to be studied ...
         */
        timer.current = window.setTimeout(() => {
          Transforms.move(editor, { distance: 2, unit: 'offset' });
          timer.current = null;
        }, 300);
      } catch (error) {
        console.log(error);
      }
    },
    [editor, element, readOnly],
  );

  /**
   * The main solution: adding the asynchronous setting of the cursor position may cause the cursor position to jump around
   * Scenario: input immediately after clicking, at this time the cursor position behind the input character,
   * when the setTimeout expires the cursor will move back two frames, listen to the keyboard input to cancel the asynchronous movement of the cursor
   */
  useEffect(() => {
    const clearTimeout = () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
    document.addEventListener('keydown', clearTimeout);

    return () => {
      document.removeEventListener('keydown', clearTimeout);
      clearTimeout();
    };
  }, []);

  const adjustStyle: React.CSSProperties = elementData.avatar ? {} : { top: 0 };

  return (
    <span {...attributes} className={styles.wrap} onMouseDownCapture={handleMouseDown}>
      <span contentEditable={false} className={styles.mention} style={adjustStyle}>
        {/* Style needs to be adjusted: poor display under different headings */}
        <MemberItem unitInfo={elementData} style={{ margin: 0 }} />
      </span>
      {children}
    </span>
  );
});

export default Mention;
