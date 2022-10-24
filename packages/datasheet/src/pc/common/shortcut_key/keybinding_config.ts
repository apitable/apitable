import { SystemConfig } from '@apitable/core';
import { ShortcutKey } from '@apitable/core/src/config/system_config.interface';
import { ShortcutActionName } from 'pc/common/shortcut_key/enum';
import { browser } from '../browser';

export interface IKeyBinding {
  /**
   * mac key
   * key 为键盘按键字符串映射
   * 可在 ./keybinding/key_codes@define 中查找到
   * 也可以直接参考 vscode 键盘映射
   */
  key: string;

  /**
   * windows key，没有就用key
   */
  winKey?: string;

  /**
   * command name
   */
  command?: string;

  /**
   * 可以编写简单表达式，支持 ! && == () ||
   * 表达式中支持的变量可以在 ./shortcut_key/@ContextName 中查阅
   */
  when?: string;

  /**
   * command function，后续解析转换 command key字符串成该函数
   */
  commandFunc?: ShortcutActionName;

  /**
   * 分类，用于界面显示分界
   *
   * @type {string}
   * @memberof IKeyBinding
   */
  type?: string[];

  /**
   * 配置表生成的ID, 一般恒等于key
   *
   * @type {string}
   * @memberof IKeyBinding
   */
  id?: string;

  /**
   * 快捷键的名字, 多语言翻译
   *
   * @type {string[]}
   * @memberof IKeyBinding
   */
  name?: string[];

}

export function getKeyForOS(keyBinding: IKeyBinding) {
  const { key, winKey } = keyBinding;
  return browser.is('Windows') ? winKey || key : key;
}

// 将快捷键的显示mac化
export function formatMacShortcutKey(shortcutKey: string): string {
  return shortcutKey.replace(/\+/g, ' ')
    .replace(/cmd/gi, '⌘')
    .replace(/option/gi, '⌥')
    .replace(/ctrl/gi, '⌃')
    .replace(/shift/gi, '⇧')
    .replace(/( up|^up)/gi, ' ↑')
    .replace(/( down|^down)/gi, ' ↓')
    .replace(/left/gi, '←')
    .replace(/right/gi, '→')
    .replace(/delete/gi, '⌫')
    .split(' ')
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ').trim();
}

// 将快捷键的显示win化
export function formatWinShortcutKey(shortcutKey: string): string {
  return shortcutKey.replace(/(up$|^up)/gi, '↑')
    .replace(/(down$|^down)/gi, '↓')
    .replace(/left/gi, '←')
    .replace(/right/gi, '→')
    .split('+')
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' + ');
}

export function getShortcutKeyString(actionName: ShortcutActionName | ShortcutKey): string {
  let shortcutKey;
  if (typeof actionName === 'string') {
    shortcutKey = SystemConfig.shortcut_keys.find(item => item.command === actionName);
  } else {
    shortcutKey = actionName;
  }
  if (!shortcutKey) { return ''; }
  const { winKey, key } = shortcutKey;
  if (browser.is('Windows')) {
    const keyVal = winKey || key;
    return formatWinShortcutKey(keyVal);
  }
  return formatMacShortcutKey(key);
}

// 转换数组
export const keybindings = SystemConfig.shortcut_keys;
