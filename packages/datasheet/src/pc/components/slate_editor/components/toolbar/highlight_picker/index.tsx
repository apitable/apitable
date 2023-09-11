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

import { useClickAway } from 'ahooks';
import { Tooltip } from 'antd';
import RcTrigger from 'rc-trigger';
import { useCallback, useContext, useRef, useState } from 'react';
import * as React from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { useThemeColors } from '@apitable/components';
import { HighlightOutlined } from '@apitable/icons';

import { getElementDataset } from 'pc/utils';
import { Z_INDEX, HIGHLIGHT_COLORS } from '../../../constant';
import { EditorContext } from '../../../context';
import { getValidSelection } from '../../../helpers/utils';

import styles from './style.module.less';

interface IColorPickerProps {
  onChange: (color: string) => void;
  value: string | null;
  disabled?: boolean;
}

export const HighlightPicker = ({ onChange, disabled = false, value }: IColorPickerProps) => {
  const colors = useThemeColors();
  const { i18nText } = useContext(EditorContext);
  const [visible, setVisible] = useState(false);
  const editor = useSlate() as ReactEditor;

  const triggerRef = useRef(null);

  useClickAway(() => {
    setVisible(false);
  }, triggerRef);

  const highlightColor = value == null ? colors.secondLevelText : typeof value === 'string' ? value : HIGHLIGHT_COLORS.select[Number(value)];

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    const target = e.currentTarget as HTMLLIElement;
    const color = getElementDataset(target, 'color') || '';
    onChange(color);
  };

  const handleVisibleChange = useCallback(
    (next: any) => {
      setVisible(disabled ? false : next);
      try {
        ReactEditor.focus(editor);
        Transforms.select(editor, getValidSelection(editor));
      } catch (error) {
        console.log('select selection error: ', error);
      }
    },
    [disabled, editor],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(!visible);
  };

  const TriggerElement = (
    <Tooltip overlayClassName="editor-tooltip" title={i18nText.highlight}>
      <div className={styles.trigger} data-active={visible} data-disabled={disabled} ref={triggerRef} onMouseDownCapture={handleMouseDown}>
        <HighlightOutlined color={highlightColor} />
      </div>
    </Tooltip>
  );

  const ColorPanel = (
    <ul className={styles.colorPanel}>
      <li className={styles.none} onMouseDownCapture={handleSelect} data-color="" />
      {HIGHLIGHT_COLORS.select.map((color, index) => (
        <li
          key={color}
          onMouseDownCapture={handleSelect}
          data-color={index}
          data-active={highlightColor === color}
          style={{ background: color, color }}
        />
      ))}
    </ul>
  );

  return (
    <RcTrigger
      popup={ColorPanel}
      action={['mousedown']}
      destroyPopupOnHide
      popupAlign={{
        points: ['tc', 'bc'],
        offset: [0, 10],
        overflow: { adjustX: true, adjustY: true },
      }}
      popupStyle={{ width: 300 }}
      popupVisible={visible}
      onPopupVisibleChange={handleVisibleChange}
      zIndex={Z_INDEX.TOOLBAR_LINK_INPUT}
    >
      {TriggerElement}
    </RcTrigger>
  );
};
