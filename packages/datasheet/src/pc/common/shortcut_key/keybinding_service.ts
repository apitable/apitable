import { ShortcutActionName } from 'pc/common/shortcut_key/enum';
import { ContextKeyEvaluate } from './context_key_parser/context_key';
import { SimpleKeybinding } from './key_codes';
import { getKeyForOS, IKeyBinding, keybindings } from './keybinding_config';
import { KeybindingParser } from './keybinding_parser';
import { StandardKeyboardEvent } from './keyboard_event';
import { ShortcutActionManager, ShortcutContext } from './shortcut_key';

export interface IKeybindingItem {
  key: SimpleKeybinding;
  when?: string;
  command: ShortcutActionName;
}

export class KeybindingService {
  keybindingItems!: IKeybindingItem[];

  constructor() {
    this.register();
    this.resolveKeybindingItems(keybindings);
  }

  register() {
    window.addEventListener('keydown', this.keyEventHandle);
  }

  destroy() {
    window.removeEventListener('keydown', this.keyEventHandle);
  }

  private keyEventHandle = (e: KeyboardEvent) => {
    const keyEvent = new StandardKeyboardEvent(e);
    const shouldPreventDefault = this.dispatch(keyEvent) === false ? false : true;
    if (shouldPreventDefault) {
      keyEvent.preventDefault();
    }
  };

  private getResolvedResult(firstPart: SimpleKeybinding): IKeybindingItem | null {
    const keyHintResult = this.keybindingItems.reduce(
      (prev: IKeybindingItem[], keybindingItem: IKeybindingItem) => {
        if (keybindingItem.key.equals(firstPart)) {
          prev.push(keybindingItem);
        }
        return prev;
      }, [],
    );
    if (!keyHintResult.length) {
      return null;
    }
    const resolvedResult = keyHintResult.find(keybindingItem => {
      if (keybindingItem.when) {
        return ContextKeyEvaluate(keybindingItem.when, ShortcutContext.context);
      }
      // console.warn('! ' + `no when of ${keybindingItem.command}`);

      return false;
    });

    return resolvedResult || null;
  }

  private resolveKeybindingItems(keybindings: IKeyBinding[]) {
    this.keybindingItems = keybindings.map(binding => {
      const key = KeybindingParser.parseUserBinding(getKeyForOS(binding));
      if (!key) {
        throw new Error('Error binding key'!);
      }

      // string to enum
      if (binding.command === undefined) {
        console.warn('! ' + `Found an empty shortcut Command statement: ${binding.key}`); 
        binding.command = 'None'; // Give a default value
      }

      const commandEnumName = binding.command;
      const commandFunc: ShortcutActionName = ShortcutActionName[commandEnumName] as ShortcutActionName;

      return {
        key,
        command: commandFunc,
        when: binding.when,
      };
    });
  }

  dispatch(e: StandardKeyboardEvent): boolean | void {
    const keybinding = e.asRuntimeKeybinding;
    const resolveResult = this.getResolvedResult(keybinding);
    if (resolveResult) {
      return ShortcutActionManager.trigger(resolveResult.command);
    }

    return false;
  }
}
