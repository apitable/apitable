import { memo } from 'react';
import * as React from 'react';
import { AvatarBase } from 'pc/components/common/avatar/avatar_base';
import { Avatar, AvatarSize, AvatarType, IAvatarProps, Logo } from 'pc/components/common';
import { NoticeTypesConstant } from '../utils';
import { useThemeColors } from '@vikadata/components';
import OfficialIcon from 'static/icon/workbench/notification/workbench_icon_notification_offcial.svg';
import styles from './style.module.less';
import classNames from 'classnames';

export const OfficialAvatar = (): React.ReactElement => (
  <AvatarBase
    size={AvatarSize.Size20}
    className={classNames(styles.avatar, styles.systemLogo)}
  >
    <Logo size="mini" text={false} />
  </AvatarBase>
);
export const BottomMsgAvatarBase = (props: IAvatarProps & { notifyType: string }) => {
  const colors = useThemeColors();
  const { notifyType, ...rest } = props;
  switch (notifyType) {
    case NoticeTypesConstant.system: {
      return (
        <AvatarBase
          style={{ backgroundColor: colors.primaryColor }}
          className={styles.avatar}
          size={AvatarSize.Size20}
        >
          <OfficialIcon fill={colors.defaultBg} />
        </AvatarBase>
      );
    }
    default: {
      return (
        <Avatar
          size={AvatarSize.Size20}
          className={styles.avatar}
          type={AvatarType.Space}
          {...rest}
        />
      );
    }
  }
};

export const BottomMsgAvatar = memo((props: IAvatarProps & { notifyType: string }) => {
  return <BottomMsgAvatarBase {...props}/>;
});

