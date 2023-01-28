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
      // Follow the active item scrolled to the list
      if (listContainerRef?.current && activeItemClass) {
        const activeElem = listContainerRef.current.querySelector(activeItemClass);
        activeElem && activeElem.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  useEffect(() => {
    setIndex(-1);
    // Reset the index when the length changes
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

  useKeyPress('RightArrow', () => {
    onArrowRightPress && onArrowRightPress(index);
  });
  useKeyPress('LeftArrow', () => {
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
