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

  editor.setMeta = (meta) => {
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
