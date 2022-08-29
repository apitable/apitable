import { Editor, Transforms, Element as SlateElement, Range, Location as SlateLocation, Path, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import clamp from 'lodash/clamp';

import { isMarkActive, isBlockActive, getValidSelection, getCurrentElement, defaultSelection } from '../helpers/utils';

import { ElementType, LIST_TYPE_DICT, MAX_INDENT } from '../constant';

import { IElement, IElementData, IImageElementData } from '../interface/element';
import { IMetaEditor } from '../interface/editor';
import { GENERATOR, generateId } from '../elements/generator';

// mark 切换
export const toggleMark = (editor: Editor, format: string, value: boolean | number | string = true) => {
  const isActive = isMarkActive(editor, format, value);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, value);
  }
};

// 元素类型切换
export const toggleBlock = (editor, block) => {
  ReactEditor.focus(editor);
  const isActive = isBlockActive(editor, block);
  const nextBlock = isActive ? ElementType.PARAGRAPH : block;
  const isList = LIST_TYPE_DICT[nextBlock];
  const validSection = getValidSelection(editor) ;
  
  Transforms.select(editor, validSection);
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPE_DICT[(n as IElement).type],
    split: true,
  });
  const newProperties: Partial<IElement> = {
    type: isList ? ElementType.LIST_ITEM : nextBlock,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, GENERATOR.listWrap(nextBlock, {}, []));
  }
};

export const removeAllMarks = (editor: Editor) => {
  const marks = editor.marks;
  // 暂不确定，直接赋值editor.marks = {} 是否会有其他影响 
  if (marks) {
    for (const key in marks) {
      editor.removeMark(key);
    }
  }
};

export const updateElementData = (editor, partialData: IElementData, location?: SlateLocation, autoSelect = true) => {
  ReactEditor.focus(editor);
  try {
    const validSection = location || getValidSelection(editor) ;
    if (autoSelect) {
      Transforms.select(editor, validSection);
    }
    const curElement = getCurrentElement(editor, validSection);
    const newData = { ...curElement.data, ...partialData };
    Transforms.setNodes(editor, { data: newData } as Partial<IElement>, { at: validSection } );
  } catch (error) {
    console.log(error);
  }
};

const changeElementIndent = (editor: Editor, isAdd) => {
  const validSection = getValidSelection(editor);
  const step = isAdd ? 1 : -1;
  // To do 多层嵌套的时候会有多次缩进的问题，待解决
  const nodes = Editor.nodes(
    editor,
    { at: validSection, match: (node) => SlateElement.isElement(node) && !LIST_TYPE_DICT[(node as IElement).type] }
  );
  for (const [node, path] of nodes) {
    const nodeData = (node as IElement).data ?? {};
    let nextIndent = (nodeData.indent ?? 0) + step;
    nextIndent = clamp(nextIndent, 0, MAX_INDENT);
    const newData = { ...nodeData, indent: nextIndent };
    Transforms.setNodes(editor, { data: newData } as Partial<IElement>, { at: path });
  }
};

export const addElementsIndent = (editor: Editor) => {
  changeElementIndent(editor, true);
};

export const descElementIndent = (editor: Editor) => {
  changeElementIndent(editor, false);
};

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && (n as IElement).type === ElementType.LINK,
  });
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && (n as IElement).type === ElementType.LINK,
  });
};

export const wrapLink = (editor: Editor, url: string, text?: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const textNode = GENERATOR.text({ text: !isCollapsed ? '' : text ?? url });
  const link = GENERATOR.link({ data: { link: url }}, textNode);

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const insertLink = (editor: Editor, url: string, text: string) => {
  if (editor.selection) {
    wrapLink(editor, url, text);
  }
};

export const setNodeWithNewId = (editor: Editor, partialElement: Partial<IElement>, options?) => {
  Transforms.setNodes(editor, { ...partialElement, _id: generateId() } as IElement, options);
};

export const restoreEditorSelection = (editor: ReactEditor) => {
  const validSection = getValidSelection(editor);
  ReactEditor.focus(editor);
  try {
    Transforms.select(editor, validSection);
  } catch (err) {
    Transforms.select(editor, defaultSelection);
  }
};

export const insertBlockElement = (editor: Editor, element: IElement, options: { [key: string]: unknown } = {}) => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) {
    return;
  }

  const [match] = Editor.nodes(editor,
    {
      match: (n) => !Editor.isEditor(n) && Editor.isBlock(editor, n) && SlateElement.isElement(n),
      mode: 'lowest'
    });
  if (!match) {
    return;
  }
  const [ele, path] = match;
  const eleText = Node.string(ele);
  let nextPath = path;
  if (eleText || (ele as IElement).isVoid) {
    nextPath = Path.next(path);
  }
  Transforms.insertNodes(editor, element, { ...options, at: nextPath });
  Transforms.select(editor, nextPath);
};

export const insertImage = (editor: Editor, imageData: IImageElementData, options?) => {
  Transforms.insertNodes(editor, GENERATOR.image({ data: imageData }), options);
  (editor as unknown as IMetaEditor).updateMeta('imageSize', imageData.size ?? 0, 'add');
};
export const updateImage = (editor: Editor, imageData: IImageElementData, path?, autoSelect = true) => {
  (editor as unknown as IMetaEditor).updateMeta('imageSize', imageData.size ?? 0, 'add');
  updateElementData(editor, imageData, path, autoSelect);
};