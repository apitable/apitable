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
import { stopPropagation, useListenVisualHeight } from 'helper';
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { IListDeprecateProps, IListItemProps } from './interface';
import { ListSearch } from './list_search.ignore';
import { FootWrapper, ResultSpan, StyledListItem, StyledListWrapper, WrapperDiv } from './styled';
import { useListInteractive } from './use_list_interactive';
import styled from 'styled-components';

export const ListDeprecate: React.FC<React.PropsWithChildren<IListDeprecateProps>> & { Item: React.FC<React.PropsWithChildren<IListItemProps>> } = (props) => {
  const {
    children, noDataTip = 'empty data', activeIndex: DraftActiveIndex,
    footerComponent, onClick, className,
    searchProps, triggerInfo, autoHeight = false
  } = props;

  const [keyword, setKeyword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const childrenCount = React.Children.count(children);
  const { setActiveIndex, activeIndex } = useListInteractive({
    activeItemClass: 'hoverBg',
    listLength: childrenCount,
    containerRef: containerRef,
    listContainerRef: listRef,
  });
  const { style } = useListenVisualHeight({
    listenNode: containerRef,
    childNode: listRef,
    triggerInfo,
    maxHeight: 300,
    minHeight: 30,
    position: 'relative-absolute',
  });

  useEffect(() => {
    if (DraftActiveIndex == null) {
      return;
    }
    setActiveIndex(DraftActiveIndex);
  }, [DraftActiveIndex, setActiveIndex]);

  const clearStatus = useCallback(() => {
    setKeyword('');
    setActiveIndex(-1);
  }, [setKeyword, setActiveIndex]);

  useEffect(() => {
    clearStatus();
  }, [setActiveIndex, clearStatus]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [keyword, childrenCount, setActiveIndex]);

  const cloneChild = () => {
    return React.Children.map(children, (item) => {
      const props = item?.['props'];

      if (!React.isValidElement<IListItemProps>(item)) {
        return item;
      }

      const child: React.ReactElement<IListItemProps> = item;

      const cloneSelf = () => {
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
            onClick(e, child.props.currentIndex);
            if (!searchProps) {
              return;
            }
            searchProps.inputRef && searchProps.inputRef.current && searchProps.inputRef.current.focus();
          },
          className: classNames({
            hoverBg: activeIndex === child.props.currentIndex,
          }, child.props.className),
        });
      };
      // console.log('000', child);
      // if (
      //   ((child.type as any)['name'] && (child.type as any)['name'] === "Item") ||
      //   ((child.type as any)['displayName'] && (child.type as any)['displayName'] === "Styled(Item)")
      // ) {
      //   console.log('123');
      //   return child.props.wrapperComponent ? child.props.wrapperComponent(cloneSelf()) : cloneSelf();
      // }
      return cloneSelf();
    });
  };

  const childs = cloneChild();

  const keydownForContainer = (e: React.KeyboardEvent) => {
    if (e.keyCode !== 13) {
      return;
    }
    stopPropagation(e);
    if (activeIndex < 0) {
      return;
    }
    const { props: { disabled }} = childs?.[activeIndex] as React.ReactElement;
    if (disabled) {
      return;
    }
    onClick(null, activeIndex);
  };

  const showNoDataTip = Boolean(!keyword.length && !childrenCount);
  const blackTip = typeof noDataTip === 'function' ? noDataTip() : noDataTip;

  const showNoSearchResult = Boolean(keyword.length && !childrenCount);

  return <WrapperDiv
    ref={containerRef}
    tabIndex={0}
    onKeyDown={keydownForContainer}
    className={className}
  >
    {/* search part */}
    {
      searchProps && <ListSearch setKeyword={setKeyword} keyword={keyword} {...searchProps} />
    }
    {/* list part */}
    {
      (showNoDataTip || showNoSearchResult) && <ResultSpan>
        {
          blackTip
        }
      </ResultSpan>
    }
    {
      Boolean(childrenCount) && <StyledListWrapper
        ref={listRef}
        style={autoHeight ? style : undefined}
      >
        {childs}
      </StyledListWrapper>
    }

    {
      footerComponent && Boolean(footerComponent()) &&
      <FootWrapper onClick={clearStatus}>
        {footerComponent()}
      </FootWrapper>
    }
  </WrapperDiv>;
};

const StyledDiv = styled.div`
  width: 100%;
  
  &:focus-visible {
    outline: none;    
  }
`;

// FIXME: line color
export const ListDeprecateItem= React.forwardRef<HTMLDivElement, PropsWithChildren<any>> ((props) => {
  const { currentIndex, selected, children, setRef, className, active, ...rest } = props;

  return <StyledListItem
    data-tab-index={currentIndex}
    active={active}
    selected={selected}
    className={className}
    variant={'body2'}
  >
    <StyledDiv
      style={{
        width: '100%'
      }}
      role={'option'}
      ref={setRef}
      {...rest}
    >
      {
        children
      }
    </StyledDiv>
  </StyledListItem>;
});

// @ts-ignore
ListDeprecate.Item = ListDeprecateItem;
