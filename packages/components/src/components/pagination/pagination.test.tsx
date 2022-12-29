import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './pagination.stories';

const { Default, Total, QuickJump, More, ChangeSize, Disabled, I18n } = composeStories(stories);

describe('pagination test', () => {
  it('default render', () => {
    render(<Default />);
    const [page1] = screen.getAllByRole('button');
    expect(page1).toHaveAttribute('data-info', 'page-1');
  });

  it('Show total number', () => {
    const { container } = render(<Total />);
    
    expect(container).toHaveTextContent('第 1-10 条/总共 50 条');
  });

  it('Quick jump UI', () => {
    const { container } = render(<QuickJump />);

    const input = container.querySelector('input');
    const pages = screen.getAllByRole('button');

    if (input) {
      fireEvent.change(input, { target: { value: 3 }});
      fireEvent.blur(input);
      expect(pages[2]).toHaveAttribute('data-selected', 'true');
    }
  });

  it('More page click', () => {
    render(<More />);
    const pages = screen.getAllByRole('button');

    expect(pages[pages.length - 1]).toHaveTextContent('18');
  });

  it('Per page number', () => {
    const { container } = render(<ChangeSize />);
    
    // const select = container.querySelector('div[data-name]');
    // if (select) {
    //   fireEvent.click(select);
    //   const options = screen.getAllByRole('option');
    //   expect(options.length).toEqual(4);
    // }

    expect(container).toHaveTextContent('10条/一页');
  });

  it('Disabled page change', () => {
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

  it('I18n', () => {
    const { container } = render(<I18n />);

    expect(container).toHaveTextContent('of');
    expect(container).toHaveTextContent('items');
    expect(container).toHaveTextContent('Go to');
    expect(container).toHaveTextContent('page');
    expect(container).toHaveTextContent('Page');
  });
});