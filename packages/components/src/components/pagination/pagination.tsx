import { ChevronLeftOutlined, ChevronRightOutlined } from '@vikadata/icons';
import React, { memo, FC, useState, useEffect, ChangeEvent } from 'react';
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
import { t } from './i18n';
import { Strings } from './strings';

// 最大完整展示页数，超出有省略号
const MAX_PAGES_NUM = 7;
// 左侧省略号
const SHOW_START_ELLIPSE = 4;
// 右侧省略号
const SHOW_END_ELLIPSE = 4;

enum PageEllipse {
  START = 'START',
  CENTER = 'CENTER',
  END = 'END',
  NONE = 'NONE',
}

enum PageArrow {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

const PaginationBase: FC<IPaginationProps> = (props) => {
  const {
    current = 1,
    pageSize = 10,
    total,
    showQuickJump,
    showTotal,
    showChangeSize,
    disabled = false,
    lang = 'zh',
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
   * 将外部输入转为内部状态
   */
  useEffect(() => {
    if (total < 0 || current < 0 || pageSize < 0) {
      return;
    }
    const pages = Math.ceil(total / pageSize);
    setPagination({ total, current, pageSize, pages });
  }, [current, pageSize, total]);

  /**
   * 点击箭头翻页
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

    setPagination((val) => ({ ...val, current: resPage }));
  };

  /**
   * 点击省略号跳转翻页
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
   * 点击页码
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
   * 输入页码
   */
  const handleInputPage = (e: ChangeEvent<HTMLInputElement>) => {
    // 合法性交由 blur 判断
    setInputPage(e.target.value);
  };

  /**
   * 输入改变页码
   */
  const handleBlurPage = (e: ChangeEvent<HTMLInputElement>) => {
    const page = Number(e.target.value);
    if (!page || isNaN(page)) {
      setInputPage('');
      return;
    }
    const { pages, current, pageSize } = pagination;
    const validRange = page >= 1 && page <= pages;
    if (page === current) {
      // 相等时不清空
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
   * 分页数改变
   */
  const handleChangePageSize = (option: IOption) => {
    const { current, total } = pagination;
    const pageSize = Number(option.value);
    if (onPageSizeChange) {
      onChange && onChange(current, pageSize);
      onPageSizeChange(current, pageSize);
      return;
    }
    const pages = Math.ceil(total / pageSize);
    const page = current > pages ? pages : current;
    setPagination((val) => ({ ...val, pageSize, pages, current: page }));
  };

  /**
   * 总数渲染
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
      <PaginationTotal>{t(Strings.paginationTotal, lang, [start, end, total])}</PaginationTotal>
    );
  };

  /**
   * 快速跳转
   */
  const renderQuickJump = () => {
    if (!showQuickJump) {
      return null;
    }
    return (
      <PaginationQuickJump>
        <span>{t(Strings.paginationJump, lang)}</span>
        <PaginationInput
          value={inputPage}
          size="small"
          disabled={disabled}
          onChange={handleInputPage}
          onBlur={handleBlurPage}
        />
        <span>{t(Strings.page, lang)}</span>
      </PaginationQuickJump>
    );
  };

  /**
   * 指定每页条数
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
        options={pageSizeOptions.map((v) => ({ label: t(Strings.pageSize, lang, [v]), value: v.toString() }))}
        onSelected={handleChangePageSize}
      />
    );
  };

  /**
   * 渲染省略号
   * @param key id
   * @param start 页码下拉开始
   * @param end 页码下拉结束
   */
  const renderEllipse = (key, start, end) => {
    const options: IOption[] = [];
    for (let i = start; i <= end; i++) {
      options.push({ value: i, label: i.toString() });
    }
    return (
      <Select
        value={pagination.current}
        options={options}
        listStyle={{ width: 50 }}
        hiddenArrow
        disabled={disabled}
        key={key}
        triggerStyle={{
          background: 'none',
          width: 24,
          height: 24,
          padding: 0,
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
   * 渲染页码可视区域
   * @param start 页码开始
   * @param end 页码结束
   * @param type 省略号类型
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
   * 页码渲染
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
        // 后省略号
        rangeStart = 1;
        rangeEnd = SHOW_START_ELLIPSE + (current === SHOW_START_ELLIPSE ? 1 : 0);
        // 始终向右显示一个页码
        if (current === SHOW_START_ELLIPSE) {
          rangeEnd = SHOW_START_ELLIPSE + 1;
        }
        type = PageEllipse.END;
      } else if (current >= pages - SHOW_END_ELLIPSE + 1) {
        // 前省略号
        rangeStart = pages - SHOW_END_ELLIPSE + 1;
        rangeEnd = pages;
        // 始终向左显示一个页码
        if (current === pages - SHOW_END_ELLIPSE + 1) {
          rangeStart = pages - SHOW_END_ELLIPSE;
        }
        type = PageEllipse.START;
      } else {
        // 两侧省略号
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
    <PaginationContainer>
      {renderTotal()}
      {renderPage()}
      {renderChangeSize()}
      {renderQuickJump()}
    </PaginationContainer>
  );
};

export const Pagination = memo(PaginationBase);