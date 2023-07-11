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

import { ChevronLeftOutlined, ChevronRightOutlined } from '@apitable/icons';
import React, { memo, FC, useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { IOption, Select } from 'components/select';
import {
  PaginationArrow,
  PaginationContainer,
  PaginationEllipse,
  PaginationItem,
  PaginationTotal,
  PaginationQuickJump,
  PaginationInput,
} from './styled';
import { IPaginationProps, IPaginationState } from './interface';
import { t, Strings } from '@apitable/core';

// Maximum number of display pages with ellipsis
const MAX_PAGES_NUM = 7;
// Left ellipsis
const SHOW_START_ELLIPSE = 4;
// Right ellipsis
const SHOW_END_ELLIPSE = 4;

enum PageEllipse {
  START='START',
  CENTER='CENTER',
  END='END',
  NONE='NONE',
}

enum PageArrow {
  PREV,
  NEXT,
}

const PaginationBase: FC<React.PropsWithChildren<IPaginationProps>> = (props) => {
  const {
    className,
    current = 1,
    pageSize = 10,
    total,
    showQuickJump,
    showTotal,
    showChangeSize,
    disabled = false,
    onChange,
    onPageSizeChange,
  } = props;
  const [pagination, setPagination] = useState<IPaginationState>({
    total: 0,
    current: 1,
    pages: 1,
    pageSize: 10,
  });
  const [inputPage, setInputPage] = useState<string>('');

  /**
   * Cache state of pagination
   */
  useEffect(() => {
    if (total < 0 || current < 0 || pageSize < 0) {
      return;
    }
    const pages = Math.ceil(total / pageSize);
    setPagination({ total, current, pageSize, pages });
  }, [current, pageSize, total]);

  /**
   * Click the arrow to turn the page
   */
  const handleClickArrowJumpPage = (page: number, type: PageArrow) => {
    if (disabled) {
      return;
    }
    const { pages, current } = pagination;
    let resPage = page;
    if (
      (type === PageArrow.NEXT && page > pages) ||
      (type === PageArrow.PREV && page < 1)
    ) {
      resPage = current;
    }

    if (onChange) {
      onChange(resPage, pageSize);
      return;
    }

    setPagination((val) => ({ ...val, current: resPage }));
  };

  /**
   * Click ellipsis to turn the page
   */
  const handleClickEllipse = (option: IOption) => {
    const { value } = option;
    if (onChange) {
      onChange(Number(value), pagination.pageSize);
      return;
    }
    setPagination((val) => ({ ...val, current: Number(value) }));
  };

  /**
   * Click the page number
   */
  const handleClickPage = (page: number) => {
    const { current, pageSize } = pagination;
    if (disabled || page === current) return;
    if (onChange) {
      onChange(page, pageSize);
      return;
    }
    setPagination((val) => ({ ...val, current: page }));
  };

  /**
   * Enter the page number
   */
  const handleInputPage = (e: ChangeEvent<HTMLInputElement>) => {
    // Blur judge legitimacy
    setInputPage(e.target.value);
  };

  const paginationInputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleBlurPage(e);
      paginationInputRef.current?.blur();
    }
  };

  /**
   * Enter change page number
   */
  const handleBlurPage = (e: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    const page = Number((e.target as any).value);
    if (!page || isNaN(page)) {
      setInputPage('');
      return;
    }
    const { pages, current, pageSize } = pagination;
    const validRange = page >= 1 && page <= pages;
    if (page === current) {
      // Do not clear when equal
      return;
    }
    if (disabled || !validRange) {
      setInputPage('');
      return;
    }
    if (onChange) {
      onChange(page, pageSize);
      return;
    }
    setPagination((val) => ({ ...val, current: page }));
  };

  /**
   * Number of pages changed
   */
  const handleChangePageSize = (option: IOption) => {
    const { current, total } = pagination;
    const pageSize = Number(option.value);
    if (onPageSizeChange || onChange) {
      onChange && onChange(current, pageSize);
      onPageSizeChange && onPageSizeChange(current, pageSize);
      return;
    }
    const pages = Math.ceil(total / pageSize);
    const page = current > pages ? pages : current;
    setPagination((val) => ({ ...val, pageSize, pages, current: page }));
  };

  /**
   * Show total UI
   */
  const renderTotal = () => {
    if (!showTotal) {
      return null;
    }
    const { current, pageSize, total } = pagination;
    const start = (current - 1) * pageSize + 1;
    let end = current * pageSize;
    end = end > total ? total : end;
    return (
      <PaginationTotal>{t(Strings.pagination_component_total, { start, end, total })}</PaginationTotal>
    );
  };

  /**
   * Quick jump UI
   */
  const renderQuickJump = () => {
    if (!showQuickJump) {
      return null;
    }
    return (
      <PaginationQuickJump>
        <span>{t(Strings.pagination_component_jump)}</span>
        <PaginationInput
          value={inputPage}
          size="small"
          disabled={disabled}
          onChange={handleInputPage}
          onKeyDown={handleKeyDown}
          onBlur={handleBlurPage}
          ref={paginationInputRef}
        />
        <span>{t(Strings.pagination_component_page)}</span>
      </PaginationQuickJump>
    );
  };

  /**
   * Number of entries per page selector
   */
  const renderChangeSize = () => {
    if (!showChangeSize) {
      return null;
    }
    const { pageSize } = pagination;
    const pageSizeOptions = [10, 15, 30, 50];
    return (
      <Select
        disabled={disabled}
        triggerStyle={{ height: 32, marginLeft: 24 }}
        value={pageSize.toString()}
        options={pageSizeOptions.map((v) => ({ label: t(Strings.pagination_component_page_size, { val: v }), value: v.toString() }))}
        onSelected={handleChangePageSize}
      />
    );
  };

  /**
   * Render ellipsis
   * @param key id
   * @param start Page number drop down start position
   * @param end Page number drop down end position
   */
  const renderEllipse = (key: string, start: number, end: number) => {
    const options: IOption[] = [];
    for (let i = start; i <= end; i++) {
      options.push({ value: i, label: i.toString() });
    }
    return (
      <Select
        value={pagination.current}
        options={options}
        listStyle={{ width: 54 }}
        hiddenArrow
        disabled={disabled}
        key={key}
        triggerStyle={{
          background: 'none',
          minWidth: 24,
          height: 24,
          padding: '0 2px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onSelected={handleClickEllipse}
        triggerLabel={(
          <PaginationEllipse disabled={disabled}>
            ...
          </PaginationEllipse>
        )}
      />
    );
  };

  /**
   * Render page number viewable area
   * @param start Page number drop down start position
   * @param end Page number drop down end position
   * @param type Ellipsis type
   */
  const renderVisualPage = (start: number, end: number, type = PageEllipse.NONE) => {
    const { current, pages } = pagination;
    const pagesElements: JSX.Element[] = [];
    for (let i = start; i <= end; i++) {
      const selected = current === i;
      pagesElements.push(
        <PaginationItem
          disabled={disabled}
          selected={selected}
          key={i}
          onClick={() => handleClickPage(i)}
          lastRangeChild={i === pages}
          data-selected={selected}
          data-info={`page-${i}`}
        >{i}</PaginationItem>
      );
    }
    const endElement = (
      <PaginationItem
        disabled={disabled}
        key="end"
        onClick={() => handleClickPage(pages)}
        lastRangeChild
      >{pages}</PaginationItem>
    );
    const startElement = (
      <PaginationItem
        disabled={disabled}
        key="first"
        onClick={() => handleClickPage(1)}
      >1</PaginationItem>
    );
    if (type === PageEllipse.END) {
      pagesElements.push(renderEllipse(PageEllipse.END, end - 1, pages), endElement);
    }
    if (type === PageEllipse.START) {
      pagesElements.unshift(startElement, renderEllipse(PageEllipse.START, 1, start + 1));
    }
    if (type === PageEllipse.CENTER) {
      pagesElements.unshift(
        startElement,
        renderEllipse(PageEllipse.START, 1, current - 1)
      );
      pagesElements.push(
        renderEllipse(PageEllipse.END, current + 1, pages),
        endElement
      );
    }
    return pagesElements;
  };

  /**
   * Page number rendering
   */
  const renderPage = () => {
    const { current = 1, pages } = pagination;
    const showComplete = pages <= MAX_PAGES_NUM;
    const pagesElements: JSX.Element[] = [];
    if (showComplete) {
      pagesElements.push(...renderVisualPage(1, pages));
    } else {
      let rangeStart = 0, rangeEnd = 0, type = PageEllipse.CENTER;
      if (current <= SHOW_START_ELLIPSE) {
        // Back ellipsis
        rangeStart = 1;
        rangeEnd = SHOW_START_ELLIPSE + (current === SHOW_START_ELLIPSE ? 1 : 0);
        // Always show one page number to the right
        if (current === SHOW_START_ELLIPSE) {
          rangeEnd = SHOW_START_ELLIPSE + 1;
        }
        type = PageEllipse.END;
      } else if (current >= pages - SHOW_END_ELLIPSE + 1) {
        // Front ellipsis
        rangeStart = pages - SHOW_END_ELLIPSE + 1;
        rangeEnd = pages;
        // Always show one page number to the left
        if (current === pages - SHOW_END_ELLIPSE + 1) {
          rangeStart = pages - SHOW_END_ELLIPSE;
        }
        type = PageEllipse.START;
      } else {
        // Ellipsis on both sides
        rangeStart = current - 1;
        rangeEnd = current + 1;
      }
      pagesElements.push(...renderVisualPage(rangeStart, rangeEnd, type));
    }
    return (
      <>
        <PaginationArrow
          aria-label='previous page'
          disabled={disabled || current === 1}
          onClick={() => handleClickArrowJumpPage(current - 1, PageArrow.PREV)}
        >
          <ChevronLeftOutlined />
        </PaginationArrow>
        {pagesElements}
        <PaginationArrow
          aria-label='next page'
          lastRangeChild
          disabled={disabled || current === pages}
          onClick={() => handleClickArrowJumpPage(current + 1, PageArrow.NEXT)}
        >
          <ChevronRightOutlined />
        </PaginationArrow>
      </>
    );
  };

  return (
    <PaginationContainer className={className}>
      {renderTotal()}
      {renderPage()}
      {renderChangeSize()}
      {renderQuickJump()}
    </PaginationContainer>
  );
};

export const Pagination = memo(PaginationBase);