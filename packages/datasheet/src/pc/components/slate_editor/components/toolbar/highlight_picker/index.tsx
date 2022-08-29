import { useCallback, useContext, useRef, useState } from 'react';
import * as React from 'react';
import RcTrigger from 'rc-trigger';
import { Tooltip } from 'antd';
import { HighlightFilled } from '@vikadata/icons';
import { useThemeColors } from '@vikadata/components';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';

import { Z_INDEX, HIGHLIGHT_COLORS } from '../../../constant';
import { EditorContext } from '../../../context';
import { getValidSelection } from '../../../helpers/utils';
import { useClickAway } from 'ahooks';

import styles from './style.module.less';
import { getElementDataset } from 'pc/utils';

interface IColorPickerProps {
  onChange: (color: string) => void;
  value: string | null;
  disabled?: boolean;
}

export const HighlightPicker = ({
  onChange,
  disabled = false,
  value,
}: IColorPickerProps) => {
  const colors = useThemeColors();
  const { i18nText } = useContext(EditorContext);
  const [visible, setVisible] = useState(false);
  const editor = useSlate() as ReactEditor;

  const triggerRef = useRef(null);

  useClickAway(() => { setVisible(false); }, triggerRef);

  const highlightColor = value == null ?
    colors.secondLevelText :
    typeof value === 'string' ?
      value : HIGHLIGHT_COLORS.select[Number(value)];

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible(false);
    const target = e.currentTarget as HTMLLIElement;
    const color = getElementDataset(target, 'color') || '';
    onChange(color);
  };

  const handleVisibleChange = useCallback(next => {
    setVisible(disabled ? false : next);
    try {
      ReactEditor.focus(editor);
      Transforms.select(editor, getValidSelection(editor));
    } catch (error) {
      console.log('select selection error: ', error);
    }
  }, [disabled, editor]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setVisible(!visible);
  };

  const TriggerElement = (
    <Tooltip overlayClassName="editor-tooltip" title={i18nText.highlight}>
      <div
        className={styles.trigger}
        data-active={visible}
        data-disabled={disabled}
        ref={triggerRef}
        onMouseDownCapture={handleMouseDown}
      >
        <HighlightFilled color={highlightColor} />
      </div>
    </Tooltip>
  );

  const ColorPanel = (
    <ul className={styles.colorPanel} >
      <li className={styles.none} onMouseDownCapture={handleSelect} data-color="" />
      {
        HIGHLIGHT_COLORS.select.map((color, index) => <li
          key={color}
          onMouseDownCapture={handleSelect}
          data-color={index}
          data-active={highlightColor === color}
          style={{ background: color, color }} />)
      }
    </ul>
  );

  return <RcTrigger
    popup={ ColorPanel }
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
  </RcTrigger>;
};
