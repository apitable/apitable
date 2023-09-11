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

import isHotkey from 'is-hotkey';
import { Editor } from 'slate';
import { IVikaEditor, IEventBusEditor } from '../interface/editor';

import { hotkeys } from './hotkeys';

const arrowMap = {
  ArrowRight: true,
  ArrowLeft: true,
  ArrowUp: true,
  ArrowDown: true,
};

export const hotkeyHandle = (e: KeyboardEvent, editor: Editor & IVikaEditor) => {
  const key = e.key;
  // Separate handling of '/' in order to solve the problem of the safari browser after entering Chinese and then press '/' does not work
  if (key === '/') {
    hotkeys['/'].action(editor as Editor & IEventBusEditor);
    return;
  }
  if (arrowMap[key] && editor.isComposing) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  for (const hotkey in hotkeys) {
    if (isHotkey(hotkey, e)) {
      // action return value determines whether to block the default behavior,
      // the default is to block all, if not to block the need to display the return true
      const action = hotkeys[hotkey].action;
      if (!action(editor)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
};
