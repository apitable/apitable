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

import classNames from 'classnames';
import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Loading } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { ScreenSize } from 'pc/components/common/component_display';
import { PopStructureContext } from 'pc/components/editors/pop_structure/context';
import { useResponsive } from 'pc/hooks';
import { KeyCode, stopPropagation } from 'pc/utils';
import { useListInteractive } from '../use_list_interactive';
import { ICommonListProps, IOptionItemProps } from './common_list.interface';
import { LineSearchInput } from './line_search_input';

import styles from './styles.module.less';

const SEARCH_HEIGHT = 48;
const FOOTER_HEIGHT = 40;
const MAX_HEIGHT = 336;
const MIN_HGEIGHT = 80;
const CLS = 'scroll-color-relative-absolute';

export const CommonList: React.FC<React.PropsWithChildren<ICommonListProps>> & {
  Option: React.FC<React.PropsWithChildren<IOptionItemProps>>;
} = (props) => {
  const {
    inputPlaceHolder,
    showInput,
    inputRef,
    children,
    noDataTip = t(Strings.kanban_no_data),
    onInputEnter,
    activeIndex: DraftActiveIndex,
    noSearchResult = t(Strings.no_search_result),
    footerComponent,
    value,
    onClickItem,
    onSearchChange,
    className,
    monitorId,
    inputStyle,
    getListContainer,
    onInputClear,
    isLoadingData,
  } = props;
  const { restHeight } = useContext(PopStructureContext);
  const [listHeight, setListHeight] = useState(MAX_HEIGHT);
  const [keyword, setKeyword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const childrenCount = React.Children.count(children);
  const { setActiveIndex, activeIndex } = useListInteractive({
    activeItemClass: styles.hoverBg,
    listLength: childrenCount,
    containerRef: containerRef,
    listContainerRef: listRef,
  });

  const getEditingStatus = () => {
    if (monitorId) {
      return monitorId.split(',')[2] === 'true';
    }
    return true;
  };

  useEffect(() => {
    if (DraftActiveIndex == null) {
      return;
    }
    setActiveIndex(DraftActiveIndex);
  }, [DraftActiveIndex, setActiveIndex]);

  const clearStatus = useCallback(() => {
    setKeyword('');
    setActiveIndex(-1);
    onSearchChange && onSearchChange(null, '');
    // eslint-disable-next-line
  }, [setKeyword, setActiveIndex]);

  useEffect(() => {
    clearStatus();
    // eslint-disable-next-line
  }, [monitorId, setActiveIndex]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [keyword, childrenCount, setActiveIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const ele = listRef.current;
    if (!restHeight || !ele || !container) {
      return;
    }
    const subHeaderHeight = showInput ? SEARCH_HEIGHT : 0;
    const subFooterHeight = footerComponent && Boolean(footerComponent()) ? FOOTER_HEIGHT : 0;
    const actualHeight = restHeight - subHeaderHeight - subFooterHeight;
    // Determine if it is greater than the remaining height
    let finalHeight = 0;
    if (ele.clientHeight > restHeight) {
      finalHeight = actualHeight < MIN_HGEIGHT ? MIN_HGEIGHT : actualHeight;
    } else {
      finalHeight = restHeight > MAX_HEIGHT ? MAX_HEIGHT : actualHeight;
    }
    finalHeight = finalHeight < 60 ? finalHeight : finalHeight - 20;
    setListHeight(finalHeight);

    const scrollHeight = ele.scrollHeight;

    const parent = ele.parentElement as HTMLElement;
    if (scrollHeight < finalHeight) {
      parent.classList.remove(CLS);
      return;
    }
    if (parent.classList.contains(CLS)) {
      return;
    }
    parent.classList.add(CLS);
  }, [restHeight, showInput, footerComponent, listRef, containerRef]);

  // Listen for scrolling changes and add scrollable hint color values
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const ele = e.target as HTMLElement;
    const parent = ele.parentElement as HTMLElement;
    const curTop = ele.scrollTop + ele.clientHeight;
    if (curTop > ele.scrollHeight - 10) {
      parent.classList.remove(CLS);
      return;
    }
    if (parent.classList.contains(CLS)) {
      return;
    }
    parent.classList.add(CLS);
  };

  // TODO: Add throttle
  const changInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target!.value);
    onSearchChange && onSearchChange(e, e.target!.value);
  };

  const cloneChild = () => {
    return React.Children.map(children, (item) => {
      const props = item?.['props'];

      if (!React.isValidElement<IOptionItemProps>(item)) {
        return item;
      }

      const child: React.ReactElement<IOptionItemProps> = item;

      function cloneSelf() {
        return React.cloneElement(child, {
          onMouseOver: (e: React.MouseEvent) => {
            props.onMouseOver && props.onMouseOver(e);
            // onHoverListItem(e);
          },
          onMouseOut: (e: React.MouseEvent) => {
            props.onMouseOut && props.onMouseOut(e);
            // onOutListItem(e);
          },
          onClick(e: React.MouseEvent) {
            if (child.props.disabled) {
              return;
            }
            onClickItem(e, child.props.currentIndex);
            if (isMobile) {
              return;
            }
            inputRef?.current && inputRef?.current.focus();
          },
          isChecked: value ? value.includes(child.props.id) : false,
          className: classNames(
            {
              [styles.hoverBg]: activeIndex === child.props.currentIndex,
            },
            child.props.className,
          ),
        });
      }

      if (child.type === CommonList.Option) {
        return child.props.wrapperComponent ? child.props.wrapperComponent(cloneSelf()) : cloneSelf();
      }
      return child;
    });
  };

  function keydownForContainer(e: React.KeyboardEvent) {
    if (e.keyCode !== KeyCode.Enter) {
      return;
    }
    const editing = getEditingStatus();
    if (!editing) {
      return;
    }
    if (editing) {
      stopPropagation(e);
    }
    if (activeIndex < 0) {
      return;
    }
    onClickItem(null, activeIndex);
  }

  function inputKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode !== KeyCode.Enter) {
      return;
    }
    const editing = getEditingStatus();
    if (editing) {
      onInputEnter &&
        onInputEnter(() => {
          setKeyword('');
        });
    }
  }

  const showNoDataTip = Boolean(!keyword.length && !childrenCount);
  const _noDataTip = typeof noDataTip === 'string' ? noDataTip : noDataTip && noDataTip();

  const showNoSearchResult = Boolean(keyword.length && !childrenCount);
  const _noSearchResultTip = typeof noSearchResult === 'string' ? noSearchResult : noSearchResult && noSearchResult();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div ref={containerRef} tabIndex={0} onKeyDown={keydownForContainer} className={classNames(styles.listContainer, className)}>
      {/* Search section */}
      {showInput && (
        <div className={styles.searchField} style={inputStyle}>
          <LineSearchInput
            onKeyDown={inputKeydown}
            onChange={changInput}
            value={keyword}
            onClear={() => {
              setKeyword('');
              onInputClear?.();
              onSearchChange && onSearchChange(null, '');
            }}
            placeholder={inputPlaceHolder}
            ref={inputRef}
            allowClear
          />
        </div>
      )}
      {/* List section */}
      {isLoadingData ? (
        <div className={'vk-my-2'}>
          <Loading />
        </div>
      ) : (
        (showNoDataTip || showNoSearchResult) && <span className={styles.noResult}>{showNoDataTip ? _noDataTip : _noSearchResultTip}</span>
      )}
      {Boolean(childrenCount) && (
        <div>
          <div
            ref={listRef}
            className={classNames('listBox', styles.listBox)}
            style={{ maxHeight: listHeight }}
            onScroll={!isMobile ? handleScroll : undefined}
          >
            {getListContainer ? getListContainer(cloneChild()) : cloneChild()}
          </div>
        </div>
      )}

      {footerComponent && Boolean(footerComponent()) && (
        <div className={styles.footerContainer} onClick={clearStatus}>
          {footerComponent()}
        </div>
      )}
    </div>
  );
};

CommonList.Option = (props) => {
  const { currentIndex, children, isChecked, className, ...rest } = props;
  return (
    <div
      role={'option'}
      data-tab-index={currentIndex}
      className={classNames(styles.optionItem, className, {
        [styles.isChecked]: isChecked,
        ['isChecked']: isChecked,
      })}
      {...rest}
    >
      {children}
    </div>
  );
};
