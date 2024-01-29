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

import { List } from 'antd';
import { FC } from 'react';
import { ITeamsInSearch, IMembersInSearch, t, Strings } from '@apitable/core';
import { InfoCard } from 'pc/components/common';
import { useAppSelector } from 'pc/store/react-redux';
import { AvatarType } from '../../avatar';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

export enum ListType {
  MemberList = 'MEMBER_LIST',
  DepartmentsList = 'DEPTS_LIST',
}
interface ISearchListBase {
  listClick: (id: string) => void;
}
interface IListMermber extends ISearchListBase {
  type: ListType.MemberList;
  dataSource: IMembersInSearch[];
}
interface IListDepts extends ISearchListBase {
  type: ListType.DepartmentsList;
  dataSource: ITeamsInSearch[];
}

type ISearchListProps = IListMermber | IListDepts;
const cardStyle = { padding: '0 13px 0 20px' };

const triggerBase = {
  action: ['hover'],
  popupAlign: {
    points: ['tl', 'bl'],
    offset: [0, 18],
    overflow: { adjustX: true, adjustY: true },
  },
};

export const SearchList: FC<React.PropsWithChildren<ISearchListProps>> = (props) => {
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  return (
    <div className={styles.searchList}>
      {props.type === ListType.MemberList ? (
        <>
          <div className={styles.searchTitle}>{t(Strings.member)}</div>
          <List
            itemLayout="horizontal"
            dataSource={props.dataSource}
            renderItem={(item) => {
              const title =
                getSocialWecomUnitName?.({
                  name: item.memberName,
                  isModified: item.isMemberNameModified,
                  spaceInfo,
                }) || item.memberName;
              return (
                <List.Item onClick={() => props.listClick(item.memberId)}>
                  <InfoCard
                    title={title}
                    originTitle={item.memberName}
                    description={item.teamData[0]?.fullHierarchyTeamName || ''}
                    style={cardStyle}
                    inSearch
                    triggerBase={triggerBase}
                    memberId={item.memberId}
                    avatarProps={{
                      id: item.memberId,
                      title: item.originName,
                      src: item.avatar,
                    }}
                  />
                </List.Item>
              );
            }}
          />
        </>
      ) : (
        <>
          <div className={styles.searchTitle}>{t(Strings.team)}</div>
          <List
            itemLayout="horizontal"
            dataSource={props.dataSource}
            renderItem={(item) => (
              <List.Item onClick={() => props.listClick(item.teamId)}>
                <InfoCard
                  title={item.teamName}
                  originTitle={item.teamName}
                  description={item.parentName}
                  style={cardStyle}
                  inSearch
                  avatarProps={{
                    id: item.teamId,
                    title: item.originName,
                    type: AvatarType.Team,
                  }}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
};
