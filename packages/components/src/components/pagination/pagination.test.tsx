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