import { useKeyPress } from 'ahooks';
import { useState, useEffect } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { getArrayLoopIndex } from '@apitable/core';
import { Input } from 'antd';

export interface IUseSelectProps {
  inputRef?: React.RefObject<Input>;
  containerRef?: React.RefObject<HTMLDivElement>;
  listLength: number;
  listContainerRef?: React.RefObject<HTMLDivElement>;
  activeItemClass?: string;
  onEnter?: (index: number) => void;
}

export const useSelectIndex = (props: IUseSelectProps) => {
  const [index, setIndex] = useState(-1);
  const { inputRef, listContainerRef, activeItemClass, listLength, onEnter, containerRef } = props;
  const isEditing = () => {
    if (inputRef) {
      return document.activeElement === ReactDOM.findDOMNode(inputRef.current?.input) ||
        document.activeElement === inputRef.current;
    }
    if (containerRef && containerRef.current) {
      return containerRef.current.contains(document.activeElement);
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
    if (!listContainerRef?.current) { return; }
    if (index === -1) {
      if (listContainerRef?.current) {
        listContainerRef?.current.scrollTo(0, 0);
      }
    }
  }, [index, listContainerRef]);

  useKeyPress('UpArrow', e => {
    updateIndex(e, -1);
  });
  useKeyPress('DownArrow', e => {
    updateIndex(e, +1);
  });
  useKeyPress('Enter', e => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (isEditing()) {
      onEnter && index > -1 && onEnter(index);
    }
  });
  return { index, setIndex };
};
