import { Box, Typography, useThemeColors } from '@vikadata/components';
import { MemberType, Strings, t } from '@apitable/core';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common';

import classNames from 'classnames';
import styles from './style.module.less';
import { IMemberItem } from '../interface';

export const UnitItem: React.FC<IMemberItem> = (record) => {
  const colors = useThemeColors();

  return (
    <Box display={'flex'} alignItems={'center'}>
      <div className={classNames(styles.unitItem, record.unitType === MemberType.Team && styles.unitItemTeam)}>
        <Avatar
          src={record.avatar}
          id={record.unitId}
          title={record.unitName || t(Strings.unnamed)}
          size={AvatarSize.Size20}
          type={record.unitType === MemberType.Member ? AvatarType.Member : AvatarType.Team}
        />
        <Typography className={styles.unitName} variant="body4" ellipsis>
          {record.unitName}
        </Typography>
      </div>
      {record.isAdmin && (
        <div className={styles.unitTag}>
          <Typography color={colors.borderOnbrandDefault} variant="body4">
            {t(Strings.admin)}
          </Typography>
        </div>
      )}
    </Box>
  );
};
