import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './pagination.stories';

const { Default, Total, QuickJump, More, ChangeSize, Disabled, I18n } = composeStories(stories);

describe('pagination 翻页测试', () => {
  it('default 渲染', () => {
    render(<Default />);
    const [page1] = screen.getAllByRole('button');
    expect(page1).toHaveAttribute('data-info', 'page-1');
  });

  it('total 总页数显示', () => {
    const { container } = render(<Total />);
    
    expect(container).toHaveTextContent('第 1-10 条/总共 50 条');
  });

  it('quickjump 快速跳转', () => {
    const { container } = render(<QuickJump />);

    const input = container.querySelector('input');
    const pages = screen.getAllByRole('button');

    if (input) {
      fireEvent.change(input, { target: { value: 3 }});
      fireEvent.blur(input);
      expect(pages[2]).toHaveAttribute('data-selected', 'true');
    }
  });

  it('more 更多的翻页数据', () => {
    render(<More />);
    const pages = screen.getAllByRole('button');

    expect(pages[pages.length - 1]).toHaveTextContent('18');
  });

  it('changeSize 修改每页可显示的记录数量', () => {
    const { container } = render(<ChangeSize />);
    
    // 需要 fireEvent 测试，但是 select 中存在 TypeError: listContainerRef.current.scrollTo is not a function
    // const select = container.querySelector('div[data-name]');
    // if (select) {
    //   fireEvent.click(select);
    //   const options = screen.getAllByRole('option');
    //   expect(options.length).toEqual(4);
    // }

    expect(container).toHaveTextContent('10条/一页');
  });

  it('disabled 禁止使用翻页', () => {
    const { container } = render(<Disabled />);

    const pages = screen.getAllByRole('button');
    pages.forEach((page) => {
      expect(page).toHaveAttribute('disabled');
    });

    const arrows = container.querySelectorAll('div[aria-label]');
    if (arrows) {
      expect(arrows[0]).toHaveAttribute('disabled');
      expect(arrows[1]).toHaveAttribute('disabled');
    }

    const input = container.querySelector('input');
    if (input) {
      expect(input).toHaveAttribute('disabled');
    }

    const selects = container.querySelectorAll('div[data-name="select"]');
    if (selects) {
      selects.forEach((select) => {
        expect(select).toHaveAttribute('disabled');
      });
    }
  });

  it('i18n 国际化', () => {
    const { container } = render(<I18n />);

    expect(container).toHaveTextContent('of');
    expect(container).toHaveTextContent('items');
    expect(container).toHaveTextContent('Go to');
    expect(container).toHaveTextContent('page');
    expect(container).toHaveTextContent('Page');
  });
});