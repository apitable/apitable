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
import { Tooltip } from 'antd';
import { useCallback, useContext, useLayoutEffect, FC, useState } from 'react';
import * as React from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { useThemeColors } from '@apitable/components';
import { getElementDataset } from 'pc/utils';
import { toggleBlock, toggleMark, updateElementData, wrapLink, insertLink } from '../../commands';
import { MARK_LIST, SELECT_ELEMENT, ALIGN, ALIGN_LIST, ElementType, Z_INDEX, MarkType } from '../../constant';
import { EditorContext } from '../../context';
import { getCurrentElement, isMarkActive, getValidSelection, getValidElementType, getMarkValue } from '../../helpers/utils';
import { hotkeyMap } from '../../hotkeys/map';
import Icons from '../icons';

import { Select } from '../select';
import { useListWithIcons, useListWithIconAndHotkey } from '../use_list';
import { HighlightPicker } from './highlight_picker';
import { LinkInput } from './link_input';

import styles from './style.module.less';

interface IToolbarProps {
  borderLess?: boolean;
}

export const Toolbar: FC<React.PropsWithChildren<IToolbarProps>> = ({ borderLess }) => {
  const colors = useThemeColors();
  const { i18nText, mode } = useContext(EditorContext);
  const editor = useSlate() as ReactEditor;
  const [curElementType, setCurElementType] = useState(ElementType.PARAGRAPH);
  const curElement = getCurrentElement(editor);
  const curElementAlign = (curElement && curElement.data && (curElement.data.align as ALIGN)) || ALIGN.LEFT;
  // const curElementText = curElement ? Node.string(curElement) : '';
  const curSelectedText = Editor.string(editor, getValidSelection(editor));

  const blockList = useListWithIconAndHotkey(SELECT_ELEMENT);
  const alignList = useListWithIcons(ALIGN_LIST);
  const isFullMode = mode === 'full';

  const handleElementTypeChange = useCallback(
    (block: any) => {
      toggleBlock(editor, block);
    },
    [editor],
  );

  const handleElementAlignChange = useCallback(
    (align: any) => {
      updateElementData(editor, { align });
    },
    [editor],
  );

  const handleMarkItemMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Prevent the editor from losing focus
      e.stopPropagation();
      e.preventDefault();
      const target = e.currentTarget;
      if (!target) {
        return;
      }
      const mark = getElementDataset(target as HTMLSpanElement, 'mark');
      if (!mark) {
        return;
      }
      toggleMark(editor, mark);
    },
    [editor],
  );

  const handleHighlightChange = useCallback(
    (next: any) => {
      const validSelection = getValidSelection(editor);
      ReactEditor.focus(editor);
      Transforms.select(editor, validSelection);
      if (next) {
        Editor.addMark(editor, MarkType.HIGHLIGHT, Number(next));
      } else {
        Editor.removeMark(editor, MarkType.HIGHLIGHT);
      }
    },
    [editor],
  );

  const handleInsertLinkNode = (data: { link: string; text: string }) => {
    const validSelection = getValidSelection(editor);
    ReactEditor.focus(editor);
    Transforms.select(editor, validSelection);
    if (curSelectedText) {
      wrapLink(editor, data.link);
    } else {
      insertLink(editor, data.link, data.text);
    }
  };

  const { run: changeElementTypeAfterLayout } = useDebounceFn(
    () => {
      setCurElementType(getValidElementType(editor, curElement));
    },
    {
      wait: 200,
    },
  );

  useLayoutEffect(() => {
    changeElementTypeAfterLayout();
  });

  const renderAlignTrigger = (align: string) => {
    const AlignIcon = Icons[align];
    return <AlignIcon />;
  };
  const renderElementTypeTrigger = (type: string) => {
    const Icon = Icons[type] || Icons.paragraph;
    return <Icon />;
  };

  const handleElementTypeSelectVisibleChange = useCallback(() => {
    try {
      ReactEditor.focus(editor);
      Transforms.select(editor, getValidSelection(editor));
    } catch (error) {
      console.log('select selection error: ', error);
    }
  }, [editor]);

  const handleToolbarWrapClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const MarksTool = MARK_LIST.map((mark) => {
    const isActive = isMarkActive(editor, mark);
    const MarkIcon = Icons[mark];
    return (
      <Tooltip
        overlayClassName="editor-tooltip"
        key={mark}
        title={
          <span className={styles.markTooltip}>
            {i18nText[mark]}
            <br />
            {hotkeyMap[mark].platform}
          </span>
        }
        placement="top"
      >
        <span key={mark} className={styles.toolbarItem} data-mark={mark} onMouseDown={handleMarkItemMouseDown} data-active={isActive}>
          <MarkIcon color={isActive ? colors.primaryColor : colors.secondLevelText} />
        </span>
      </Tooltip>
    );
  });

  return (
    <div className={styles.toolbarWrap} data-border-less={borderLess} onClick={handleToolbarWrapClick}>
      {isFullMode && (
        <Select
          className={styles.toolbarItem}
          onChange={handleElementTypeChange}
          customRenderTrigger={renderElementTypeTrigger}
          value={curElementType}
          zIndex={Z_INDEX.TOOLBAR_SELECT}
          offset={{ x: 0, y: 12 }}
          destroyPopupOnHide={false}
          selectedSignVisible={false}
          width={240}
          onVisibleChange={handleElementTypeSelectVisibleChange}
          options={blockList}
        />
      )}
      {/* <Divider className={styles.divider} type="vertical" /> */}
      {/* <Divider className={styles.divider} type="vertical" /> */}
      {MarksTool}
      <HighlightPicker onChange={handleHighlightChange} value={getMarkValue(editor, MarkType.HIGHLIGHT)} />
      {/* <Divider className={styles.divider} type="vertical" /> */}
      {isFullMode && <LinkInput defaultText={curSelectedText} onOK={handleInsertLinkNode} />}
      {isFullMode && (
        <Select
          className={styles.toolbarItem}
          activeClassName={styles.toolbarItemActive}
          customRenderTrigger={renderAlignTrigger}
          onChange={handleElementAlignChange}
          value={curElementAlign}
          options={alignList}
          zIndex={Z_INDEX.TOOLBAR_SELECT}
          offset={{ x: 0, y: 12 }}
          triggerArrowVisible={false}
          selectedSignVisible={false}
          width={160}
        />
      )}
    </div>
  );
};
