import { ReactEditor } from 'slate-react';
import { IMetaEditor, IEditorMeta } from '../interface/editor';

export const defaultMeta: IEditorMeta = {
  imageSize: 0,
};

export const withMeta = <T extends ReactEditor>(inEditor: T) => {
  const editor = inEditor as T & IMetaEditor;
  editor.meta = defaultMeta;
  const { onChange } = editor;

  editor.updateMeta = (key, v, op) => {
    const preValue = editor.meta[key] ?? 0;
    if (!op) {
      editor.meta[key] = v;
    } else {
      const next = op === 'desc' ? preValue - v : preValue + v;
      editor.meta[key] = next;
    }
    Promise.resolve(() => {
      onChange();
    });
  };

  editor.setMeta = meta => {
    editor.meta = meta;
    Promise.resolve(() => {
      onChange();
    });
  };

  editor.resetMeta = () => {
    editor.meta = defaultMeta;
    // editor.onChange();
  };

  return editor;
};
