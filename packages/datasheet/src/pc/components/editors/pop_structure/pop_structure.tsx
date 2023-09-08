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

import { useDebounceFn } from 'ahooks';
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import * as React from 'react';
import { DEFAULT_COLUMN_WIDTH as MIN_POP_STRUCTURE_WIDTH, t, Strings } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Popup } from 'pc/components/common/mobile/popup';
import { useResponsive } from 'pc/hooks';
import { stopPropagation } from 'pc/utils/dom';
import { PopStructureContext } from './context';

interface IPopStructureProps {
  editing: boolean;
  height: number;
  width: number;
  className: string;
  style?: React.CSSProperties;
  disableMinWidth?: boolean;
  disableMobile?: boolean;
  onClose(): void;
}

const SECURITY_PADDING = 30;

export const PopStructure: React.FC<React.PropsWithChildren<IPopStructureProps>> = (props) => {
  const { children, editing, height, className, style, width, onClose, disableMinWidth, disableMobile } = props;

  const [position, setPosition] = useState({});
  const [restHeight, setRestHeight] = useState(0);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const editContainerRef = useRef<HTMLDivElement>(null);

  const setReflowSize = useCallback(() => {
    if (!editContainerRef.current || !editContainerRef.current.parentElement) {
      return;
    }
    const rect = editContainerRef.current.parentElement.getBoundingClientRect();
    const modal = document.querySelector('.ant-modal');
    const bottomEdge = (modal && modal.getBoundingClientRect().bottom) || window.innerHeight;
    const isOverVertical = rect.top > bottomEdge / 2;
    const isOverHorizontal = rect.left + MIN_POP_STRUCTURE_WIDTH + SECURITY_PADDING > window.innerWidth;

    setRestHeight(isOverVertical ? rect.top : window.innerHeight - rect.top - height);

    setPosition({
      top: !isOverVertical ? height : 'unset',
      bottom: isOverVertical ? 0 : 'unset',
      left: !isOverHorizontal ? 0 : 'unset',
      right: isOverHorizontal ? -width : 'unset',
    });
  }, [height, width]);

  const { run } = useDebounceFn(setReflowSize, {
    wait: 150,
  });

  useLayoutEffect(() => {
    if (!editing) {
      setPosition({
        top: 0,
        left: 0,
      });
      return;
    }

    if (isMobile) {
      return;
    }
    setReflowSize();
  }, [editing, setReflowSize, isMobile]);

  useEffect(() => {
    window.addEventListener('resize', run);
    return () => window.removeEventListener('resize', run);
  }, [run]);

  const context = { restHeight };

  if (disableMobile) {
    return (
      <div
        className={className}
        ref={editContainerRef}
        onClick={stopPropagation}
        onWheel={stopPropagation}
        style={{
          ...style,
          ...position,
          minHeight: 'auto',
          minWidth: disableMinWidth ? 'auto' : style?.width ? MIN_POP_STRUCTURE_WIDTH : 'auto',
        }}
      >
        <PopStructureContext.Provider value={context}>{children}</PopStructureContext.Provider>
      </div>
    );
  }

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <div
          className={className}
          ref={editContainerRef}
          onClick={stopPropagation}
          onWheel={stopPropagation}
          style={{
            ...style,
            ...position,
            minHeight: 'auto',
            minWidth: disableMinWidth ? 'auto' : style?.width ? MIN_POP_STRUCTURE_WIDTH : 'auto',
          }}
        >
          <PopStructureContext.Provider value={context}>{children}</PopStructureContext.Provider>
        </div>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <Popup title={t(Strings.please_choose)} height="80%" open={editing} getContainer={false} onClose={onClose}>
          {children}
        </Popup>
      </ComponentDisplay>
    </>
  );
};
