import { useKeyPress } from 'ahooks';
import type { InputRef } from 'antd';
import { getArrayLoopIndex } from 'helper';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export interface IUseSelectProps {
  inputRef?: React.RefObject<InputRef>;
  containerRef?: React.RefObject<HTMLDivElement>;
  listLength: number;
  listContainerRef?: React.RefObject<HTMLDivElement>;
  activeItemClass?: string;
  onEnter?: (index: number) => void;
  onArrowRightPress?: (index: number) => void;
  onArrowLeftPress?: (index: number) => void;
  onEscapePress?: () => void;
}

export const useSelectIndex = (props: IUseSelectProps) => {
  const [index, setIndex] = useState(-1);
  const { inputRef, listContainerRef, onArrowRightPress, onEscapePress,
    onArrowLeftPress, activeItemClass, listLength, onEnter, containerRef } = props;
  const isEditing = () => {
    if (inputRef) {
      return document.activeElement === ReactDOM.findDOMNode(inputRef.current?.input) ||
        document.activeElement === inputRef.current;
    }
    if (containerRef) {
      return containerRef.current!.contains(document.activeElement);
    }
    return false;
  };
  const updateIndex = (e: KeyboardEvent, plusOrNot: number) => {
    if (isEditing()) {
      e.preventDefault();
      setIndex(getArrayLoopIndex(listLength, index, plusOrNot));
      // 跟随滚动到当前列表的激活项
      if (listContainerRef?.current && activeItemClass) {
        const activeElem = listContainerRef.current.querySelector(activeItemClass);
        activeElem && activeElem.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  useEffect(() => {
    setIndex(-1);
    // 长度变化时，重置index
  }, [listLength]);

  useEffect(() => {
    if (!listContainerRef?.current) { return; }
    if (index === -1) {
      listContainerRef && listContainerRef!.current!.scrollTo(0, 0);
    }
  }, [index, listContainerRef]);

  useKeyPress('UpArrow', e => {
    updateIndex(e, -1);
  });
  useKeyPress('DownArrow', e => {
    updateIndex(e, +1);
  });

  useKeyPress('RightArrow', e => {
    onArrowRightPress && onArrowRightPress(index);
  });
  useKeyPress('LeftArrow', e => {
    onArrowLeftPress && onArrowLeftPress(index);
  });

  useKeyPress('Enter', e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (isEditing()) {
      onEnter && index > -1 && onEnter(index);
    }
  });

  useKeyPress('Esc', e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    onEscapePress && onEscapePress();
  });

  return { index, setIndex };
};
