
import { StoreActions, Strings, t } from '@vikadata/core';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'pc/hooks';
import SearchIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_search.svg';
import styles from './style.module.less';
import { useUnmount } from 'ahooks';
import { CancelFilled } from '@vikadata/icons';
import { LinkButton, IconButton, useThemeColors } from '@vikadata/components';

interface IFind {
  datasheetId: string;
}

interface ISearch extends IFind {
  onClose(): void;
}

const Search: React.FC<ISearch> = ({
  datasheetId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const [keyword, setKeyword] = useState('');

  const lock = useRef<boolean>(false);

  const [refreshIndex, setRefreshIndex] = useState(0);

  const inputRef = useRef<Input>(null);

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
        size='small'
        autoFocus
        prefix={<SearchIcon width={16} height={16} fill={colors.fc3} />}
        onChange={onChange}
        value={keyword}
        ref={inputRef}
        placeholder={t(Strings.find)}
        suffix={keyword.length !== 0 &&
          <div
            className={styles.clear}
            onClick={() => {
              setKeyword('');
              inputRef.current?.focus();
            }}
          >
            <CancelFilled size={14} />
          </div>
        }
        onCompositionStart={onChange}
        onCompositionEnd={onChange}
      />

      <div className={styles.cancel}>
        <LinkButton
          onClick={onClose}
          style={{
            color: colors.fc2
          }}
          underline={false}
        >
          {t(Strings.cancel)}
        </LinkButton>
      </div>
    </div>
  );
};

export const Find: React.FC<IFind> = ({
  datasheetId,
}) => {
  const [visible, setVisible] = useState(false);
  const colors = useThemeColors();
  const viewId = useSelector(state => state.pageParams.viewId);

  useEffect(() => {
    setVisible(false);
  }, [viewId]);

  return (
    <>
      <IconButton
        onClick={() => setVisible(true)}
        className={styles.find}
        icon={() => <SearchIcon width={16} height={16} fill={colors.fc2} />}
      />
      {visible &&
        <Search
          datasheetId={datasheetId}
          onClose={() => setVisible(false)}
        />
      }
    </>
  );
};
