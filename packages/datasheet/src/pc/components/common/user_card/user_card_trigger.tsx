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

import Trigger, { TriggerProps } from 'rc-trigger';
import { FC, isValidElement, useRef, useEffect, useState } from 'react';
import { IReduxState } from '@apitable/core';
import { IAvatarProps } from 'pc/components/common/avatar/avatar';
import { useAppSelector } from 'pc/store/react-redux';
import { UserCard, IUserCard } from './user_card';
import styles from './style.module.less';

interface IUserCardTrigger extends IUserCard, Partial<TriggerProps> {
  scrollTarget?: string;
  isDeleted?: boolean;
  isActive?: boolean;
  avatarProps?: IAvatarProps;
}

export const UserCardTrigger: FC<React.PropsWithChildren<IUserCardTrigger>> = (props) => {
  const {
    userId,
    memberId,
    spareName,
    spareSrc,
    spaceName,
    children,
    action = ['click'],
    isAlien,
    destroyPopupOnHide = true,
    scrollTarget,
    permissionVisible,
    isDeleted,
    isActive,
    avatarProps,
    ...rest
  } = props;
  const shareId = useAppSelector((state: IReduxState) => state.pageParams.shareId);
  const embedId = useAppSelector((state: IReduxState) => state.pageParams.embedId);
  const [cardVisible, setCardVisible] = useState(false);
  const ref = useRef<any>();

  useEffect(() => {
    if (!scrollTarget) {
      return;
    }
    const close = () => {
      ref.current && ref.current.close();
    };
    const targetDom = document.querySelector(scrollTarget);
    targetDom && targetDom.addEventListener('scroll', close);
    return () => {
      targetDom && targetDom.removeEventListener('scroll', close);
    };
  }, [scrollTarget]);

  if (!isValidElement(children)) {
    return null;
  }

  if (shareId || embedId) {
    return children;
  }
  return (
    <>
      {children && (
        <Trigger
          ref={ref}
          action={action}
          destroyPopupOnHide={destroyPopupOnHide}
          popupVisible={cardVisible}
          onPopupVisibleChange={(visible) => setCardVisible(visible)}
          popup={
            props.popup || (
              <UserCard
                userId={userId}
                memberId={memberId}
                spareName={spareName}
                spareSrc={spareSrc}
                spaceName={spaceName}
                isAlien={isAlien}
                permissionVisible={permissionVisible}
                isDeleted={isDeleted}
                isActive={isActive}
                onClose={() => setCardVisible(false)}
                avatarProps={avatarProps}
              />
            )
          }
          popupStyle={{ ...props.popupStyle, width: '240px' }}
          popupClassName={styles.userCardTrigger}
          {...rest}
        >
          {children}
        </Trigger>
      )}
    </>
  );
};
