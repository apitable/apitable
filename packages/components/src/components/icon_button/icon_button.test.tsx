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

import React from 'react';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './icon_button.stories';
import { sizeMap } from './styled';

const {
  Default,
  LargeSize,
  Square,
  VariantBackground
} = composeStories(stories);

describe('IconButton test', () => {
  it ('The default is rounded and no background, size is small（24 * 24）', () => {
    const { container } = render(<Default/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles.width).toBe(`${sizeMap.small.size}px`);
      expect(styles.height).toBe(`${sizeMap.small.size}px`);
      expect(styles['border-radius']).toBe('50%');
      expect(styles.background).toBe('');
    }
  });
  it ('When the size is large, it is rounded and the width and height are 32 * 32', () => {
    const { container } = render(<LargeSize/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles.width).toBe(`${sizeMap.large.size}px`);
      expect(styles.height).toBe(`${sizeMap.large.size}px`);
      expect(styles['border-radius']).toBe('50%');
    }
  });
  it ('Square when shape is square', () => {
    const { container } = render(<Square/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles['border-radius']).toBe(`${sizeMap.large.borderRadius}px`);
    }
  });
  it ('When variant is background, the background is gray', () => {
    const { container } = render(<VariantBackground/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles.background).toBe('rgb(224, 224, 224)');
    }
  });
});