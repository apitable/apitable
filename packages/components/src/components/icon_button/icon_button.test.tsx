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
      expect(styles.background).toBe('rgb(232, 234, 237)');
    }
  });
});