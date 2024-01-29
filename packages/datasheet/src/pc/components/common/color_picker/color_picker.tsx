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
import RcTrigger from 'rc-trigger';
import { forwardRef, useImperativeHandle, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Selectors } from '@apitable/core';
import { setColor } from 'pc/components/multi_grid/format';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from '../../../utils/dom';
import { ComponentDisplay } from '../component_display';
import { ScreenSize } from '../component_display/enum';
import { ColorPickerMobile } from './color_picker_mobile';
import { ColorPickerPane } from './color_picker_pane';
import { IColorPicker } from './interface';
import styles from './style.module.less';

export interface IColorPickerRef {
  open(): void;
  close(): void;
}

const PICKER_PANE_WIDTH = 292;

const MARGIN_BOTTOM = 40;
const MARGIN_TOP = 8;

const ColorPickerBase: React.ForwardRefRenderFunction<IColorPickerRef, IColorPicker> = (props, ref) => {
  const { showRenameInput, onChange, option, mask, triggerComponent, disabled } = props;
  const [adjustX, setAdjustX] = useState(false);
  const [arrowOffsetY, setArrowOffsetY] = useState(0);
  const [visible, setVisible] = useState(false);
  const cacheTheme = useAppSelector(Selectors.getTheme);
  const fieldEditable = useAppSelector((state) => Selectors.getPermissions(state).manageable);
  const optionColor = setColor(option.color, cacheTheme);

  useImperativeHandle(
    ref,
    (): IColorPickerRef => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }),
  );

  const PICKER_PANE_HEIGHT = showRenameInput ? 357 : 292;

  const expandColorPickerPanel = (e: React.MouseEvent) => {
    stopPropagation(e);
    if (!fieldEditable) {
      return;
    }

    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    if (rect.left - 10 <= PICKER_PANE_WIDTH) {
      setAdjustX(true);
    }
    const overflowBottom = rect.top + (PICKER_PANE_HEIGHT + MARGIN_BOTTOM) / 2 - window.innerHeight;
    if (overflowBottom >= 0) {
      setArrowOffsetY(overflowBottom);
    }

    const overflowTop = rect.top - PICKER_PANE_HEIGHT / 2;
    if (overflowTop < 0) {
      setArrowOffsetY(overflowTop);
    }
    setVisible(!visible);
  };

  const computedPaneHeight = PICKER_PANE_HEIGHT + (arrowOffsetY > 0 ? MARGIN_BOTTOM : 0);

  const onClose = () => {
    setVisible(false);
  };

  const TriggerComponent = triggerComponent || (
    <div className={styles.trigger} style={{ background: optionColor }} onClick={expandColorPickerPanel} />
  );

  const offsetY = arrowOffsetY && (arrowOffsetY > 0 ? arrowOffsetY + 25 : arrowOffsetY + 5 - MARGIN_TOP);

  const PopupComponent = (
    <div
      className={styles.wrapper}
      style={{
        marginTop: arrowOffsetY < 0 ? MARGIN_TOP : 0,
      }}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
    >
      <div
        className={classNames({
          [styles.arrowDisplayLeft]: adjustX,
          [styles.arrowDisplayRight]: !adjustX,
        })}
        style={{ top: PICKER_PANE_HEIGHT / 2 + offsetY }}
      />

      <ColorPickerPane showRenameInput={showRenameInput} onChange={onChange} option={option} onClose={onClose} />
    </div>
  );

  return (
    <>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        {visible &&
          mask &&
          ReactDOM.createPortal(
            <div
              className={styles.mask}
              onMouseDown={stopPropagation}
              onClick={(e) => {
                stopPropagation(e);
                onClose();
              }}
            />,
            document.body,
          )}
        <RcTrigger
          popup={PopupComponent}
          destroyPopupOnHide
          action="click"
          popupAlign={{
            points: ['tl', 'bl'],
            offset: [-PICKER_PANE_WIDTH - 10, -computedPaneHeight / 2 - 10],
            overflow: { adjustX: true, adjustY: true },
          }}
          popupStyle={{
            width: PICKER_PANE_WIDTH,
            height: computedPaneHeight,
            pointerEvents: 'none',
            position: 'absolute',
          }}
          popupVisible={disabled ? false : visible}
          onPopupVisibleChange={(_visible) => setVisible(_visible)}
          zIndex={1100}
        >
          {TriggerComponent}
        </RcTrigger>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div onClick={stopPropagation}>
          {TriggerComponent}
          <ColorPickerMobile showRenameInput={showRenameInput} onChange={onChange} option={option} onClose={onClose} visible={visible} />
        </div>
      </ComponentDisplay>
    </>
  );
};

export const ColorPicker = React.memo(forwardRef(ColorPickerBase));
