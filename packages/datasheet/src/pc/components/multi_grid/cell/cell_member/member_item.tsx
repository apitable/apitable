import { IUnitValue, IUserValue, MemberType } from '@vikadata/core';
import classNames from 'classnames';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.less';

interface IMemberItemProps {
  unitInfo: IUnitValue | IUserValue;
  style?: React.CSSProperties;
  selected?: boolean;
}

export function isUnitLeave(unit: IUnitValue | IUserValue) {
  if (!unit) return true;
  if (unit.isDeleted) { return true; }
  return unit.type === MemberType.Member && !unit.isActive;
}

export const MemberItem: React.FC<IMemberItemProps> = props => {
  const { unitInfo, children, style, selected } = props;
  const { unitId, avatar, name, type, userId, isSelf, desc, isMemberNameModified } = unitInfo as any;
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  const title = getSocialWecomUnitName({
    name,
    isModified: isMemberNameModified,
    spaceInfo
  });
  
  return (
    <span
      className={classNames('unitMember', {
        [styles.unitItemWrapper]: true,
        [styles.unitTeam]: unitInfo.type === MemberType.Team,
        [styles.unitMember]: unitInfo.type === MemberType.Member,
        [styles.isLeave]: isUnitLeave(unitInfo),
        [styles.selected]: selected,
      })}
      style={style}
    >
      <Avatar
        id={unitId || userId!}
        title={name}
        size={AvatarSize.Size20}
        src={avatar}
        type={type === MemberType.Team ? AvatarType.Team : AvatarType.Member}
        style={{ minWidth: 20 }}
        isDefaultIcon={isSelf}
      />
      <span className={classNames('unitName', styles.unitName)}>{title}</span>
      {desc && <span className={styles.unitDesc}>{`（${desc}）`}</span>}
      {children}
    </span>
  );
};