import { FC } from 'react';
import styles from './style.module.less';
import { useSelector } from 'react-redux';
import { IReduxState } from '@apitable/core';
import { Avatar, AvatarSize } from 'pc/components/common';
import { useThemeColors } from '@apitable/components';
import { Typography } from '@apitable/components';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';

export const AdminInfo: FC = () => {
  const colors = useThemeColors();
  const mainAdminInfo = useSelector((state: IReduxState) => state.spacePermissionManage.mainAdminInfo);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { name = '-', email = '-', isMemberNameModified } = mainAdminInfo || {};
  const displayName = getSocialWecomUnitName({
    name,
    isModified: isMemberNameModified,
    spaceInfo
  });

  return (
    <div className={styles.adminInfoWrapper}>
      {
        mainAdminInfo &&
        <Avatar
          title={name}
          src={mainAdminInfo.avatar}
          size={AvatarSize.Size40}
          className={styles.portrait}
          id={mainAdminInfo.name}
        />
      }
      <div className={styles.infoRight}>
        <Typography
          variant={'h6'}
          ellipsis={{ rows: 2 }}
          color={name === '-' ? colors.fourthLevelText : colors.firstLevelText}
        >
          {displayName}
        </Typography>
        <Typography
          variant={'body4'}
          color={email === '-' ? colors.fourthLevelText : colors.thirdLevelText}
        >
          {email}
        </Typography>
      </div>
    </div>
  );
};
