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

import { ShortcutActionName } from 'modules/shared/shortcut_key/enum';
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

  private keyEventHandle = async (e: KeyboardEvent) => {
    const keyEvent = new StandardKeyboardEvent(e);
    const shouldPreventDefault = (await this.dispatch(keyEvent)) !== false;
    if (shouldPreventDefault) {
      keyEvent.preventDefault();
    }
  };

  private getResolvedResult(firstPart: SimpleKeybinding): IKeybindingItem | null {
    const keyHintResult = this.keybindingItems.reduce((prev: IKeybindingItem[], keybindingItem: IKeybindingItem) => {
      if (keybindingItem.key.equals(firstPart)) {
        prev.push(keybindingItem);
      }
      return prev;
    }, []);
    if (!keyHintResult.length) {
      return null;
    }
    const resolvedResult = keyHintResult.find((keybindingItem) => {
      if (keybindingItem.when) {
        return ContextKeyEvaluate(keybindingItem.when, ShortcutContext.context);
      }
      // console.warn('! ' + `no when of ${keybindingItem.command}`);

      return false;
    });

    return resolvedResult || null;
  }

  private resolveKeybindingItems(keybindings: IKeyBinding[]) {
    this.keybindingItems = keybindings.map((binding) => {
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

  private dispatch(e: StandardKeyboardEvent): Promise<boolean | void> {
    const keybinding = e.asRuntimeKeybinding;
    const resolveResult = this.getResolvedResult(keybinding);
    if (resolveResult) {
      return ShortcutActionManager.trigger(resolveResult.command);
    }

    return Promise.resolve(false);
  }
}
