/**
 * 【快捷键绑定系统】
 * 灵感以及大部分代码来源于 vscode，可参照 preference -> Keyboard Shortcuts 的配置来理解。
 * > https://github.com/microsoft/vscode/blob/master/src/vs/base/common/keybindingParser.ts
 */

export * from './shortcut_key';
export { ContextName } from 'pc/common/shortcut_key/enum';
export { ShortcutActionName } from 'pc/common/shortcut_key/enum';
