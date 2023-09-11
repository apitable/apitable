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
import { TriggerProps } from 'rc-trigger';
import * as React from 'react';
import { FC } from 'react';
import { getThemeColors } from '@apitable/components';
import { MemberType } from '@apitable/core';
import { UserOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip, Avatar, IAvatarProps } from 'pc/components/common';
import { UserCardTrigger } from 'pc/components/common/user_card/user_card_trigger';
import { getEnvVariables } from 'pc/utils/env';
import { OmittedMiddleText } from './omitted_middle_text';
import styles from './style.module.less';

interface ITriggerBase {
  action: TriggerProps['action'];
  popupAlign: TriggerProps['popupAlign'];
}

interface IInfoCardProps {
  title: string | JSX.Element;
  token?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  originTitle?: string;
  inSearch?: boolean;
  className?: string;
  style?: React.CSSProperties;
  avatarProps: IAvatarProps;
  extra?: string;
  triggerBase?: ITriggerBase;
  userId?: string;
  memberId?: string;
  isDeleted?: boolean;
  memberType?: number;
  isActive?: boolean;
  desc?: string;
  isMemberOptionList?: boolean;
  email?: string;
}

// const searchTag = '<span class="highLight">';

export const InfoCard: FC<React.PropsWithChildren<IInfoCardProps>> = (props) => {
  const {
    title,
    originTitle = '',
    description,
    onClick,
    extra,
    triggerBase,
    inSearch = false,
    className,
    avatarProps,
    token,
    userId,
    memberId,
    email,
    isDeleted = false,
    memberType = 3,
    isActive = true,
    desc,
    isMemberOptionList = false,
    ...rest
  } = props;
  const isMember = memberType === MemberType.Member;
  const isSelf = userId === 'Self';
  const colors = getThemeColors();
  return (
    <div
      className={classNames(styles.infoCard, className)}
      onClick={onClick}
      style={{ cursor: onClick || isMemberOptionList ? 'pointer' : 'default' }}
      {...rest}
    >
      <div className={classNames(styles.defaultContent, { [styles.isLeave]: (isDeleted || !isActive) && isMember })}>
        {triggerBase && !isSelf && isMember ? (
          <UserCardTrigger
            {...triggerBase}
            userId={userId}
            memberId={memberId}
            permissionVisible={false}
            isDeleted={isDeleted}
            isActive={isActive}
            avatarProps={avatarProps}
            spareName={avatarProps.title}
          >
            <div style={{ cursor: 'pointer' }}>
              <Avatar {...avatarProps} />
            </div>
          </UserCardTrigger>
        ) : (
          <Avatar defaultIcon={isSelf ? <UserOutlined size={16} color={colors.defaultBg} /> : undefined} {...avatarProps} />
        )}
        <div className={styles.text}>
          {inSearch && typeof title === 'string' ? (
            <div className={styles.title} dangerouslySetInnerHTML={{ __html: originTitle }} />
          ) : (
            <div className={styles.name}>
              <Tooltip title={title} textEllipsis>
                <div className={classNames(styles.title, 'title')}>
                  {title}
                  {desc && <span className={styles.unitDesc}>{`（${desc}）`}</span>}
                  {getEnvVariables().CUSTOM_SYNC_CONTACTS_LINKID && email && <span className={styles.unitDesc}>{`（${email}）`}</span>}
                </div>
              </Tooltip>
              <div className={styles.token}>{token}</div>
            </div>
          )}
          {description && <OmittedMiddleText suffixCount={5}>{description}</OmittedMiddleText>}
          {extra && <div className={styles.description}>{extra || ''}</div>}
        </div>
      </div>
      {props.children}
    </div>
  );
};
