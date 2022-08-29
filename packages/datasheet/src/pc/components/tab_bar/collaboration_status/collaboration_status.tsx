import { ICollaborator, integrateCdnHost, ResourceType, Selectors, Settings } from '@vikadata/core';
import { Popover } from 'antd';
import uniqBy from 'lodash/uniqBy';
import { Avatar, AvatarSize, Tooltip, UserCardTrigger } from 'pc/components/common';
import { backCorrectName, isAlien } from 'pc/components/multi_grid/cell/cell_other';
import { getSocialWecomUnitName } from 'pc/components/home/social_platform';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { find, values } from 'lodash';
import styles from './style.module.less';

const MAX_SHOW_NUMBER = 3;

function sortByCreateTime(c1: ICollaborator, c2: ICollaborator) {
  return c1.createTime! > c2.createTime! ? -1 : 0;
}

export function getCollaboratorAvatar(colla: ICollaborator) {
  return isAlien(colla) ?
    integrateCdnHost(Settings.anonymous_avatar.value) :
    colla.avatar;
}

export const CollaboratorStatus: React.FC<{ resourceType: ResourceType, resourceId: string }> = (props) => {
  const collaborators = useSelector(state => {
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
  }, shallowEqual);
  const unitMap = useSelector(Selectors.getUnitMap);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);

  const showCollaborators = collaborators.slice(0, MAX_SHOW_NUMBER);
  const restCollaborators = collaborators.slice(MAX_SHOW_NUMBER);
  const isOverMax: boolean = collaborators.length > MAX_SHOW_NUMBER;

  return (
    <div className={styles.statusbar}>
      <div className={styles.collaboratorsAvatars}>
        {showCollaborators.reverse().map((collaborator) => {
          const unit = find(values(unitMap), { userId: collaborator.userId });
          const title = unit ? getSocialWecomUnitName({
            name: unit.name,
            isModified: unit.isMemberNameModified,
            spaceInfo
          }) : getSocialWecomUnitName({
            name: backCorrectName(collaborator),
            isModified: false,
            spaceInfo
          });
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
                    title={backCorrectName(collaborator)}
                    style={{
                      marginLeft: -8,
                      cursor: 'pointer',
                    } as React.CSSProperties}
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
              {restCollaborators.map(c => (
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
                      size={AvatarSize.Size24}
                      title={backCorrectName(c)}
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
          <span className={styles.moreMemberCount}>
            +{restCollaborators.length}
          </span>
        </Popover>
      )}
    </div>
  );
};
