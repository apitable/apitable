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
import { FC } from 'react';
import { CloseOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, AvatarType } from 'pc/components/common/avatar/avatar';
import styles from './style.module.less';

export interface IUnitTagProps {
  unitId: string;
  avatar: string;
  name: string;
  nickName?: string;
  avatarColor?: number | null;
  title?: string | JSX.Element;
  isTeam?: boolean;
  className?: string;
  deletable?: boolean;
  onClose?: (id: string) => void;
  isLeave?: boolean;
  maxWidth?: number;
}

export const UnitTag: FC<React.PropsWithChildren<IUnitTagProps>> = (props) => {
  const { deletable = true, avatar, avatarColor, nickName, name, isTeam = false, onClose, unitId, isLeave, title, maxWidth } = props;
  return (
    <div className={classNames(styles.unitTag, props.className, { [styles.isLeave]: isLeave })}>
      <div className={classNames([styles.wrapper, isTeam ? styles.rect : styles.circle])}>
        <Avatar
          id={unitId}
          src={avatar}
          avatarColor={avatarColor}
          title={nickName || name}
          size={AvatarSize.Size20}
          type={isTeam ? AvatarType.Team : AvatarType.Member}
        />
        <div className={styles.name} style={{ maxWidth }}>
          {title || name}
        </div>
        {deletable && <CloseOutlined className={styles.closeBtn} size={8} onClick={() => onClose && onClose(unitId)} />}
      </div>
    </div>
  );
};
