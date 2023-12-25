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

import { Popover } from 'antd';
import classNames from 'classnames';
import { find, isEqual, values } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import * as React from 'react';
import { useEffect } from 'react';
import { ICollaborator, integrateCdnHost, ResourceType, Selectors, Settings } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Avatar, AvatarSize, Tooltip, UserCardTrigger } from 'pc/components/common';
import { backCorrectAvatarName, backCorrectName, isAlien } from 'pc/components/multi_grid/cell/cell_other';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

const MAX_SHOW_NUMBER = 3;

function sortByCreateTime(c1: ICollaborator, c2: ICollaborator) {
  return c1.createTime! > c2.createTime! ? -1 : 0;
}

export function getCollaboratorAvatar(colla: ICollaborator) {
  return isAlien(colla) ? integrateCdnHost(Settings.datasheet_unlogin_user_avatar.value) : colla.avatar;
}

export const CollaboratorStatus: React.FC<
  React.PropsWithChildren<{
    resourceType: ResourceType;
    resourceId: string;
    style?: React.CSSProperties;
  }>
> = (props) => {
  const collaborators = useAppSelector((state) => {
    let collaborators = Selectors.getResourceCollaborator(state, props.resourceId, props.resourceType);

    if (!collaborators) {
      collaborators = [];
    }

    const anonymous: ICollaborator[] = [];
    collaborators = collaborators.reduce<ICollaborator[]>((collaborators, collaborator) => {
      if (!collaborator.userId) {
        anonymous.push(collaborator);
        return collaborators;
      }

      collaborators.push(collaborator);
      return collaborators;
    }, []);

    collaborators = uniqBy(collaborators.sort(sortByCreateTime), 'userId');

    return [...collaborators, ...anonymous.sort(sortByCreateTime)];
  }, isEqual);

  const unitMap = useAppSelector(Selectors.getUnitMap);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const { embedId } = useAppSelector((state) => state.pageParams);
  const embedInfo = useAppSelector((state) => state.embedInfo);

  const showSetting = embedId ? embedInfo.viewControl?.toolBar?.formSettingBtn : true;

  const showShareBtn = embedId ? embedInfo.viewControl?.toolBar?.shareBtn : true;

  const showStatusBarLine = !!(showShareBtn || showSetting);

  useEffect(() => {
    window.parent.postMessage(
      {
        message: 'collaborators',
        data: {
          roomId: props.resourceId,
          collaborators: collaborators.map((item) => {
            return {
              name: item.userName,
              avatar: item.avatar,
              userId: item.userId,
            };
          }),
        },
      },
      '*',
    );
  }, [collaborators, props.resourceId]);

  const showCollaborators = collaborators.slice(0, MAX_SHOW_NUMBER);
  const restCollaborators = collaborators.slice(MAX_SHOW_NUMBER);
  const isOverMax: boolean = collaborators.length > MAX_SHOW_NUMBER;

  return (
    <div className={classNames(styles.statusbar, showStatusBarLine ? styles.statusbarLine : styles.statusbarMargin)} style={props.style}>
      <div className={styles.collaboratorsAvatars}>
        {showCollaborators.reverse().map((collaborator) => {
          const unit = find(values(unitMap), { userId: collaborator.userId });
          const title = unit
            ? getSocialWecomUnitName?.({
              name: unit.name,
              isModified: unit.isMemberNameModified,
              spaceInfo,
            }) || unit.name
            : getSocialWecomUnitName?.({
              name: backCorrectName(collaborator),
              isModified: false,
              spaceInfo,
            }) || backCorrectName(collaborator);
          return (
            <UserCardTrigger
              userId={collaborator.userId}
              popupAlign={{
                points: ['tr', 'br'],
                offset: [0, 8],
              }}
              key={collaborator.socketId}
              spareName={backCorrectName(collaborator)}
              spareSrc={getCollaboratorAvatar(collaborator)}
              isAlien={isAlien(collaborator)}
            >
              <Tooltip
                title={title}
                placement="bottom"
                align={{
                  offset: [-3, 0],
                }}
                showTipAnyway
              >
                <span>
                  <Avatar
                    src={getCollaboratorAvatar(collaborator)}
                    size={AvatarSize.Size24}
                    title={backCorrectAvatarName(collaborator)}
                    avatarColor={collaborator.avatarColor}
                    style={
                      {
                        marginLeft: -8,
                        cursor: 'pointer',
                      } as React.CSSProperties
                    }
                    id={collaborator.userId || collaborator.socketId}
                  />
                </span>
              </Tooltip>
            </UserCardTrigger>
          );
        })}
      </div>
      {isOverMax && (
        <Popover
          trigger="click"
          content={
            <div className={styles.memberListCard}>
              {restCollaborators.map((c) => (
                <UserCardTrigger
                  key={c.socketId}
                  userId={c.userId}
                  popupAlign={{
                    points: ['tr', 'tl'],
                    offset: [0, 32],
                  }}
                  spareName={backCorrectName(c)}
                  spareSrc={getCollaboratorAvatar(c)}
                  isAlien={isAlien(c)}
                >
                  <div className={styles.avatarListItem}>
                    <Avatar
                      src={getCollaboratorAvatar(c)}
                      avatarColor={c.avatarColor}
                      size={AvatarSize.Size24}
                      title={backCorrectAvatarName(c)}
                      id={c.userId || c.socketId}
                    />
                    <div className={styles.userName}>{backCorrectName(c)}</div>
                  </div>
                </UserCardTrigger>
              ))}
            </div>
          }
          overlayClassName={styles.memberListPopover}
          destroyTooltipOnHide
          align={{
            points: ['tl', 'bl'],
          }}
        >
          <span className={styles.moreMemberCount}>+{restCollaborators.length}</span>
        </Popover>
      )}
    </div>
  );
};
