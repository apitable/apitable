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

import { useUnmount } from 'ahooks';
import type { InputRef } from 'antd';
import { Input } from 'antd';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IconButton, LinkButton, useThemeColors } from '@apitable/components';
import { StoreActions, Strings, t } from '@apitable/core';
import { CloseCircleFilled, SearchOutlined } from '@apitable/icons';
import { useDispatch } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import styles from './style.module.less';

interface IFind {
  datasheetId: string;
}

interface ISearch extends IFind {
  onClose(): void;
}

const Search: React.FC<React.PropsWithChildren<ISearch>> = ({ datasheetId, onClose }) => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const [keyword, setKeyword] = useState('');

  const lock = useRef<boolean>(false);

  const [refreshIndex, setRefreshIndex] = useState(0);

  const inputRef = useRef<InputRef>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent) => {
    if (e.type === 'compositionstart') {
      lock.current = true;
      return;
    }
    if (e.type === 'compositionend') {
      lock.current = false;
      setRefreshIndex(refreshIndex + 1);
      return;
    }
    setKeyword((e as React.ChangeEvent<HTMLInputElement>).target.value);
  };

  useEffect(() => {
    dispatch(StoreActions.setSearchResultCursorIndex(datasheetId, 0));
  }, [keyword, dispatch, datasheetId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    dispatch(StoreActions.setSearchKeyword(datasheetId, keyword));
  }, [dispatch, refreshIndex, keyword, datasheetId]);

  useUnmount(() => {
    dispatch(StoreActions.setSearchKeyword(datasheetId, ''));
  });

  return (
    <div className={styles.wrapper}>
      <Input
        className={styles.search}
        size="small"
        autoFocus
        prefix={<SearchOutlined size={16} color={colors.fc3} />}
        onChange={onChange}
        value={keyword}
        ref={inputRef}
        placeholder={t(Strings.find)}
        suffix={
          keyword.length !== 0 && (
            <div
              className={styles.clear}
              onClick={() => {
                setKeyword('');
                inputRef.current?.focus();
              }}
            >
              <CloseCircleFilled size={14} />
            </div>
          )
        }
        onCompositionStart={onChange}
        onCompositionEnd={onChange}
      />

      <div className={styles.cancel}>
        <LinkButton
          onClick={onClose}
          style={{
            color: colors.fc2,
          }}
          underline={false}
        >
          {t(Strings.cancel)}
        </LinkButton>
      </div>
    </div>
  );
};

export const Find: React.FC<React.PropsWithChildren<IFind>> = ({ datasheetId }) => {
  const [visible, setVisible] = useState(false);
  const colors = useThemeColors();
  const viewId = useAppSelector((state) => state.pageParams.viewId);

  useEffect(() => {
    setVisible(false);
  }, [viewId]);

  return (
    <>
      <IconButton onClick={() => setVisible(true)} className={styles.find} icon={() => <SearchOutlined size={16} color={colors.fc2} />} />
      {visible && <Search datasheetId={datasheetId} onClose={() => setVisible(false)} />}
    </>
  );
};
