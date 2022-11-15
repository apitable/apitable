import { TextInput } from '@apitable/components';
import { ISearchMemberData, Strings, t } from '@apitable/core';
import cls from 'classnames';
import Image from 'next/image';
import { WecomOpenData } from 'pc/components/address_list';
import { getSocialWecomUnitName, isSocialWecom } from 'pc/components/home/social_platform';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchIcon from 'static/icon/common/common_icon_search_normal.svg';
import SearchImage from 'static/icon/common/common_img_search_default.png';
import { InfoCard } from '../index';
import styles from './style.module.less';

interface ISearchMemberListProps {
  onChange: (value: string) => void;
  searchResult: ISearchMemberData[];
  onClick: (info: ISearchMemberData) => void;
  initInputText?: string;
  placehodler?: string;
}

export const SearchMemberList: FC<ISearchMemberListProps> = props => {
  const { searchResult, initInputText } = props;
  const [keyword, setKeyword] = useState('');
  const [listVisible, setListVisible] = useState(false);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const [isMemberInputFocus, setMemberInputFocus] = useState(false);
  const _isSocialWecom = isSocialWecom(spaceInfo);
  const wecomMemberNameVisible = _isSocialWecom && !isMemberInputFocus && keyword !== '' && !listVisible;
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
      const title = getSocialWecomUnitName({
        name: item.memberName,
        isModified: item.isMemberNameModified,
        spaceInfo
      });
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
    <div className={cls(styles.searchMemberList, {
      [styles.wecomContainer]: wecomMemberNameVisible
    })}>
      <TextInput
        placeholder={props.placehodler || t(Strings.placeholder_input_member_name)}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => onKeywordChange(e.target.value)}
        value={keyword}
        prefix={<SearchIcon onClick={myStopPropagation} />}
        onClick={() => setMemberInputFocus(true)}
        onBlur={() => setMemberInputFocus(false)}
        block
      />
      {wecomMemberNameVisible &&
        <div className={styles.wecomLayer}>
          <WecomOpenData openId={keyword} />
        </div>
      }
      {
        listVisible &&
        <div className={styles.searchRes}>
          {renderSearchMemberList()}
        </div>
      }
    </div>
  );
};

