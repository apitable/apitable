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

import { message } from 'antd';
import { Transforms, Text, Range, Editor, Element, Point, Path, Node, Selection, Operation } from 'slate';
import { ReactEditor } from 'slate-react';

import * as API from '../api';
import { wrapLink, insertBlockElement, descElementIndent, updateElementData, insertImage, updateImage, toggleBlock } from '../commands';
import { NodeType, LIST_TYPE_DICT, LIST_ITEM_TYPE_DICT, ALIGN, ElementType, IS_WRAP } from '../constant';
import { GENERATOR, uniqueElement, generateId } from '../elements';
import { isUrl, isImage, getImgData } from '../helpers/utils';
import { IVikaEditor, IEventBusEditor, IMetaEditor } from '../interface/editor';
import { IElement } from '../interface/element';

export const withVika = <T extends ReactEditor>(inEditor: T) => {
  const editor = inEditor as T & IVikaEditor & IEventBusEditor & IMetaEditor;
  const { deleteBackward, isInline, isVoid, insertData, insertText, normalizeNode, onChange, apply } = editor;

  // Record whether the current editor wakes up the insertion surface
  editor.hasInsertPanel = false;

  // Record whether the current editor wakes up the mention panel
  editor.hasMentionPanel = false;

  // Record the current editor mode
  editor.mode = 'full';

  // Record whether or not it is in IME combination input mode
  editor.isComposing = false;

  editor.onChange = (...params) => {
    // Record the last selection value to ensure that the new node is inserted in the correct position after the editor loses focus,
    // for example, by adding a new link element
    if (editor.selection) {
      editor.lastSelection = editor.selection as unknown as Selection;
    }
    onChange(...params);
  };

  editor.isInline = (element) => {
    return (element as IElement).object === NodeType.INLINE || isInline(element);
  };

  editor.isVoid = (element) => {
    return (element as IElement).isVoid || isVoid(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      if (isImage(text)) {
        insertBlockElement(editor, GENERATOR.image({ data: { url: text } }));
      } else {
        wrapLink(editor, text);
      }
    } else {
      insertText(text);
    }
  };

  editor.apply = (params) => {
    const { type, properties, ...others } = params as Operation & { properties?: IElement };
    if (type === 'remove_node') {
      const node = (others as any).node as IElement;
      if (node.type === ElementType.IMAGE && node.data.size) {
        editor.updateMeta('imageSize', node.data.size as number, 'desc');
      }
    }
    // Ensure that each node has a unique id
    if (type === 'split_node' && properties && properties._id) {
      properties._id = generateId();
      apply({ type, properties, ...others } as any);
    } else {
      apply(params);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    let editorData = data.getData('application/vika-editor-data');
    const hasVikaData = !!editorData;
    const slateData = data.getData('application/x-slate-fragment');
    const files = data.files;
    // Text as url
    if (text && isUrl(text)) {
      // if (isImage(text)) {
      //   insertBlockElement(editor, GENERATOR.image({ data: { url: text }}));
      // } else {
      // }
      wrapLink(editor, text);
      return;
    }
    // With editor-defined data
    if (editorData || slateData) {
      editorData = editorData || slateData;
      let elements: any = [];
      try {
        elements = JSON.parse(decodeURIComponent(window.atob(editorData)));
        elements = uniqueElement(elements);
      } catch (error) {
        console.log(error);
      }
      if (hasVikaData) {
        // This behavior is to start another block and copy the content to the new block,
        // mainly for operation scenarios where the editor is tapped to copy the node (code block copy, etc.)
        Transforms.insertNodes(editor, elements);
      } else {
        // This behavior is to extract plain text from the first node and paste it to the current cursor,
        // the other nodes are inserted as block-level elements, mainly for performing ctrl+c ctrl+v operations in the editor.
        if (Array.isArray(elements)) {
          elements = elements.filter((node) => !node.isVoid);
        }
        Transforms.insertFragment(editor, elements);
      }
      return;
    }
    if (files && files.length > 0) {
      const uploader = API.getApi(editor, API.ApiKeys.ImageUpload);
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            (file as any).preview = url;
            const imgData = getImgData(file, url as string);
            if (uploader) {
              Transforms.insertNodes(editor, GENERATOR.image({}));
              uploader(file)
                .then((res: API.IImageResponse) => {
                  updateImage(editor, { ...imgData, url: res.imgUrl });
                })
                .catch((err: any) => {
                  message.error(err);
                });
            } else {
              insertImage(editor, imgData);
            }
          });

          reader.readAsDataURL(file);
        }
      }
      return;
    }
    insertData(data);
  };

  editor.deleteBackward = (params) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, { match: (n) => Editor.isBlock(editor, n) && Element.isElement(n), mode: 'lowest' });
      if (match) {
        const [_n, path] = match;
        const blockStartPoint = Editor.start(editor, path);
        const [start] = Range.edges(selection);

        if (Point.equals(start, blockStartPoint)) {
          const node = _n as unknown as IElement;
          const nodeData = node.data || {};
          if (nodeData.indent) {
            descElementIndent(editor);
            return;
          }
          if (nodeData.align && nodeData.align !== ALIGN.LEFT) {
            const next = ALIGN.RIGHT === nodeData.align ? ALIGN.CENTER : ALIGN.LEFT;
            updateElementData(editor, { align: next }, path, false);
            return;
          }
          // The previous element is of type void
          if (path[path.length - 1] !== 0) {
            const prevPath = Path.previous(path);
            const prevNode = Node.get(editor, prevPath) as IElement;
            if (prevNode && prevNode.isVoid) {
              Transforms.select(editor, prevPath);
              return;
            }
          }
          // Elements that are not of the initial paragraph type and are not code blocks or inline forms
          if (!node.isVoid && node.type !== ElementType.PARAGRAPH && node.type !== ElementType.CODE_BLOCK) {
            toggleBlock(editor, ElementType.PARAGRAPH);
            return;
          }
        }
      }
    }

    deleteBackward(params);
  };

  editor.normalizeNode = (params) => {
    const [_node, path] = params;
    const node = _node as IElement;
    const listItemType = LIST_TYPE_DICT[node.type];
    const isListItem = LIST_ITEM_TYPE_DICT[node.type];

    const isWrap = IS_WRAP[node.type];

    if (path.length === 0) {
      // Make sure there is always a blank node at the end for easy editing
      const lastIndex = editor.children.length - 1;
      const lastNode = editor.children[lastIndex] as IElement;
      if (lastIndex === -1 || (lastNode && (lastNode.type !== ElementType.PARAGRAPH || Node.string(lastNode)))) {
        Transforms.insertNodes(editor, GENERATOR.paragraph({}, []), { at: [lastIndex + 1] });
      }

      // Make sure the first element is not of type void,
      // as of slate-react version 0.6.4 the first element is of type void and crashes in read-only rendering
      const firstNode = editor.children[0] as IElement;
      if (firstNode && firstNode.isVoid) {
        Transforms.insertNodes(editor, GENERATOR.paragraph({}, []), { at: [0] });
      }
    }
    // The outermost node is a text node type
    if ((node as unknown as Text).text != null && !node._id && path.length === 1) {
      Transforms.wrapNodes(editor, GENERATOR.paragraph({}, []), { at: path });
    }
    // Ensure that the child nodes of the list are the correct list item elements
    if (listItemType) {
      const children = node.children;
      children.forEach((_child, idx) => {
        const child = _child as IElement;
        if (child && child.type !== listItemType) {
          const childPath = [...path, idx];
          if (Text.isText(child) || child.object === NodeType.INLINE) {
            const generator = GENERATOR[listItemType] || GENERATOR.listItem;
            Transforms.wrapNodes(editor, generator({}, []), { at: childPath });
          } else {
            Transforms.setNodes(editor, { type: listItemType } as Partial<IElement>, { at: childPath });
          }
        }
      });
    }
    // If a list type element is not inside a list wrapper element, convert it to a normal text element
    if (isListItem) {
      try {
        const parent = Node.parent(editor, path) as IElement | null;
        if (parent && !LIST_TYPE_DICT[parent.type]) {
          Transforms.setNodes(editor, { type: ElementType.PARAGRAPH, data: {} } as Partial<IElement>, { at: path });
        }
      } catch (error) {
        console.log(error);
      }
    }

    // Ensure that the child nodes of elements that cannot contain block-level elements can only be nodes of type Text
    if (!isWrap && !Editor.isEditor(node) && node.object === NodeType.BLOCK) {
      const children = node.children || [];
      children.forEach((_child, idx) => {
        const child = _child as IElement;
        if (child && child.object === NodeType.BLOCK) {
          Transforms.unwrapNodes(editor, { at: [...path, idx] });
        }
      });
    }
    // Ensure that images are not wrapped by other block-level elements
    if (node.type === ElementType.IMAGE && path.length > 1) {
      let parentPath = Path.parent(path);
      let parentNode: IElement | null = Node.get(editor, parentPath) as IElement;
      while (parentNode && parentNode.type !== ElementType.TABLE_CELL) {
        Transforms.unwrapNodes(editor, { at: parentPath });
        if (parentPath.length > 1) {
          parentPath = Path.parent(parentPath);
          parentNode = Node.get(editor, parentPath) as IElement;
        } else {
          parentNode = null;
        }
      }
    }
    normalizeNode(params);
  };

  return editor;
};
