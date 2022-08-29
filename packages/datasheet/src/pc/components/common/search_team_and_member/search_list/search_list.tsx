import { FC } from 'react';
import { List } from 'antd';
import styles from './style.module.less';
import { ITeamsInSearch, IMembersInSearch, t, Strings } from '@vikadata/core';
import { InfoCard } from 'pc/components/common';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import { AvatarType } from '../../avatar';
import { useSelector } from 'react-redux';

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
export const SearchList: FC<ISearchListProps> = props => {
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  return (
    <div className={styles.searchList}>
      {
        props.type === ListType.MemberList ?
          <>
            <div className={styles.searchTitle}>{t(Strings.member)}</div>
            <List
              itemLayout="horizontal"
              dataSource={props.dataSource}
              renderItem={item => {
                const title = getSocialWecomUnitName({
                  name: item.memberName,
                  isModified: item.isMemberNameModified,
                  spaceInfo
                });
                return (
                  <List.Item onClick={() => props.listClick(item.memberId)}>
                    <InfoCard
                      title={title}
                      originTitle={item.memberName}
                      description={item.team}
                      style={cardStyle}
                      inSearch
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
          </> :
          <>
            <div className={styles.searchTitle}>{t(Strings.team)}</div>
            <List
              itemLayout="horizontal"
              dataSource={props.dataSource}
              renderItem={item => (
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
      }
    </div>

  );
};
