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

import cx from 'classnames';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { Range, Editor } from 'slate';
import { ReactEditor, useReadOnly, useSlate } from 'slate-react';

import { ScreenSize } from 'pc/components/common/component_display';
import { elementIsEmpty } from 'pc/components/slate_editor/helpers/utils';
import { useResponsive } from 'pc/hooks';
import { ALIGN, INDENT_SPACE, ElementType, BASIC_ELEMENT } from '../../constant';
import { EditorContext } from '../../context';

import { IEventBusEditor } from '../../interface/editor';
import { IElement } from '../../interface/element';
import { BUILT_IN_EVENTS } from '../../plugins/withEventBus';
import styles from './decorate.module.less';

interface IDecorateProps {
  element: IElement;
  // children: (renderProps, operation: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  indentProperty?: 'marginLeft' | 'paddingLeft';
  startIndent?: number;
  indentSpace?: number;
  operationClassName?: string;
  operationStyle?: React.CSSProperties;
}

const ElementDecorate = React.memo(
  ({
    children,
    element,
    className: propsClassName,
    style: propsStyle = {},
    indentProperty = 'paddingLeft',
    startIndent,
    indentSpace,
  }: IDecorateProps) => {
    const timer = useRef<null | number>(null);
    const [imeInputting, setImeInputting] = useState(false);
    const { i18nText, placeholder, mode } = useContext(EditorContext);
    const editor = useSlate() as ReactEditor & IEventBusEditor;
    const elementData = element.data;
    const isVoid = element.isVoid;
    const elementType = element.type;
    const readOnly = useReadOnly();
    const { screenIsAtLeast } = useResponsive();
    const isFullMode = mode === 'full' && screenIsAtLeast(ScreenSize.sm);

    const elementEmpty = useMemo(() => elementIsEmpty(element), [element]);

    const algin = useMemo(() => {
      if (!elementData.align) {
        return ALIGN.LEFT;
      }
      return elementData.align;
    }, [elementData.align]);

    const indentStyle = useMemo(() => {
      const style = {} as React.CSSProperties;
      if (elementData.indent) {
        style[indentProperty] = elementData.indent * (indentSpace || INDENT_SPACE) + (startIndent ?? 0);
      }
      return style;
    }, [elementData.indent, indentProperty, startIndent, indentSpace]);

    const placeholderVisible = useMemo(() => {
      try {
        const elementPath = ReactEditor.findPath(editor, element);
        const isBasicElement = BASIC_ELEMENT.includes(elementType);
        const topPath = elementPath[0];
        const { selection, children } = editor;
        if (imeInputting || readOnly) {
          return false;
        }
        // In the case of only one node, the placeholder needs to be displayed regardless of whether the editor is focused or not
        if (topPath === 0 && children.length === 1 && elementEmpty && isBasicElement) {
          return true;
        }
        // The node has text or is not the initial paragraph element and does not need to be displayed
        if (isVoid || !elementEmpty || elementType !== ElementType.PARAGRAPH || !isFullMode) {
          return false;
        }
        // No focus, or the focus is not closed
        if (!selection || !Range.isCollapsed(selection)) {
          return false;
        }

        const match = Editor.nodes(editor, {
          match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n),
        });

        if (!match) {
          return false;
        }
        const [[_node]] = match;
        const node = _node as unknown as IElement;

        if ((node.data.align && node.data.align !== ALIGN.LEFT) || node.data.indent) {
          return false;
        }

        if (node.type !== ElementType.PARAGRAPH || node._id !== element._id) {
          return false;
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
      // determine the need for the editor.selection dependency, editor for a memo cache object has been unchanged,
      // only the selection will change because the cursor changes
      // eslint-disable-next-line
    }, [isVoid, elementEmpty, elementType, editor, element, editor.selection, imeInputting, isFullMode, readOnly]);

    const placeholderText = useMemo(() => {
      const elementPath = ReactEditor.findPath(editor, element);
      const topPath = elementPath[0];
      // The first node needs to display the external incoming placeholder first
      if (topPath === 0) {
        return placeholder || i18nText.placeholder;
      }
      return i18nText.placeholder;
    }, [placeholder, element, i18nText.placeholder, editor]);

    useEffect(() => {
      return () => {
        if (timer.current) {
          window.clearTimeout(timer.current);
          timer.current = null;
        }
      };
    }, []);

    useEffect(() => {
      const handleImeInputStart = () => setImeInputting(true);
      const handleImeInputEnd = () => setImeInputting(false);

      editor.on(BUILT_IN_EVENTS.IME_INPUT_START, handleImeInputStart);
      editor.on(BUILT_IN_EVENTS.IME_INPUT_END, handleImeInputEnd);

      return () => {
        editor.off(BUILT_IN_EVENTS.IME_INPUT_START, handleImeInputStart);
        editor.off(BUILT_IN_EVENTS.IME_INPUT_END, handleImeInputEnd);
      };
    }, [editor]);

    const elementProps = {
      ...children.props,
      style: { ...indentStyle, ...propsStyle },
      className: cx(styles.elementDecorate, propsClassName, children.props.className),
      children: [
        children.props.children,
        !readOnly && placeholderVisible && (
          <span key="placeholder" data-visible={placeholderVisible} className={styles.placeholder} contentEditable={false}>
            {placeholderText}
          </span>
        ),
      ],
      'data-element-type': element.type,
      'data-node-type': element.object,
      'data-id': element._id,
      'data-align': algin,
    };
    return React.cloneElement(children, elementProps);
  },
);

export default ElementDecorate;
