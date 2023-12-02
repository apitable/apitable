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

import classNames from 'classnames';
import { memo } from 'react';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { HornOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, AvatarType, IAvatarProps, Logo } from 'pc/components/common';
import { AvatarBase } from 'pc/components/common/avatar/avatar_base';
import { NoticeTypesConstant } from '../utils';
import styles from './style.module.less';

export const OfficialAvatar = (): React.ReactElement => (
  <AvatarBase size={AvatarSize.Size20} className={classNames(styles.avatar, styles.systemLogo)}>
    <Logo size="mini" text={false} />
  </AvatarBase>
);
export const BottomMsgAvatarBase = (props: IAvatarProps & { notifyType: string }) => {
  const colors = useThemeColors();
  const { notifyType, ...rest } = props;
  switch (notifyType) {
    case NoticeTypesConstant.system: {
      return (
        <AvatarBase style={{ backgroundColor: colors.primaryColor }} className={styles.avatar} size={AvatarSize.Size20}>
          <HornOutlined color={colors.defaultBg} />
        </AvatarBase>
      );
    }
    default: {
      return (
        <Avatar
          size={AvatarSize.Size20}
          className={styles.avatar}
          type={AvatarType.Space}
          style={{
            backgroundColor: 'transparent',
          }}
          {...rest}
        />
      );
    }
  }
};

export const BottomMsgAvatar = memo((props: IAvatarProps & { notifyType: string }) => {
  return <BottomMsgAvatarBase {...props} />;
});
