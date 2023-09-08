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

import { useRef, useEffect } from 'react';
import { Range, Editor } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { ScreenSize } from 'pc/components/common/component_display';
import { Portal } from 'pc/components/portal';
import { useResponsive } from 'pc/hooks';
import { Z_INDEX, DISABLE_TOOLBAR_ELEMENT } from '../../constant';
import { getValidSelection, getValidPopupPosition, getCurrentElement } from '../../helpers/utils';
import { IEventBusEditor } from '../../interface/editor';
import { BUILT_IN_EVENTS } from '../../plugins/withEventBus';
import { Toolbar } from '../toolbar';

import styles from './style.module.less';

export const HoveringToolbar = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlate() as ReactEditor & IEventBusEditor;
  const timer = useRef<number | null>(null);
  const hideByEventRef = useRef(false);

  const { screenIsAtLeast } = useResponsive();

  useEffect(() => {
    const el = wrapRef.current;
    const selection = getValidSelection(editor);
    if (editor.selection) {
      hideByEventRef.current = false;
    }
    if (!el || hideByEventRef.current) {
      return;
    }
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    const curElement = getCurrentElement(editor);
    if (!curElement || DISABLE_TOOLBAR_ELEMENT[curElement.type] || !screenIsAtLeast(ScreenSize.sm)) {
      el.removeAttribute('style');
      return;
    }

    timer.current = window.setTimeout(() => {
      timer.current = null;
      if (!selection || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
        el.removeAttribute('style');
        return;
      }

      try {
        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rect = domRange.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const popupRect = el.getBoundingClientRect();
        const position = getValidPopupPosition({
          anchor: rect,
          popup: el.getBoundingClientRect(),
          offset: { x: 0, y: -5 - popupRect.height },
          align: ['center', 'top'],
        });
        el.style.opacity = '1';
        el.style.top = `${position.top}px`;
        el.style.left = `${position.left}px`;
      } catch (error) {
        console.log(error);
      }
    }, 200);
  });

  useEffect(
    () => () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    },
    [],
  );

  useEffect(() => {
    const hide = () => {
      hideByEventRef.current = true;
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      const el = wrapRef.current;
      if (!el) {
        return;
      }
      el.removeAttribute('style');
    };
    editor.on(BUILT_IN_EVENTS.EDITOR_SCROLL, hide);
    editor.on(BUILT_IN_EVENTS.CLOSE_HOVERING_TOOLBAR, hide);
    return () => {
      editor.off(BUILT_IN_EVENTS.EDITOR_SCROLL, hide);
      editor.off(BUILT_IN_EVENTS.CLOSE_HOVERING_TOOLBAR, hide);
    };
  }, [editor]);

  return (
    <Portal zIndex={Z_INDEX.HOVERING_TOOLBAR}>
      <div className={styles.wrap} ref={wrapRef}>
        <Toolbar borderLess />
      </div>
    </Portal>
  );
};
