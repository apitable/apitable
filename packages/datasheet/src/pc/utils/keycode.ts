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

/**
 * Please add in order by keyCode
 */
export enum KeyCode {
  BackSpace = 8,
  Tab = 9,
  Clear = 12,
  Enter = 13,
  Shift = 16,
  Ctrl = 17,
  Alt = 18,
  Caps = 20,
  Esc = 27,
  Space = 32,
  PageUp = 33,
  PageDown = 34,
  End = 35,
  Home = 36,
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40,
  Delete = 46,
  Digit0 = 48,
  Digit1 = 49,
  Digit2 = 50,
  Digit3 = 51,
  Digit4 = 52,
  Digit5 = 53,
  Digit6 = 54,
  Digit9 = 57,
  A = 65,
  B = 66,
  C = 67,
  D = 68,
  E = 69,
  F = 70,
  G = 71,
  H = 72,
  I = 73,
  J = 74,
  K = 75,
  L = 76,
  M = 77,
  N = 78,
  O = 79,
  P = 80,
  Q = 81,
  R = 82,
  S = 83,
  T = 84,
  U = 85,
  V = 86,
  W = 87,
  X = 88,
  Y = 89,
  Z = 90,
  Meta = 91,
  RightMeta = 92,
  Caret = 94, // The `^` character.
  Numpad0 = 96,
  Numpad9 = 105,
  NumpadPlus = 107, // Full keyboard +
  NumpadMinus = 109, // Full keyboard -
  NumpadDot = 110,
  F11 = 122,
  Semicolon = 186,
  Plus = 187,
  Comma = 188,
  Minus = 189,
  Dot = 190,
  Grave = 192,
  Bracket = 219,
  Quot = 222,
  Asterisk = 106,
  Slash = 111,
  FirefoxMinus = 173,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/' = 191,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '\\' = 220,
  Ime = 229, // Check for the 'placeholder keyCode'
}

export function isNumberKey(event: KeyboardEvent) {
  const { keyCode } = event;
  return (keyCode >= KeyCode.Digit0 && keyCode <= KeyCode.Digit9) || (keyCode >= KeyCode.Numpad0 && keyCode <= KeyCode.Numpad9);
}

export function printableKey(event: KeyboardEvent) {
  const { metaKey, ctrlKey } = event;
  const { keyCode } = event;
  if (metaKey || ctrlKey || keyCode === KeyCode.Space) {
    return false;
  }

  return (
    (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) ||
    (keyCode >= KeyCode.Digit0 && keyCode <= KeyCode.Digit9) ||
    (keyCode >= KeyCode.Numpad0 && keyCode <= KeyCode.Numpad9) ||
    (keyCode >= KeyCode.Semicolon && keyCode <= KeyCode.Grave) ||
    (keyCode >= KeyCode.Bracket && keyCode <= KeyCode.Quot) ||
    (keyCode >= KeyCode.Asterisk && keyCode <= KeyCode.Slash) ||
    keyCode === KeyCode.Space ||
    keyCode === 61 ||
    keyCode === 173 ||
    // Sogou input method under shift will be regarded as input content, need to filter
    ((keyCode === KeyCode.Ime || keyCode === 0) && event.key !== 'Shift')
  );
}

export function isNumeralKey(event: KeyboardEvent) {
  const { keyCode } = event;
  return (
    (keyCode >= KeyCode.Digit0 && keyCode <= KeyCode.Digit9) ||
    (keyCode >= KeyCode.Numpad0 && keyCode <= KeyCode.Numpad9) ||
    keyCode === KeyCode.NumpadPlus ||
    keyCode === KeyCode.NumpadMinus ||
    keyCode === KeyCode.NumpadDot ||
    keyCode === KeyCode.Dot ||
    keyCode === KeyCode.E ||
    keyCode === KeyCode.Plus ||
    keyCode === KeyCode.Minus ||
    keyCode === KeyCode.FirefoxMinus ||
    keyCode === KeyCode.Ime
  );
}

export function isLegalDateKey(event: KeyboardEvent) {
  const { keyCode } = event;
  return (
    (keyCode >= KeyCode.Digit0 && keyCode <= KeyCode.Digit9) ||
    (keyCode >= KeyCode.Numpad0 && keyCode <= KeyCode.Numpad9) ||
    keyCode === KeyCode.Minus ||
    keyCode === KeyCode.NumpadMinus ||
    keyCode === KeyCode.BackSpace ||
    keyCode === KeyCode['/']
  );
}
