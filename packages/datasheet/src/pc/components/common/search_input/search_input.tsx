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

import { TextInput } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { InputProps } from 'antd/lib/input';
import classnames from 'classnames';
import { KeyCode } from 'pc/utils';
import * as React from 'react';
import { FC, useRef } from 'react';

import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import CloseIcon from 'static/icon/datasheet/datasheet_icon_attachment_cancel.svg';
import styles from './style.module.less';

interface ISearchInput extends InputProps {
  keyword: string;
  change: React.Dispatch<React.SetStateAction<string>>;
  onClose?: () => void;
}

export const SearchInput: FC<React.PropsWithChildren<ISearchInput>> = props => {
  const inputRef = useRef<any>(null);
  const { change, onClose, className, keyword, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    change(val);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      onClose && onClose();
    }
  };

  const clearKeyword = (e: React.MouseEvent<SVGSVGElement>) => {
    myStopPropagation(e);
    if (props.keyword === '') {
      onClose && onClose();
    } else {
      change('');
      inputRef.current && inputRef.current.focus();
    }
  };

  const myStopPropagation = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <TextInput
      block
      prefix={<SearchIcon onClick={myStopPropagation} />}
      ref={inputRef}
      className={classnames(className, styles.searchInput)}
      value={props.keyword}
      placeholder={t(Strings.search_field)}
      onClick={myStopPropagation}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      suffix={props.keyword && <CloseIcon className={styles.closeBtn} onClick={clearKeyword} />}
      {...rest as any}
    />
  );
};
