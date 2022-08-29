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
  // 单独处理‘/’为了解决safari浏览器输入中文后再按‘/’失效的问题
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
      // action 返回值决定是否阻止默认行为，默认都阻止，如不阻止需显示的返回true
      const action = hotkeys[hotkey].action;
      if (!action(editor)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
};