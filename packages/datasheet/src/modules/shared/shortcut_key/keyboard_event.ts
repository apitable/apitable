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

import { browser } from '../browser';
import { KeyCode, KeyCodeUtils, KeyMod, SimpleKeybinding } from './key_codes';

const KEY_CODE_MAP: { [keyCode: number]: KeyCode } = new Array(230);
const INVERSE_KEY_CODE_MAP: KeyCode[] = new Array(KeyCode.MAX_VALUE);

(function () {
  for (let i = 0; i < INVERSE_KEY_CODE_MAP.length; i++) {
    INVERSE_KEY_CODE_MAP[i] = -1;
  }

  function define(code: number, keyCode: KeyCode): void {
    KEY_CODE_MAP[code] = keyCode;
    INVERSE_KEY_CODE_MAP[keyCode] = code;
  }

  define(3, KeyCode.PauseBreak); // VK_CANCEL 0x03 Control-break processing
  define(8, KeyCode.Backspace);
  define(9, KeyCode.Tab);
  define(13, KeyCode.Enter);
  define(16, KeyCode.Shift);
  define(17, KeyCode.Ctrl);
  define(18, KeyCode.Alt);
  define(19, KeyCode.PauseBreak);
  define(20, KeyCode.CapsLock);
  define(27, KeyCode.Escape);
  define(32, KeyCode.Space);
  define(33, KeyCode.PageUp);
  define(34, KeyCode.PageDown);
  define(35, KeyCode.End);
  define(36, KeyCode.Home);
  define(37, KeyCode.LeftArrow);
  define(38, KeyCode.UpArrow);
  define(39, KeyCode.RightArrow);
  define(40, KeyCode.DownArrow);
  define(45, KeyCode.Insert);
  define(46, KeyCode.Delete);

  define(48, KeyCode.KEY_0);
  define(49, KeyCode.KEY_1);
  define(50, KeyCode.KEY_2);
  define(51, KeyCode.KEY_3);
  define(52, KeyCode.KEY_4);
  define(53, KeyCode.KEY_5);
  define(54, KeyCode.KEY_6);
  define(55, KeyCode.KEY_7);
  define(56, KeyCode.KEY_8);
  define(57, KeyCode.KEY_9);

  define(65, KeyCode.KEY_A);
  define(66, KeyCode.KEY_B);
  define(67, KeyCode.KEY_C);
  define(68, KeyCode.KEY_D);
  define(69, KeyCode.KEY_E);
  define(70, KeyCode.KEY_F);
  define(71, KeyCode.KEY_G);
  define(72, KeyCode.KEY_H);
  define(73, KeyCode.KEY_I);
  define(74, KeyCode.KEY_J);
  define(75, KeyCode.KEY_K);
  define(76, KeyCode.KEY_L);
  define(77, KeyCode.KEY_M);
  define(78, KeyCode.KEY_N);
  define(79, KeyCode.KEY_O);
  define(80, KeyCode.KEY_P);
  define(81, KeyCode.KEY_Q);
  define(82, KeyCode.KEY_R);
  define(83, KeyCode.KEY_S);
  define(84, KeyCode.KEY_T);
  define(85, KeyCode.KEY_U);
  define(86, KeyCode.KEY_V);
  define(87, KeyCode.KEY_W);
  define(88, KeyCode.KEY_X);
  define(89, KeyCode.KEY_Y);
  define(90, KeyCode.KEY_Z);

  define(93, KeyCode.ContextMenu);

  define(96, KeyCode.NUMPAD_0);
  define(97, KeyCode.NUMPAD_1);
  define(98, KeyCode.NUMPAD_2);
  define(99, KeyCode.NUMPAD_3);
  define(100, KeyCode.NUMPAD_4);
  define(101, KeyCode.NUMPAD_5);
  define(102, KeyCode.NUMPAD_6);
  define(103, KeyCode.NUMPAD_7);
  define(104, KeyCode.NUMPAD_8);
  define(105, KeyCode.NUMPAD_9);
  define(106, KeyCode.NUMPAD_MULTIPLY);
  define(107, KeyCode.NUMPAD_ADD);
  define(108, KeyCode.NUMPAD_SEPARATOR);
  define(109, KeyCode.NUMPAD_SUBTRACT);
  define(110, KeyCode.NUMPAD_DECIMAL);
  define(111, KeyCode.NUMPAD_DIVIDE);

  define(112, KeyCode.F1);
  define(113, KeyCode.F2);
  define(114, KeyCode.F3);
  define(115, KeyCode.F4);
  define(116, KeyCode.F5);
  define(117, KeyCode.F6);
  define(118, KeyCode.F7);
  define(119, KeyCode.F8);
  define(120, KeyCode.F9);
  define(121, KeyCode.F10);
  define(122, KeyCode.F11);
  define(123, KeyCode.F12);
  define(124, KeyCode.F13);
  define(125, KeyCode.F14);
  define(126, KeyCode.F15);
  define(127, KeyCode.F16);
  define(128, KeyCode.F17);
  define(129, KeyCode.F18);
  define(130, KeyCode.F19);

  define(144, KeyCode.NumLock);
  define(145, KeyCode.ScrollLock);

  define(186, KeyCode.US_SEMICOLON);
  define(187, KeyCode.US_EQUAL);
  define(188, KeyCode.US_COMMA);
  define(189, KeyCode.US_MINUS);
  define(190, KeyCode.US_DOT);
  define(191, KeyCode.US_SLASH);
  define(192, KeyCode.US_BACKTICK);
  define(193, KeyCode.ABNT_C1);
  define(194, KeyCode.ABNT_C2);
  define(219, KeyCode.US_OPEN_SQUARE_BRACKET);
  define(220, KeyCode.US_BACKSLASH);
  define(221, KeyCode.US_CLOSE_SQUARE_BRACKET);
  define(222, KeyCode.US_QUOTE);
  define(223, KeyCode.OEM_8);

  define(226, KeyCode.OEM_102);

  /**
   * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   */
  define(229, KeyCode.KEY_IN_COMPOSITION);

  if (process.env.SSR) {
    return;
  }
  if (browser?.is('ie')) {
    define(91, KeyCode.Meta);
  } else if (browser?.is('firefox')) {
    define(59, KeyCode.US_SEMICOLON);
    define(107, KeyCode.US_EQUAL);
    define(61, KeyCode.US_EQUAL);
    define(109, KeyCode.US_MINUS);
    define(173, KeyCode.US_MINUS);
    if (browser?.is('macOS')) {
      define(224, KeyCode.Meta);
    }
  } else if (browser?.is('WebKit')) {
    define(91, KeyCode.Meta);
    if (browser?.is('macOS')) {
      // the two meta keys in the Mac have different key codes (91 and 93)
      define(93, KeyCode.Meta);
    } else {
      define(92, KeyCode.Meta);
    }
  }
})();

function extractKeyCode(e: KeyboardEvent): KeyCode {
  if (e.charCode) {
    // "keypress" events mostly
    const char = String.fromCharCode(e.charCode).toUpperCase();
    return KeyCodeUtils.fromString(char);
  }
  return KEY_CODE_MAP[e.keyCode] || KeyCode.Unknown;
}

export function getCodeForKeyCode(keyCode: KeyCode): number {
  return INVERSE_KEY_CODE_MAP[keyCode];
}

export interface IKeyboardEvent {
  readonly browserEvent: KeyboardEvent;
  readonly target: HTMLElement;

  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly keyCode: KeyCode;
  readonly code: string;

  /**
   * @internal
   */
  toKeybinding(): SimpleKeybinding;
  equals(keybinding: number): boolean;

  preventDefault(): void;
  stopPropagation(): void;
}

let ctrlKeyMod: number | KeyMod;
const altKeyMod = KeyMod.Alt;
const shiftKeyMod = KeyMod.Shift;
let metaKeyMod: number | KeyMod;

(() => {
  if (!process.env.SSR) {
    ctrlKeyMod = browser?.is('macOS') ? KeyMod.WinCtrl : KeyMod.CtrlCmd;
    metaKeyMod = browser?.is('macOS') ? KeyMod.CtrlCmd : KeyMod.WinCtrl;
  }
})();

export class StandardKeyboardEvent implements IKeyboardEvent {
  public readonly browserEvent: KeyboardEvent;
  public readonly target: HTMLElement;

  public readonly ctrlKey: boolean;
  public readonly shiftKey: boolean;
  public readonly altKey: boolean;
  public readonly metaKey: boolean;
  public readonly keyCode: KeyCode;
  public readonly code: string;

  public asKeybinding: number;
  public asRuntimeKeybinding: SimpleKeybinding;

  constructor(source: KeyboardEvent) {
    const e = source as KeyboardEvent;

    this.browserEvent = e;
    this.target = e.target as HTMLElement;

    this.ctrlKey = e.ctrlKey;
    this.shiftKey = e.shiftKey;
    this.altKey = e.altKey;
    this.metaKey = e.metaKey;
    this.keyCode = extractKeyCode(e);
    this.code = e.code;

    // console.info(e.type + ": keyCode: " + e.keyCode + ",
    // which: " + e.which + ", charCode: " + e.charCode + ",
    // detail: " + e.detail + " ====> " + this.keyCode + ' -- ' + KeyCode[this.keyCode]);

    this.ctrlKey = this.ctrlKey || this.keyCode === KeyCode.Ctrl;
    this.altKey = this.altKey || this.keyCode === KeyCode.Alt;
    this.shiftKey = this.shiftKey || this.keyCode === KeyCode.Shift;
    this.metaKey = this.metaKey || this.keyCode === KeyCode.Meta;

    this.asKeybinding = this._computeKeybinding();
    this.asRuntimeKeybinding = this._computeRuntimeKeybinding();

    // console.log(`code: ${e.code}, keyCode: ${e.keyCode}, key: ${e.key}`);
  }

  public preventDefault(): void {
    if (this.browserEvent && this.browserEvent.preventDefault) {
      this.browserEvent.preventDefault();
    }
  }

  public stopPropagation(): void {
    if (this.browserEvent && this.browserEvent.stopPropagation) {
      this.browserEvent.stopPropagation();
    }
  }

  public toKeybinding(): SimpleKeybinding {
    return this.asRuntimeKeybinding;
  }

  public equals(other: number): boolean {
    return this.asKeybinding === other;
  }

  private _computeKeybinding(): number {
    let key = KeyCode.Unknown;
    if (this.keyCode !== KeyCode.Ctrl && this.keyCode !== KeyCode.Shift && this.keyCode !== KeyCode.Alt && this.keyCode !== KeyCode.Meta) {
      key = this.keyCode;
    }

    let result = 0;
    if (this.ctrlKey) {
      result |= ctrlKeyMod;
    }
    if (this.altKey) {
      result |= altKeyMod;
    }
    if (this.shiftKey) {
      result |= shiftKeyMod;
    }
    if (this.metaKey) {
      result |= metaKeyMod;
    }
    result |= key;

    return result;
  }

  private _computeRuntimeKeybinding(): SimpleKeybinding {
    let key = KeyCode.Unknown;
    if (this.keyCode !== KeyCode.Ctrl && this.keyCode !== KeyCode.Shift && this.keyCode !== KeyCode.Alt && this.keyCode !== KeyCode.Meta) {
      key = this.keyCode;
    }
    return new SimpleKeybinding(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, key);
  }
}
