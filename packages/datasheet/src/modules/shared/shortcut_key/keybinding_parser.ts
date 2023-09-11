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

import { Keybinding, SimpleKeybinding, KeyCodeUtils } from './key_codes';

export class KeybindingParser {
  // input case: 'shift+alt+cmd+pagedown cmd+u'
  private static _readModifiers(input: string) {
    input = input.toLowerCase().trim();

    let ctrl = false;
    let shift = false;
    let alt = false;
    let meta = false;

    let matchedModifier: boolean;

    do {
      matchedModifier = false;
      if (/^ctrl(\+|-)/.test(input)) {
        ctrl = true;
        input = input.substr('ctrl-'.length);
        matchedModifier = true;
      }
      if (/^shift(\+|-)/.test(input)) {
        shift = true;
        input = input.substr('shift-'.length);
        matchedModifier = true;
      }
      if (/^alt(\+|-)/.test(input)) {
        alt = true;
        input = input.substr('alt-'.length);
        matchedModifier = true;
      }
      if (/^meta(\+|-)/.test(input)) {
        meta = true;
        input = input.substr('meta-'.length);
        matchedModifier = true;
      }
      if (/^win(\+|-)/.test(input)) {
        meta = true;
        input = input.substr('win-'.length);
        matchedModifier = true;
      }
      if (/^cmd(\+|-)/.test(input)) {
        meta = true;
        input = input.substr('cmd-'.length);
        matchedModifier = true;
      }
    } while (matchedModifier);

    let key: string;

    const firstSpaceIdx = input.indexOf(' ');
    if (firstSpaceIdx > 0) {
      key = input.substring(0, firstSpaceIdx);
      input = input.substring(firstSpaceIdx);
    } else {
      key = input;
      input = '';
    }

    return {
      // remains to chordPart
      remains: input,
      ctrl,
      shift,
      alt,
      meta,
      key,
    };
  }

  private static parseSimpleKeybinding(input: string): [SimpleKeybinding, string] {
    const mods = this._readModifiers(input);
    const keyCode = KeyCodeUtils.fromUserSettings(mods.key);
    return [new SimpleKeybinding(mods.ctrl, mods.shift, mods.alt, mods.meta, keyCode), mods.remains];
  }

  public static parseKeybinding(input: string): Keybinding | null {
    if (!input) {
      return null;
    }

    const [firstPart] = this.parseSimpleKeybinding(input);

    return firstPart;
  }

  private static parseSimpleUserBinding(input: string): SimpleKeybinding {
    const mods = this._readModifiers(input);
    const keyCode = KeyCodeUtils.fromUserSettings(mods.key);
    return new SimpleKeybinding(mods.ctrl, mods.shift, mods.alt, mods.meta, keyCode);
  }

  static parseUserBinding(input: string): SimpleKeybinding | null {
    if (!input) {
      return null;
    }

    return this.parseSimpleUserBinding(input);
  }
}
