import * as React from 'react';
import { IMembersInSearch, ITeamsInSearch } from '@vikadata/core';
import styles from './style.module.less';
import { SearchEmpty } from '..';
import { SearchList, ListType } from './search_list';

interface ISearchResultProps {
  teamsData: ITeamsInSearch[];
  membersData: IMembersInSearch[];
  teamClick: (id: string) => void;
  memberClick: (id: string) => void;
  setInSearch: (inSearch: boolean) => void;
}

export const SearchResult: React.FC<ISearchResultProps> = props => {
  const {
    teamsData,
    membersData,
    teamClick,
    memberClick,
    setInSearch,
  } = props;

  const hasData = Boolean(teamsData.length || membersData.length);

  return (
    <div
      className={styles.searchResultWrapper}
      style={{ opacity: hasData ? 1 : 0.5 }}
      onClick={() => setInSearch(false)}
    >
      {!hasData && <SearchEmpty />}

      {Boolean(teamsData.length) &&
        <SearchList
          type={ListType.DepartmentsList}
          dataSource={teamsData}
          listClick={teamClick}
        />}

      {Boolean(membersData.length) &&
        <SearchList
          type={ListType.MemberList}
          dataSource={membersData}
          listClick={memberClick}
        />}

    </div>
  );
};