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

import { createKeybinding, Keybinding, KeyCode, KeyMod, SimpleKeybinding } from '../key_codes';

describe('keyCodes', () => {
  function testBinaryEncoding(expected: Keybinding | null, k: number): void {
    expect(createKeybinding(k)).toEqual(expected);
  }

  it('MAC binary encoding', () => {
    function test(expected: Keybinding | null, k: number): void {
      testBinaryEncoding(expected, k);
    }

    test(null, 0);
    test(new SimpleKeybinding(false, false, false, false, KeyCode.Enter), KeyCode.Enter);
    test(new SimpleKeybinding(false, false, false, true, KeyCode.Enter), KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, false, true, false, KeyCode.Enter), KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(false, false, true, true, KeyCode.Enter), KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, false, false, KeyCode.Enter), KeyMod.Shift | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, false, true, KeyCode.Enter), KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, true, false, KeyCode.Enter), KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, true, true, KeyCode.Enter), KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, false, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, false, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, true, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, true, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, false, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, false, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, true, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, true, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
  });

  test('WINDOWS & LINUX binary encoding', () => {
    function test(expected: Keybinding | null, k: number): void {
      testBinaryEncoding(expected, k);
    }

    test(null, 0);
    test(new SimpleKeybinding(false, false, false, false, KeyCode.Enter), KeyCode.Enter);
    test(new SimpleKeybinding(false, false, false, true, KeyCode.Enter), KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, false, true, false, KeyCode.Enter), KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(false, false, true, true, KeyCode.Enter), KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, false, false, KeyCode.Enter), KeyMod.Shift | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, false, true, KeyCode.Enter), KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, true, false, KeyCode.Enter), KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(false, true, true, true, KeyCode.Enter), KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, false, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, false, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, true, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(true, false, true, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, false, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, false, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, true, false, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(new SimpleKeybinding(true, true, true, true, KeyCode.Enter), KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
  });
});
