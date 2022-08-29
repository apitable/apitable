import { ReactEditor } from 'slate-react';
import { Transforms, Text, Range, Editor, Element, Point, Path, Node, Selection, Operation } from 'slate';

import { message } from 'antd';

import { isUrl, isImage, getImgData } from '../helpers/utils';
import { IElement } from '../interface/element';
import { NodeType, LIST_TYPE_DICT, LIST_ITEM_TYPE_DICT,ALIGN, ElementType, IS_WRAP } from '../constant';
import { wrapLink, insertBlockElement, descElementIndent, updateElementData, insertImage, updateImage, toggleBlock } from '../commands';
import { GENERATOR, uniqueElement, generateId } from '../elements';
import { IVikaEditor, IEventBusEditor, IMetaEditor } from '../interface/editor';
import * as API from '../api';

export const withVika = <T extends ReactEditor> (inEditor: T) => {
  const editor = inEditor as T & IVikaEditor & IEventBusEditor & IMetaEditor;
  const {
    deleteBackward,
    isInline,
    isVoid,
    insertData,
    insertText,
    normalizeNode,
    onChange,
    apply,
  } = editor;

  // 记录当前编辑器是否唤醒插入面
  editor.hasInsertPanel = false;

  // 记录当前编辑器是否唤醒提及面板
  editor.hasMentionPanel = false;

  // 记录当前编辑器的模式
  editor.mode = 'full';

  // 记录是否处于IME组合输入模式
  editor.isComposing = false;

  editor.onChange = (...params) => {
    // 记录最后一次selection值，确保编辑器失焦后能将新节点插入正确的位置，比如新加一个链接元素
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
        insertBlockElement(editor, GENERATOR.image({ data: { url: text }}));
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
    // 确保每一个节点都有唯一的id
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
    // 文本为url
    if (text && isUrl(text)) {
      // if (isImage(text)) {
      //   insertBlockElement(editor, GENERATOR.image({ data: { url: text }}));
      // } else {
      // }
      wrapLink(editor, text);
      return;
    }
    // 有编辑器自定义的数据
    if(editorData || slateData) {
      editorData = editorData || slateData;
      let elements: any = [];
      try {
        elements = JSON.parse(decodeURIComponent(window.atob(editorData)));
        elements = uniqueElement(elements);
      } catch (error) {
        console.log(error);
      }
      if (hasVikaData) {
        // 此行为是另起一个块，将内容复制到新块，主要是用于在编辑器点选复制节点的操作场景（代码块复制等）
        Transforms.insertNodes(editor, elements);
      } else {
        // 此行为是将第一个节点提取纯文本粘贴到当前的光标处，其他的节点当作块级元素插入，主要用于在编辑器执行ctrl+c ctrl+v操作。
        if (Array.isArray(elements)) {
          elements = elements.filter((node) => !node.isVoid);
        }
        Transforms.insertFragment(editor, elements);
      }
      return;
    }
    // 有图片文件
    if (files && files.length > 0) {
      const uploader = API.getApi(editor, API.ApiKeys.ImageUpload);
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            (file as any).preview = url;
            const imgData = getImgData(file, url);
            if (uploader) {
              Transforms.insertNodes(editor, GENERATOR.image({}));
              uploader(file)
                .then((res: API.IImageResponse) => {
                  updateImage(editor, { ...imgData, url: res.imgUrl });
                })
                .catch((err) => {
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
          // 有缩进
          if (nodeData.indent) {
            descElementIndent(editor);
            return ;
          }
          // 有对齐方式
          if (nodeData.align && nodeData.align !== ALIGN.LEFT) {
            const next = ALIGN.RIGHT === nodeData.align ? ALIGN.CENTER : ALIGN.LEFT;
            updateElementData(editor, { align: next }, path, false);
            return;
          }
          // 上一个元素为void类型
          if (path[path.length - 1] !== 0) {
            const prevPath = Path.previous(path);
            const prevNode = Node.get(editor, prevPath) as IElement;
            if (prevNode && prevNode.isVoid) {
              Transforms.select(editor, prevPath);
              return;
            }
          }
          // 不是初始的段落类型并且不是代码块或者是内嵌形式的元素
          if (
            !node.isVoid &&
            node.type !== ElementType.PARAGRAPH &&
            node.type !== ElementType.CODE_BLOCK
          ) {
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
    const node = _node as IElement ;
    const listItemType = LIST_TYPE_DICT[node.type];
    const isListItem = LIST_ITEM_TYPE_DICT[node.type];

    const isWrap = IS_WRAP[node.type];

    if (path.length === 0) {
      // 确保最后一直有一个空白节点便于编辑
      const lastIndex = editor.children.length - 1;
      const lastNode = editor.children[lastIndex] as IElement;
      if (lastIndex === -1 || (lastNode && (lastNode.type !== ElementType.PARAGRAPH || Node.string(lastNode) ))) {
        Transforms.insertNodes(editor, GENERATOR.paragraph({}, []), { at: [lastIndex + 1] });
      }

      // 确保第一个元素不为void类型，截至slate-react版本0.6.4第一个元素为void类型，在只读渲染时会crash
      const firstNode = editor.children[0] as IElement;
      if (firstNode && firstNode.isVoid) {
        Transforms.insertNodes(editor, GENERATOR.paragraph({}, []), { at: [0] });
      }
    }
    // 最外层节点为text节点类型
    if ((node as unknown as Text).text != null && !node._id && path.length === 1) {
      Transforms.wrapNodes(editor, GENERATOR.paragraph({}, []), { at: path });
    }
    // 确保列表的子节点为正确的列表项元素
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
    // 如果一个列表类型的元素不在列表包裹元素里面，将其转换为普通的文本元素
    if (isListItem) {
      try {
        const parent = Node.parent(editor, path) as IElement | null;
        if (parent && !LIST_TYPE_DICT[parent.type]) {
          Transforms.setNodes(editor, { type: ElementType.PARAGRAPH, data: {}} as Partial<IElement>, { at: path });
        }
      } catch (error) {
        console.log(error);
      }
    }

    // 确保不能包含块级元素的元素的子节点只能为Text类型的节点
    if (!isWrap && !Editor.isEditor(node) && node.object === NodeType.BLOCK) {
      const children = node.children || [];
      children.forEach((_child, idx) => {
        const child = _child as IElement;
        if (child && child.object === NodeType.BLOCK) {
          Transforms.unwrapNodes(editor, { at: [...path, idx] });
        }
      });
    }
    // 确保图片不被其他块级元素包裹
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
