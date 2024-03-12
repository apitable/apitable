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

import cls from 'classnames';
import Image from 'next/image';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { TextInput, ThemeName } from '@apitable/components';
import { ISearchMemberData, Strings, t } from '@apitable/core';
import { SearchOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import NotDataImgDark from 'static/icon/datasheet/empty_state_dark.png';
import NotDataImgLight from 'static/icon/datasheet/empty_state_light.png';
import { InfoCard } from '../index';
// @ts-ignore
import { getSocialWecomUnitName, isSocialWecom } from 'enterprise/home/social_platform/utils';
// @ts-ignore
import { WecomOpenData } from 'enterprise/wecom/wecom_open_data/wecom_open_data';
import styles from './style.module.less';

interface ISearchMemberListProps {
  onChange: (value: string) => void;
  searchResult: ISearchMemberData[];
  onClick: (info: ISearchMemberData) => void;
  initInputText?: string;
  placehodler?: string;
}

export const SearchMemberList: FC<React.PropsWithChildren<ISearchMemberListProps>> = (props) => {
  const { searchResult, initInputText } = props;
  const [keyword, setKeyword] = useState('');
  const [listVisible, setListVisible] = useState(false);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const [isMemberInputFocus, setMemberInputFocus] = useState(false);
  const _isSocialWecom = isSocialWecom?.(spaceInfo);
  const wecomMemberNameVisible = _isSocialWecom && !isMemberInputFocus && keyword !== '' && !listVisible;
  const themeName = useAppSelector((state) => state.theme);
  const SearchImage = themeName === ThemeName.Light ? NotDataImgLight : NotDataImgDark;
  useEffect(() => {
    initInputText && setKeyword(initInputText);
  }, [initInputText]);
  const renderSearchMemberList = () => {
    if (!searchResult.length) {
      return (
        <div className={styles.searchEmpty}>
          <Image src={SearchImage} alt={t(Strings.no_search_result)} width={160} height={120} />
          <span>{t(Strings.no_search_result)}</span>
        </div>
      );
    }
    return searchResult.map((item: ISearchMemberData) => {
      const title =
        getSocialWecomUnitName?.({
          name: item.memberName,
          isModified: item.isMemberNameModified,
          spaceInfo,
        }) || item.memberName;
      return (
        <InfoCard
          title={title}
          originTitle={item.memberName}
          description={item.team}
          onClick={() => cardClick(item)}
          key={item.memberId}
          inSearch
          avatarProps={{
            id: item.memberId,
            title: item.originName,
            src: item.avatar,
          }}
          className={styles.infoCardWrap}
        />
      );
    });
  };
  const onKeywordChange = (value: string) => {
    const visible = value ? true : false;
    setListVisible(visible);
    setKeyword(value);
    props.onChange(value);
  };
  const cardClick = (info: ISearchMemberData) => {
    props.onClick(info);
    setKeyword(info.originName);
    setListVisible(false);
  };
  const myStopPropagation = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  return (
    <div
      className={cls(styles.searchMemberList, {
        [styles.wecomContainer]: wecomMemberNameVisible,
      })}
    >
      <TextInput
        placeholder={props.placehodler || t(Strings.placeholder_input_member_name)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onKeywordChange(e.target.value)}
        value={keyword}
        prefix={
          <span onClick={myStopPropagation}>
            <SearchOutlined />
          </span>
        }
        onClick={() => setMemberInputFocus(true)}
        onBlur={() => setMemberInputFocus(false)}
        block
      />
      {wecomMemberNameVisible && (
        <div className={styles.wecomLayer}>
          <WecomOpenData openId={keyword} />
        </div>
      )}
      {listVisible && <div className={styles.searchRes}>{renderSearchMemberList()}</div>}
    </div>
  );
};
