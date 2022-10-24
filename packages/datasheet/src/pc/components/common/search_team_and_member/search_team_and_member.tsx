import { FC, useState, useRef, useEffect } from 'react';
import { SearchInput, SearchEmpty } from '../index';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { IReduxState, Api, ITeamsInSearch, IMembersInSearch } from '@apitable/core';
import { SearchList, ListType } from './search_list';
import { useClickAway } from 'ahooks';
import { ScreenSize } from '../component_display';
import { useRequest, useResponsive } from 'pc/hooks';
import classNames from 'classnames';

interface ISearchTeamAndMemberProps {
  setInSearch: (inSearch: boolean) => void;
  teamClick: (id: string) => void;
  memberClick: (id: string) => void;
  top?: string;
}
export const SearchTeamAndMember: FC<ISearchTeamAndMemberProps> = ({ setInSearch, teamClick, memberClick, top }) => {
  const ref = useRef<HTMLDivElement>(null);
  const spaceId = useSelector((state: IReduxState) => state.space.activeId);
  const [keyword, setKeyword] = useState('');
  // 搜索结果数据-小组
  const [searchTeams, setSearchTeams] = useState<ITeamsInSearch[]>([]);
  // 搜索结果数据-成员
  const [searchMembers, setSearchMembers] = useState<IMembersInSearch[]>([]);

  const { run: searchTeamAndMember } = useRequest(Api.searchTeamAndMember, {
    manual: true,
    debounceWait: 200,
  });

  useClickAway(
    () => {
      setInSearch(false);
    },
    ref,
    'mousedown',
  );

  useEffect(() => {
    if (keyword && spaceId) {
      searchTeamAndMember(keyword).then(res => {
        const { success, data } = res.data;
        if (success) {
          setSearchTeams(data.teams);
          setSearchMembers(data.members);
        }
      });
    }
  }, [keyword, searchTeamAndMember, spaceId]);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  return (
    <div className={styles.searchTeamAndMember} style={{ top }} ref={ref}>
      <div
        className={classNames(styles.searchInputWrapper, {
          [styles.inputWrapperMobile]: isMobile,
        })}
      >
        <SearchInput keyword={keyword} change={setKeyword} autoFocus size="small" className={styles.searchInput} />
      </div>
      <div className={styles.searchResultWrapper} style={{ opacity: keyword ? 1 : 0.5 }} onClick={() => setInSearch(false)}>
        {keyword !== '' && searchTeams.length === 0 && searchMembers.length === 0 && <SearchEmpty />}
        {keyword !== '' && searchTeams.length ? <SearchList type={ListType.DepartmentsList} dataSource={searchTeams} listClick={teamClick} /> : null}
        {keyword !== '' && searchMembers.length ? <SearchList type={ListType.MemberList} dataSource={searchMembers} listClick={memberClick} /> : null}
      </div>
    </div>
  );
};
