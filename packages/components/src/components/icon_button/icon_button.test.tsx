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

describe('IconButton 图标按钮测试', () => {
  it ('默认为圆角无背景且 size 为 small（24 * 24）', () => {
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
  it ('size 为 large 时为圆角且宽高为 32 * 32', () => {
    const { container } = render(<LargeSize/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles.width).toBe(`${sizeMap.large.size}px`);
      expect(styles.height).toBe(`${sizeMap.large.size}px`);
      expect(styles['border-radius']).toBe('50%');
    }
  });
  it ('shape 为 square 时是方角', () => {
    const { container } = render(<Square/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles['border-radius']).toBe(`${sizeMap.large.borderRadius}px`);
    }
  });
  it ('variant 为 background 时背景为灰色', () => {
    const { container } = render(<VariantBackground/>);
    const wrapperElement = container.firstElementChild;
    if (wrapperElement) {
      const styles = getComputedStyle(wrapperElement);
      expect(styles.background).toBe('rgb(232, 234, 237)');
    }
  });
  // component 为 button
  // 禁用状态
  // 激活状态
});