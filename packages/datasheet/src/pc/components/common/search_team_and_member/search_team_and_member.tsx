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

import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { FC, useState, useRef, useEffect } from 'react';
import { IReduxState, Api, ITeamsInSearch, IMembersInSearch } from '@apitable/core';
import { useRequest, useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { ScreenSize } from '../component_display';
import { SearchInput, SearchEmpty } from '../index';
import { SearchList, ListType } from './search_list';
import styles from './style.module.less';

interface ISearchTeamAndMemberProps {
  setInSearch: (inSearch: boolean) => void;
  teamClick: (id: string) => void;
  memberClick: (id: string) => void;
  top?: string;
}
export const SearchTeamAndMember: FC<React.PropsWithChildren<ISearchTeamAndMemberProps>> = ({ setInSearch, teamClick, memberClick, top }) => {
  const ref = useRef<HTMLDivElement>(null);
  const spaceId = useAppSelector((state: IReduxState) => state.space.activeId);
  const [keyword, setKeyword] = useState('');
  const [searchTeams, setSearchTeams] = useState<ITeamsInSearch[]>([]);
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
      searchTeamAndMember(keyword).then((res) => {
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
