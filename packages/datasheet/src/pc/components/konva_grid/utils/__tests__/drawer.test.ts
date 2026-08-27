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

jest.mock('@apitable/components', () => ({ colors: { firstLevelText: '#000' }, ThemeName: {} }), { virtual: true });
jest.mock('@apitable/core', () => ({ SegmentType: { Url: 'Url' } }), { virtual: true });
jest.mock(
  '@apitable/icons',
  () => ({
    UserGroupOutlined: { toString: () => '' },
    WebOutlined: { toString: () => '' },
  }),
  { virtual: true },
);
jest.mock('@apitable/widget-sdk', () => ({ assertSignatureManager: jest.fn() }), { virtual: true });
jest.mock(
  'pc/components/common',
  () => ({
    AvatarSize: {},
    AvatarType: {},
    getAvatarRandomColor: jest.fn(),
    getFirstWordFromString: jest.fn(),
  }),
  { virtual: true },
);
jest.mock('pc/components/konva_components', () => ({ autoSizerCanvas: { context: {} } }), { virtual: true });
jest.mock('pc/utils/color_utils', () => ({ createAvatarRainbowColorsArr: jest.fn(() => []) }), { virtual: true });
jest.mock('pc/utils/env', () => ({ getEnvVariables: jest.fn(() => ({})) }), { virtual: true });
jest.mock('../get_text_width', () => ({
  getTextWidth: jest.fn((_ctx: CanvasRenderingContext2D, text: string) => text.length),
  textDataCache: new Map(),
}));
jest.mock('../image_cache', () => ({ imageCache: new Map() }));

import { KonvaDrawer } from '../drawer';

describe('KonvaDrawer.wrapText', () => {
  it.each(['\n', '\r', '\r\n'])('treats %j as a single line break', (lineBreak) => {
    const drawer = new KonvaDrawer();
    drawer.ctx = {
      measureText: (text: string) => ({ width: text.length }),
    } as CanvasRenderingContext2D;

    const result = drawer.wrapText({
      x: 0,
      y: 0,
      text: `A${lineBreak}B`,
      maxWidth: 100,
      lineHeight: 24,
      maxRow: Infinity,
      fieldType: 0,
    });

    expect(result.data.map(({ text, offsetY }) => ({ text, offsetY }))).toEqual([
      { text: 'A', offsetY: 0 },
      { text: 'B', offsetY: 24 },
    ]);
  });
});
