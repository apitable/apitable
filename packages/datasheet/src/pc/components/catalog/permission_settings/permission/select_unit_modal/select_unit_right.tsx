import { MemberType, Strings, t, UnitItem, IMember, ISpaceInfo, ISpaceBasicInfo } from '@vikadata/core';
import { generateUserInfo } from 'pc/utils';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { SelectUnitSource } from '.';
import styles from './style.module.less';
import { UnitTag } from './unit_tag';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

interface ISelectUnitRightProps {
  source?: SelectUnitSource;
  checkedList: UnitItem[];
  cancelCheck(unitId: string): void;
  spaceInfo?: ISpaceInfo | ISpaceBasicInfo | null;
}

export const SelectUnitRight: React.FC<ISelectUnitRightProps> = props => {
  const {
    source,
    checkedList,
    cancelCheck,
    spaceInfo: wecomSpaceInfo = null,
  } = props;
  const spaceInfo = useSelector(state => state.space.curSpaceInfo) || wecomSpaceInfo;
  return (
    <div className={styles.right}>
      <div className={styles.title}>{t(Strings.selected)}</div>
      <div className={styles.listWrapper}>
        <div className={styles.list}>
          {
            checkedList.map(item => {
              let userInfo;
              // 兼容传入的已选择的 IMemberValue
              if (source === 'member' && 'type' in item && 'name' in item) {
                const title = getSocialWecomUnitName({
                  name: item['name'],
                  isModified: item['isMemberNameModified'],
                  spaceInfo
                });
                userInfo = {
                  avatar: item['avatar'],
                  name: item['name'],
                  isTeam: item['type'] === MemberType.Team,
                  title,
                };
              } else {
                userInfo = generateUserInfo(item, spaceInfo);
              }

              const isLeave = (!userInfo.isTeam) && (!(item as IMember).isActive || (item as IMember).isDeleted);
              return (
                <UnitTag
                  unitId={item.unitId}
                  key={item.unitId}
                  className={styles.item}
                  avatar={userInfo.avatar}
                  name={userInfo.name}
                  title={userInfo.title}
                  isTeam={userInfo.isTeam}
                  onClose={cancelCheck}
                  isLeave={isLeave}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
};