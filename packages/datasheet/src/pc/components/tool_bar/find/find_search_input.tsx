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

import { useDebounce, useClickAway } from 'ahooks';
import classNames from 'classnames';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as React from 'react';
import { Loading, useThemeColors } from '@apitable/components';
import { getArrayLoopIndex, Selectors, StoreActions, Strings, t, ViewType } from '@apitable/core';
import { ChevronDownOutlined, ChevronUpOutlined, CloseCircleFilled, SearchOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { ButtonPlus, Tooltip } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { KeyCode } from 'pc/utils';
import { dispatch } from 'pc/worker/store';
import styles from './styles.module.less';

interface ISearchPanelProps {
  setVisible(visible: boolean): void;
  keyword: string;
  setKeyword(keyword: string): void;
}

interface ISearchInputRef {
  select(): void;
}
const wrapperClassName = styles.findSearchInput;
export const SearchInputBase: React.ForwardRefRenderFunction<ISearchInputRef, ISearchPanelProps> = (props, ref) => {
  const { setVisible, keyword, setKeyword } = props;
  const colors = useThemeColors();
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const _keyword = useDebounce(keyword, { wait: 300 });
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const searchKeyword = useAppSelector(Selectors.getSearchKeyword);
  const currentView = useAppSelector(Selectors.getCurrentView);
  const searchResultCursorIndex = useAppSelector(Selectors.getSearchResultCursorIndex);
  const searchResultArray = useAppSelector(Selectors.getSearchResult);
  const calcSearching = useAppSelector(Selectors.getComputedStatus)?.computing;
  const searchResultItemCount = (searchResultArray && searchResultArray.length) || 0;
  const lock = useRef(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  useClickAway(
    () => {
      if (!keyword) {
        setVisible(false);
      }
    },
    () => document.querySelector('.' + wrapperClassName),
  );
  useImperativeHandle(ref, () => ({
    select: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
  }));

  useEffect(() => {
    if (lock.current) return;
    setIsSearching(true);
    dispatch(StoreActions.setSearchKeyword(datasheetId, _keyword.trim()));
    setIsSearching(false);
  }, [_keyword, refreshIndex, datasheetId]);

  useEffect(() => {
    dispatch(StoreActions.setSearchResultCursorIndex(datasheetId, 0));
  }, [searchKeyword, datasheetId]);

  const setCursorIndex2Pre = () => {
    inputRef.current?.focus();
    if (searchResultCursorIndex != null) {
      const newIndex = getArrayLoopIndex(searchResultItemCount, searchResultCursorIndex, -1);
      dispatch(StoreActions.setSearchResultCursorIndex(datasheetId, newIndex));
    }
  };

  const setCursorIndex2Next = () => {
    inputRef.current?.focus();
    if (searchResultCursorIndex != null) {
      const newIndex = getArrayLoopIndex(searchResultItemCount, searchResultCursorIndex, +1);
      dispatch(StoreActions.setSearchResultCursorIndex(datasheetId, newIndex));
    }
  };

  const close = () => {
    setKeyword('');
    setVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Enter) {
      if (e.shiftKey) return setCursorIndex2Pre();
      return setCursorIndex2Next();
    }
    return;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent) => {
    // Reference: https://zhuanlan.zhihu.com/p/106805657
    if (e.type === 'compositionstart') {
      lock.current = true;
      return;
    }
    if (e.type === 'compositionend') {
      lock.current = false;
      // chrome: compositionstart --> input --> compositionend
      // firefox: compositionstart --> compositionend --> input
      setKeyword((e as React.ChangeEvent<HTMLInputElement>).target.value);
      // Active search is triggered once when ending Chinese input.
      setRefreshIndex(refreshIndex + 1);
      return;
    }
    setKeyword((e as React.ChangeEvent<HTMLInputElement>).target.value);
  };

  const shouldShowFoundText = Boolean(!isSearching && searchKeyword);
  const shouldBanPrevNextButton = !shouldShowFoundText || searchResultItemCount < 1;

  const countText = calcSearching ? (
    <Loading />
  ) : searchResultCursorIndex != null ? (
    `${searchResultItemCount > 0 ? searchResultCursorIndex + 1 : 0} / ${searchResultItemCount}`
  ) : (
    ''
  );
  return (
    <div
      className={classNames(wrapperClassName, {
        [styles.darkBg]: currentView && (currentView.type === ViewType.Kanban || currentView.type === ViewType.OrgChart),
      })}
    >
      <span className={styles.searchIcon}>
        <SearchOutlined size={16} />
      </span>
      <div className={styles.inputTextGroup}>
        <span className={styles.searchInputWrap}>
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleChange}
            onCompositionEnd={handleChange}
            placeholder={t(Strings.find)}
            autoFocus
          />
        </span>

        {shouldShowFoundText && searchResultCursorIndex != null && <span className={styles.searchCountText}>{countText}</span>}
      </div>
      {!calcSearching && keyword && (
        <div className={styles.iconGroup}>
          <div className={styles.slash} />
          <ButtonPlus.Icon
            disabled={shouldBanPrevNextButton}
            onClick={setCursorIndex2Pre}
            className={styles.prevBtn}
            icon={
              <Tooltip title={t(Strings.find_prev)} placement="top">
                <span>
                  <ChevronUpOutlined size={16} color={colors.secondLevelText} />
                </span>
              </Tooltip>
            }
          />
          <ButtonPlus.Icon
            disabled={shouldBanPrevNextButton}
            onClick={setCursorIndex2Next}
            className={styles.nextBtn}
            icon={
              <Tooltip title={t(Strings.find_next)} placement="top">
                <span>
                  <ChevronDownOutlined size={16} color={colors.secondLevelText} />
                </span>
              </Tooltip>
            }
          />
          <span className={styles.closeButton} onClick={close}>
            <CloseCircleFilled size={16} />
          </span>
        </div>
      )}
    </div>
  );
};
export const FindSearchInput = forwardRef(SearchInputBase);
