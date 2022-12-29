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