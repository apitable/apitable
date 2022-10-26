import classNames from 'classnames';
import { stopPropagation, useListenVisualHeight } from 'helper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IListDeprecateProps, IListItemProps } from './interface';
import { ListSearch } from './list_search.ignore';
import { FootWrapper, ResultSpan, StyledListItem, StyledListWrapper, WrapperDiv } from './styled';
import { useListInteractive } from './use_list_interactive';

export const ListDeprecate: React.FC<IListDeprecateProps> & { Item: React.FC<IListItemProps> } = (props) => {
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

// FIXME: line color
const Item: React.FC<any> = (props) => {
  const { currentIndex, children, className, ...rest } = props;

  return <StyledListItem
    role={'option'}
    data-tab-index={currentIndex}
    className={className}
    {...rest}
    variant={'body2'}
  >
    {
      children
    }
  </StyledListItem>;
};

ListDeprecate.Item = Item;
