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
    test(
      new SimpleKeybinding(false, false, false, false, KeyCode.Enter),
      KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, false, false, true, KeyCode.Enter),
      KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, false, true, false, KeyCode.Enter),
      KeyMod.Alt | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, false, true, true, KeyCode.Enter),
      KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, true, false, false, KeyCode.Enter),
      KeyMod.Shift | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, true, false, true, KeyCode.Enter),
      KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, true, true, false, KeyCode.Enter),
      KeyMod.Shift | KeyMod.Alt | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(false, true, true, true, KeyCode.Enter),
      KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, false, false, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, false, false, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, false, true, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, false, true, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, true, false, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, true, false, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, true, true, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter,
    );
    test(
      new SimpleKeybinding(true, true, true, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter,
    );
  });

  test('WINDOWS & LINUX binary encoding', () => {
    function test(expected: Keybinding | null, k: number): void {
      testBinaryEncoding(expected, k);
    }

    test(null, 0);
    test(
      new SimpleKeybinding(false, false, false, false, KeyCode.Enter),
      KeyCode.Enter);
    test(
      new SimpleKeybinding(false, false, false, true, KeyCode.Enter),
      KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, false, true, false, KeyCode.Enter),
      KeyMod.Alt | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, false, true, true, KeyCode.Enter),
      KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, true, false, false, KeyCode.Enter),
      KeyMod.Shift | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, true, false, true, KeyCode.Enter),
      KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, true, true, false, KeyCode.Enter),
      KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(
      new SimpleKeybinding(false, true, true, true, KeyCode.Enter),
      KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, false, false, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, false, false, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, false, true, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, false, true, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, true, false, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, true, false, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.WinCtrl | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, true, true, false, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.Enter);
    test(
      new SimpleKeybinding(true, true, true, true, KeyCode.Enter),
      KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyMod.WinCtrl | KeyCode.Enter);
  });
});
