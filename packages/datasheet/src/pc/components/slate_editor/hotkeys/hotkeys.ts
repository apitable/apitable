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

import { throttle, omit } from 'lodash';
import { Editor, Range, Point, Transforms, Node, Element } from 'slate';
import { toggleMark, toggleBlock, removeAllMarks, addElementsIndent, descElementIndent, setNodeWithNewId, updateElementData } from '../commands';
import { MarkType, ElementType, LIST_ITEM_TYPE_DICT, LIST_TYPE_DICT, DISABLE_TOOLBAR_ELEMENT, ALIGN } from '../constant';
import { GENERATOR, generateId } from '../elements';
import { getCurrentElement, getMarkValue } from '../helpers/utils';
import { IEventBusEditor, IVikaEditor } from '../interface/editor';
import { IElement, IElementData } from '../interface/element';
import { BUILT_IN_EVENTS } from '../plugins/withEventBus';

import { hotkeyMap } from './map';

const HEADING_MAP = {
  1: ElementType.HEADING_ONE,
  2: ElementType.HEADING_TWO,
  3: ElementType.HEADING_THREE,
  4: ElementType.HEADING_FOUR,
  5: ElementType.HEADING_FIVE,
  6: ElementType.HEADING_SIX,
};

export const hotkeys = {
  [hotkeyMap[MarkType.BOLD].keyboard]: {
    action(editor: Editor) {
      toggleMark(editor, MarkType.BOLD);
      return false;
    },
  },
  [hotkeyMap[MarkType.ITALIC].keyboard]: {
    action(editor: Editor) {
      toggleMark(editor, MarkType.ITALIC);
      return false;
    },
  },
  [hotkeyMap[MarkType.UNDERLINE].keyboard]: {
    action(editor: Editor) {
      toggleMark(editor, MarkType.UNDERLINE);
      return false;
    },
  },
  [hotkeyMap[MarkType.STRIKE_THROUGH].keyboard]: {
    action(editor: Editor) {
      toggleMark(editor, MarkType.STRIKE_THROUGH);
      return false;
    },
  },
  [hotkeyMap[MarkType.INLINE_CODE].keyboard]: {
    action(editor: Editor) {
      toggleMark(editor, MarkType.INLINE_CODE);
      return false;
    },
  },
  [hotkeyMap[MarkType.HIGHLIGHT].keyboard]: {
    action(editor: Editor) {
      const hasHighlight = getMarkValue(editor, MarkType.HIGHLIGHT) != null;
      if (hasHighlight) {
        Editor.removeMark(editor, MarkType.HIGHLIGHT);
      } else {
        Editor.addMark(editor, MarkType.HIGHLIGHT, 0);
      }
      return false;
    },
  },
  [hotkeyMap[ElementType.LINK].keyboard]: {
    action(editor: Editor & IEventBusEditor) {
      const { selection } = editor;
      if (selection && Range.isExpanded(selection)) {
        editor.dispatch(BUILT_IN_EVENTS.OPEN_LINK_INPUT_PANEL);
      }
      return false;
    },
  },
  [hotkeyMap[ElementType.PARAGRAPH].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.PARAGRAPH);
      return false;
    },
  },
  [hotkeyMap[ElementType.HEADING_ONE].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.HEADING_ONE);
      return false;
    },
  },
  [hotkeyMap[ElementType.HEADING_TWO].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.HEADING_TWO);
      return false;
    },
  },
  [hotkeyMap[ElementType.HEADING_THREE].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.HEADING_THREE);
      return false;
    },
  },
  [hotkeyMap[ElementType.UNORDERED_LIST].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.UNORDERED_LIST);
      return false;
    },
  },
  [hotkeyMap[ElementType.ORDERED_LIST].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.ORDERED_LIST);
      return false;
    },
  },
  [hotkeyMap[ElementType.QUOTE].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.QUOTE);
      return false;
    },
  },
  [hotkeyMap[ElementType.TASK_LIST].keyboard]: {
    action(editor: Editor) {
      toggleBlock(editor, ElementType.TASK_LIST);
      return false;
    },
  },
  return: {
    action: throttle((editor: Editor & IVikaEditor) => {
      const { selection } = editor;
      const splitNodes = (data = {}) => {
        Transforms.splitNodes(editor);
        setNodeWithNewId(editor, { type: ElementType.PARAGRAPH, data });
      };
      // Disable shortcut insertion panel in wake-up state
      if (editor.hasInsertPanel || editor.hasMentionPanel) {
        return false;
      }
      if (selection) {
        removeAllMarks(editor);
        if (!Range.isCollapsed(selection)) {
          splitNodes();
          return false;
        }
        const [focusPoint] = Range.edges(selection);
        const [match] = Editor.nodes(editor, {
          at: focusPoint,
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
          // reverse: true,
          mode: 'lowest',
        });
        if (match) {
          const [_node, path] = match;
          const node = _node as IElement;
          const nodeText = Node.string(node);
          const isListItem = LIST_ITEM_TYPE_DICT[node.type];
          if (Range.isCollapsed(selection) && !nodeText && isListItem) {
            toggleBlock(editor, node.type);
            return false;
          }
          const [startPoint, endPoint] = Editor.edges(editor, path);
          const nextPoint = Editor.after(editor, focusPoint);
          const isEnd = Point.equals(focusPoint, endPoint);
          const isStart = Point.equals(focusPoint, startPoint);
          const nextIsEnd = nextPoint && Point.equals(endPoint, nextPoint);
          const newNodeData = isListItem ? omit({ ...node.data }, 'checked') : {};
          if (isEnd || isStart) {
            const newNode = isListItem ? GENERATOR[node.type]({ data: newNodeData }) : GENERATOR.paragraph({ data: newNodeData });
            Transforms.insertNodes(editor, newNode);
          } else {
            splitNodes(newNodeData);
          }
          if ((isStart && nodeText !== '') || nextIsEnd) {
            Transforms.move(editor, { distance: 1, unit: 'line' });
          }
          return false;
        }
      }
      return true;
    }, 300),
  },
  'shift+return': {
    action: throttle((editor: Editor) => {
      const { selection } = editor;
      const unwrapNodes = () => {
        Transforms.unwrapNodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) && LIST_TYPE_DICT[(n as IElement).type],
          split: true,
        });
      };
      if (selection) {
        const match = Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
          mode: 'lowest',
        });
        if (match) {
          const [matchNode] = match;
          // const isMatchList = matchNode && LIST_ITEM_TYPE_DICT[(matchNode as unknown as IElement).type];
          if (!matchNode) {
            return true;
          }
          const [, path] = matchNode;
          // Cursor at the beginning or end of a paragraph
          if (Range.isCollapsed(selection)) {
            const focusPoint = selection.focus;
            const [startPoint, endPoint] = Editor.edges(editor, path);
            const isEnd = Point.equals(focusPoint, endPoint);
            const isStart = Point.equals(focusPoint, startPoint);
            if (isStart || isEnd) {
              Transforms.insertNodes(editor, GENERATOR.paragraph({}));
              if (isStart) {
                Transforms.move(editor, { distance: 1, unit: 'line' });
              }
              unwrapNodes();
              Transforms.setNodes(editor, { type: ElementType.PARAGRAPH, data: {} } as IElement);
              return false;
            }
          }
          // Range selection or cursor in the middle of the text
          try {
            Transforms.splitNodes(editor);
            unwrapNodes();
            Transforms.setNodes(editor, { type: ElementType.PARAGRAPH, data: {}, _id: generateId() } as IElement);
          } catch (error) {
            console.log(error);
          }
          return false;
        }
      }
      return true;
    }, 300),
  },
  space: {
    action(editor: Editor & IVikaEditor) {
      const { selection, mode } = editor;
      // Lite mode does not need to support markdown syntax to switch text styles
      if (mode === 'lite') {
        return true;
      }
      if (selection && Range.isCollapsed(selection)) {
        // Disable shortcut insertion panel in wake-up state
        if (editor.hasInsertPanel || editor.hasMentionPanel) {
          return false;
        }
        const textNodePath = [...selection.anchor.path];
        const elementPath = textNodePath.slice(0, -1);
        const element = Node.get(editor, elementPath) as IElement;
        const elementText = Node.string(element);
        let elementType = element.type;
        let elementData = {} as IElementData;
        switch (true) {
          // Level headings Corresponding markdown format definition https://spec.commonmark.org/0.29/#atx-heading
          case /^#{1,6}$/.test(elementText): {
            elementType = HEADING_MAP[elementText.length];
            break;
          }
          // Unordered list Corresponds to markdown format definition https://spec.commonmark.org/0.29/#lists
          case /^(\*|-|\+)$/.test(elementText): {
            elementType = ElementType.UNORDERED_LIST;
            break;
          }
          // Ordered list Corresponds to markdown format definition https://spec.commonmark.org/0.29/#lists
          case /^\d\.$/.test(elementText): {
            elementType = ElementType.ORDERED_LIST;
            break;
          }
          case /^```(\w*)$/.test(elementText): {
            elementType = ElementType.CODE_BLOCK_WRAP;
            if (RegExp.$1) {
              elementData = { lang: RegExp.$1 };
            }
            break;
          }
          case /^\[\]$/.test(elementText): {
            elementType = ElementType.TASK_LIST;
            break;
          }
          // Cite https://spec.commonmark.org/0.29/#block-quotes
          case /^>$/.test(elementText): {
            elementType = ElementType.QUOTE;
            break;
          }
          case /^---|\*\*\*$/.test(elementText): {
            elementType = ElementType.DIVIDER;
            break;
          }
          default:
            break;
        }
        if (elementType !== element.type && element.type === ElementType.PARAGRAPH) {
          Transforms.delete(editor, { distance: 1, unit: 'word', at: textNodePath });
          const point = { path: textNodePath, offset: 0 };
          Transforms.select(editor, point);
          Transforms.setNodes(editor, { data: elementData, type: elementType } as IElement);
          switch (elementType) {
            case ElementType.TASK_LIST:
              Transforms.select(editor, elementPath);
              Transforms.collapse(editor, { edge: 'end' });
              break;
            case ElementType.DIVIDER:
              Transforms.move(editor, { distance: 1, unit: 'line' });
              break;

            default:
              break;
          }
          return false;
        }
      }
      return true;
    },
  },
  tab: {
    action: throttle((editor: Editor) => {
      const { selection } = editor;
      if (!selection) {
        return true;
      }
      addElementsIndent(editor);
      return false;
    }, 300),
  },
  'shift+tab': {
    action: throttle((editor: Editor) => {
      const { selection } = editor;
      if (!selection) {
        return true;
      }
      descElementIndent(editor);
      return false;
    }, 300),
  },
  '/': {
    action(editor: Editor & IEventBusEditor & IVikaEditor) {
      const { selection, mode } = editor;
      if (selection && Range.isCollapsed(selection) && mode === 'full') {
        const curElement = getCurrentElement(editor);
        if (!DISABLE_TOOLBAR_ELEMENT[curElement.type]) {
          editor.dispatch(BUILT_IN_EVENTS.TOGGLE_INSERT_PANEL, true);
        }
      }
      return true;
    },
  },
  'mod+shift+l': {
    action(editor: Editor & IVikaEditor) {
      const { selection, mode } = editor;
      if (selection && mode === 'full') {
        updateElementData(editor, { align: ALIGN.LEFT });
        return false;
      }
      return true;
    },
  },
  'mod+shift+c': {
    action(editor: Editor & IVikaEditor) {
      const { selection, mode } = editor;
      if (selection && mode === 'full') {
        updateElementData(editor, { align: ALIGN.CENTER });
        return false;
      }
      return true;
    },
  },
  'mod+shift+r': {
    action(editor: Editor & IVikaEditor) {
      const { selection, mode } = editor;
      if (selection && mode === 'full') {
        updateElementData(editor, { align: ALIGN.RIGHT });
        return false;
      }
      return true;
    },
  },
};
