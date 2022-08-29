import React from 'react';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './button.stories';
import { blackBlue, deepPurple } from '../../colors';
import { convertHexToRGB } from '../../helper';

const {
  PrimaryButton,
  DefaultButton,
  DisabledButton,
  PrefixIconButton,
  SuffixIconButton,
  LoadingButton,
  BlockButton,
  JellyButton
} = composeStories(stories);

describe('Button 按钮测试', () => {
  it('Button 按钮默认支持点击', () => {
    const onClickSpy = jest.fn();
    render(<DefaultButton onClick={onClickSpy} />);
    const buttonElement = screen.getByRole('button');
    buttonElement.click();
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('Button 按钮禁用后点击无效且透明度为 0.5', () => {
    const onClickSpy = jest.fn();
    render(<DisabledButton onClick={onClickSpy} />);
    const buttonElement = screen.getByRole('button');
    buttonElement.click();
    expect(onClickSpy).not.toHaveBeenCalled();
    const styles = getComputedStyle(buttonElement);
    expect(styles.opacity).toBe('0.5');
  });

  it('Button 按钮支持图标前缀', () => {
    render(<PrefixIconButton />);
    const buttonElement = screen.getByRole('button');
    const svgElement = buttonElement.querySelector('svg');
    // 按钮有两个子元素
    expect(buttonElement.childNodes.length).toBe(2);
    // 第一个子元素是 svg 图标
    expect(buttonElement.firstChild?.contains(svgElement));
  });

  it('Button 按钮支持图标后缀', () => {
    render(<SuffixIconButton />);
    const buttonElement = screen.getByRole('button');
    const svgElement = buttonElement.querySelector('svg');
    // 按钮有两个子元素
    expect(buttonElement.childNodes.length).toBe(2);
    // 最后子元素是 svg 图标
    expect(buttonElement.lastChild?.contains(svgElement));
  });
  
  it('Button 按钮支持加载 loading', () => {
    render(<LoadingButton />);
    const buttonElement = screen.getByRole('button');
    const svgElement = buttonElement.querySelector('svg');
    expect(buttonElement.childNodes.length).toBe(2);
    expect(buttonElement.lastChild?.contains(svgElement));
  });

  it('Button 按钮加载中点击禁用', () => {
    const onClickSpy = jest.fn();
    render(<LoadingButton onClick={onClickSpy} />);
    const buttonElement = screen.getByRole('button');
    buttonElement.click();
    expect(onClickSpy).not.toHaveBeenCalled();
  });

  it('Button 按钮支持占据整行 100%', () => {
    render(<BlockButton />);
    const buttonElement = screen.getByRole('button');
    const styles = getComputedStyle(buttonElement);
    expect(styles.width).toBe('100%');
  });

  it ('Button 按钮默认支持实心按钮', () => {
    render(<PrimaryButton/>);
    const buttonElement = screen.getByRole('button');
    const styles = getComputedStyle(buttonElement);
    const targetColor = convertHexToRGB(blackBlue[100]);
    expect(styles.color).toBe(targetColor);
  });

  it ('Button 按钮支持果冻按钮（浅色按钮）', () => {
    render(<JellyButton/>);
    const buttonElement = screen.getByRole('button');
    const styles = getComputedStyle(buttonElement);
    const targetColor = convertHexToRGB(deepPurple[500]);
    expect(styles.color).toBe(targetColor);
  });
});
