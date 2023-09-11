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
import { Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { Api, Selectors } from '@apitable/core';
import { LoadingOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { MemberOptionList } from 'pc/components/list/member_option_list';
import { Portal } from 'pc/components/portal';
import { useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { Z_INDEX } from '../../constant';
import { GENERATOR } from '../../elements';
import { getValidPopupPosition, getValidSelection } from '../../helpers/utils';
import { IVikaEditor } from '../../interface/editor';
import styles from './mention.module.less';

export const MentionPanel = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const searchTextRef = useRef('');
  const state = store.getState();
  const unitMap = Selectors.getUnitMap(state) || {};
  const datasheetId = Selectors.getActiveDatasheetId(state)!;
  const editor = useSlate() as ReactEditor & IVikaEditor;
  const { selection } = editor;

  const [members, setMembers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const { screenIsAtLeast } = useResponsive();

  const setPanelVisibleAndPosition = useCallback(
    (position?: { top: number; left: number }) => {
      const el = wrapRef.current;
      if (!el) {
        return;
      }
      if (position && screenIsAtLeast(ScreenSize.sm)) {
        editor.hasMentionPanel = true;
        visibleRef.current = true;
        el.style.opacity = '1';
        el.style.top = `${position.top}px`;
        el.style.left = `${position.left}px`;
      } else {
        el.removeAttribute('style');
        visibleRef.current = false;
        editor.hasMentionPanel = false;
      }
    },
    [editor, screenIsAtLeast],
  );

  const getMembers = useCallback((keyword = '') => {
    setLoading(true);
    Api.loadOrSearch({ keyword })
      .then((res) => {
        setMembers(res.data?.data ?? []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const { run: searchTextChange } = useDebounceFn(
    (keyword: string) => {
      setIndex(0);
      getMembers(keyword);
      searchTextRef.current = keyword;
    },
    { wait: 200 },
  );

  const insertMention = useCallback(
    (mentionData: any) => {
      const selection = getValidSelection(editor);
      Transforms.select(editor, selection);
      // Need to delete one more @ character
      Transforms.delete(editor, { distance: searchTextRef.current.length + 1, reverse: true, unit: 'character' });
      // Insert an extra space after
      const mention = GENERATOR.mention({ data: mentionData });
      Transforms.insertFragment(editor, [mention, { text: ' ' }]);
    },
    [editor],
  );

  const handleMemberItemClick = useCallback(
    (data: any) => {
      const memberId = data && data[0];
      const member = members.find((item) => item.unitId === memberId);
      if (member) {
        insertMention(member);
      }
      setPanelVisibleAndPosition();
    },
    [members, insertMention, setPanelVisibleAndPosition],
  );

  const handleOk = useCallback(() => {
    const member = members[index];
    if (member) {
      insertMention(member);
    }
    setPanelVisibleAndPosition();
  }, [index, members, insertMention, setPanelVisibleAndPosition]);

  const handleChangeIndex = useCallback(
    (isAdd: boolean) => {
      const length = members.length;
      if (length < 2) {
        return;
      }
      let next = index + (isAdd ? 1 : -1);
      if (next < 0) {
        next = length - 1;
      } else if (next === length) {
        next = 0;
      }
      setIndex(next);
    },
    [index, members.length],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (visibleRef.current) {
        switch (e.code) {
          // up
          case 'ArrowUp': {
            e.preventDefault();
            handleChangeIndex(false);
            break;
          }

          // down
          case 'ArrowDown': {
            e.preventDefault();
            handleChangeIndex(true);
            break;
          }
          // confirm
          case 'Enter': {
            e.preventDefault();
            handleOk();
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleChangeIndex, handleOk]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return;
    }

    if (!selection || !Range.isCollapsed(selection)) {
      setPanelVisibleAndPosition();
      return;
    }
    const [start] = Range.edges(selection);
    const wordBefore = Editor.before(editor, start, { unit: 'word' });
    const beforeWordRange = wordBefore && Editor.range(editor, wordBefore, start);
    const beforeWord = beforeWordRange && Editor.string(editor, beforeWordRange);
    const before = wordBefore && Editor.before(editor, wordBefore);
    const beforeRange = before && Editor.range(editor, before, start);
    const beforeText = beforeRange && Editor.string(editor, beforeRange);
    const testMatchText = beforeText || beforeWord;
    const beforeMatch = testMatchText && testMatchText.match(/^.*@([\u4e00-\u9fa5\w]{1,5})?$/);
    const after = Editor.after(editor, start);
    const afterRange = Editor.range(editor, start, after);
    const afterText = Editor.string(editor, afterRange);
    const afterMatch = afterText.match(/^(\s|$)/);
    const wordBeforePath = wordBefore && [...wordBefore.path];
    const startPath = [...start.path];
    // The last level is text node, need to compare the path of the previous level node
    wordBeforePath && wordBeforePath.pop();
    startPath.pop();
    const isSameBlock = wordBeforePath && Path.equals(wordBeforePath, startPath);
    if (!beforeMatch || !afterMatch || !isSameBlock) {
      el.removeAttribute('style');
      visibleRef.current = false;
      return;
    }

    const domRange = ReactEditor.toDOMRange(editor, selection);
    const rect = domRange?.getBoundingClientRect();
    if (rect && rect.x === 0 && rect.y === 0 && rect.width === 0) {
      return;
    }
    searchTextChange(beforeMatch[1] || '');
    const position = getValidPopupPosition({
      anchor: rect,
      popup: el.getBoundingClientRect(),
      offset: { x: 0, y: rect.height },
    });
    setPanelVisibleAndPosition(position);
  }, [editor, selection, searchTextChange, setPanelVisibleAndPosition]);

  return (
    <Portal zIndex={Z_INDEX.HOVERING_TOOLBAR}>
      <div className={styles.wrap} ref={wrapRef}>
        {loading ? (
          <div className={styles.loading}>
            <Spin size="small" indicator={<LoadingOutlined className="circle-loading" />} />
          </div>
        ) : (
          <MemberOptionList
            listData={members}
            showMoreTipButton={false}
            uniqId="unitId"
            unitMap={unitMap}
            showSearchInput={false}
            sourceId={datasheetId}
            onClickItem={handleMemberItemClick}
            multiMode={false}
            activeIndex={index}
            existValues={[]}
          />
        )}
      </div>
    </Portal>
  );
};
