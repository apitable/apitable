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

import { Popover, Tooltip } from 'antd';
import cls from 'classnames';
import dayjs from 'dayjs';
import { find, get, toPairs } from 'lodash';
import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IconButton } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  IDPrefix,
  IFieldPermissionMap,
  IJOTAction,
  IOperation,
  IRemoteChangeset,
  IUnitValue,
  jot,
  Selectors,
  Strings,
  t,
  WithOptional,
} from '@apitable/core';
import { CommentOutlined, DeleteOutlined, EmojiOutlined } from '@apitable/icons';
import { Avatar, AvatarSize, Emoji, Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { ReplyBox } from 'pc/components/expand_record/activity_pane/reply_box/reply_box';
import { useResponsive } from 'pc/hooks';
import { usePlatform } from 'pc/hooks/use_platform';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { commandTran } from 'pc/utils';
import { EXPAND_RECORD_ACTIVITY_ITEM, EXPAND_RECORD_DELETE_COMMENT_MORE } from 'pc/utils/test_id_constant';
import { ActivityContext } from '../activity_context';
import { IActivityPaneProps, IChooseComment } from '../interface';
import { ChangesetItemAction } from './changeset_item_action';
// @ts-ignore
import { getSocialWecomUnitName } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';

type IChangesetItem = IActivityPaneProps & {
  unit: IUnitValue | undefined;
  changeset: WithOptional<IRemoteChangeset, 'messageId' | 'resourceType'>;
  cacheFieldOptions: object;
  datasheetId: string;
  setChooseComment: (item: IChooseComment) => void;
  fieldPermissionMap: IFieldPermissionMap | undefined;
  isMirror: boolean;
};

const ChangesetItemBase: React.FC<React.PropsWithChildren<IChangesetItem>> = (props) => {
  const { expandRecordId, changeset, cacheFieldOptions, datasheetId, setChooseComment, unit, fieldPermissionMap, isMirror } = props;
  const { operations, userId, createdAt, revision } = changeset;

  const { mobile: isMobile } = usePlatform();

  const { setReplyText, emojis, setFocus, setReplyUnitId } = useContext(ActivityContext);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);

  const actions = operations.reduce((actionArr: IJOTAction[], op: IOperation) => {
    let { actions } = op;
    /**
     * Add line containing default value processing
     *
     * [{ n: 'OI', oi: { fieldId1: val1, fieldId2: val2 }, p: ['recordMap', 'recId'] }]
     * =>
     * [
     *  { n: 'OI', oi: val1, p: ['recordMap', 'recId', 'data', fieldId1] },
     *  { n: 'OI', oi: val2, p: ['recordMap', 'recId', 'data', fieldId2] }
     * ]
     */
    const { n, oi, p } = actions[0] as any;
    if (oi && p.length === 2 && p[0] === 'recordMap' && p[1].startsWith(IDPrefix.Record)) {
      actions = toPairs(get(oi, 'data', {})).map(([k, v]) => ({
        n,
        oi: v,
        p: [...p, 'data', k],
      }));
    }

    actionArr = actionArr.concat(actions).filter((item) => {
      if (!isMirror) {
        return true;
      }
      const { p } = item as any;
      if (p.length === 4 && p[0] === 'recordMap' && p[1].startsWith(IDPrefix.Record)) {
        const fieldId = p[3];
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
        const isCryptoField = Boolean(fieldRole && fieldRole === ConfigConstant.Role.None);
        return !isCryptoField;
      }
      return true;
    });
    return actionArr;
  }, []);

  const { cmd } = operations[0];

  const selfUserId = useAppSelector((state) => state.user.info?.userId);
  const isSelf = selfUserId === userId;
  const relativeTime = dayjs.tz(Number(createdAt)).fromNow();

  const allowDeleteComment = useAppSelector((state) => {
    const spacePermissions = state.spacePermissionManage.spaceResource?.permissions;
    const isSpaceAdmin = spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
    return Boolean(isSpaceAdmin || isSelf);
  });

  const { screenIsAtLeast } = useResponsive();

  const [commentOperations, restOperations] = useMemo(() => {
    // Distinguish between comment operations, other operations
    const commentOps: IOperation[] = [];
    const restOps: IOperation[] = [];
    operations.forEach((op) => {
      if ([CollaCommandName.InsertComment, CollaCommandName.SystemCorrectComment].includes(op.cmd as CollaCommandName)) {
        commentOps.push(op);
      } else {
        restOps.push(op);
      }
    });
    return [commentOps, restOps];
  }, [operations]);

  const itemArray = useMemo(() => {
    let itemActions: (IJOTAction | number | undefined)[] = [];
    // When multiple comments are combined and sent together, they need to be displayed in multiple records
    if (commentOperations.length > 0) {
      const systemOp = find(commentOperations, { cmd: CollaCommandName.SystemCorrectComment });
      // SystemCorrectComment Server-side update to fix comment times
      if (systemOp) {
        const serverFixActions = systemOp.actions.map((at, idx) => ({
          ...at,
          p: [idx],
        }));
        // InsertComment Adding comments from the client
        const clientActions = commentOperations
          .filter((op) => !op.cmd.includes('System'))
          .map((op, idx) => ({
            ...op.actions[0],
            p: [idx],
          }));
        itemActions = jot.apply(clientActions, serverFixActions) as unknown as IJOTAction[];
      } else {
        itemActions = commentOperations.map((op) => get(op, 'actions.0.li'));
      }
    }
    if (restOperations.length > 0) {
      // Filter system op, mark non-comment operations with undefined placeholders
      itemActions = itemActions.concat(restOperations.filter((op) => !op.cmd.includes('System')).map(() => undefined));
    }
    return itemActions;
  }, [commentOperations, restOperations]);

  if (!unit || !actions.length) {
    return <></>;
  }

  const handleEmoji = (emojiKey: string) => {
    const comment = get(changeset, 'operations.0.actions.0.li') as any;
    const { commentMsg, commentId } = comment;
    const emojiUsers = get(emojis, `${commentId}.${emojiKey}`, []) as string[];

    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.UpdateComment,
      datasheetId: datasheetId,
      recordId: expandRecordId,
      comments: {
        ...comment,
        commentMsg: {
          ...commentMsg,
          emojis: {
            [emojiKey]: [selfUserId],
          },
        },
      },
      // emojiAction is false to cancel the like
      emojiAction: !emojiUsers.includes(selfUserId!),
    });
  };

  const handleReply = () => {
    setFocus(true);
    const unitId = get(changeset, 'operations.0.actions.0.li.unitId');
    const commentContent = get(changeset, 'operations.0.actions.0.li.commentMsg.content') as any;
    const commentId = get(changeset, 'operations.0.actions.0.li.commentId');
    setReplyUnitId(unitId);
    setReplyText({
      ...commentContent,
      commentId,
    });
  };

  const title =
    getSocialWecomUnitName?.({
      name: unit?.name,
      isModified: unit?.isMemberNameModified,
      spaceInfo,
    }) || unit?.name;

  return (
    <>
      {itemArray.map((action, idx) => (
        <div
          data-test-id={EXPAND_RECORD_ACTIVITY_ITEM}
          key={`${revision}-${idx}`}
          className={cls(styles.activityItem, { [styles.changeset]: !action })}
        >
          <div className={styles.activityHeader}>
            <div className={styles.activityHeaderLeft}>
              {
                <Avatar
                  id={unit.unitId}
                  title={unit.nickName || unit.name}
                  avatarColor={unit.avatarColor}
                  src={unit.avatar}
                  size={screenIsAtLeast(ScreenSize.md) ? AvatarSize.Size32 : AvatarSize.Size40}
                />
              }
            </div>
            <div className={cls('activityHeaderRight', styles.activityHeaderRight)}>
              <div className={styles.title}>
                <div className={styles.activityInfo}>
                  <div className={styles.nickName}>
                    <div className={styles.name}>{isSelf ? t(Strings.you) : title || unit.name}</div>
                    <div className={styles.op}>{commandTran(cmd)}</div>
                  </div>
                  {Boolean(action) && (
                    <div className={styles.activityAction}>
                      <Popover
                        overlayClassName={styles.commentPopover}
                        content={
                          <div className={styles.emojiList}>
                            <span onClick={() => handleEmoji('good')}>
                              <Emoji emoji="+1" size={16} />
                            </span>
                            <span onClick={() => handleEmoji('ok')}>
                              <Emoji emoji="ok_hand" size={16} />
                            </span>
                          </div>
                        }
                      >
                        <IconButton icon={EmojiOutlined} shape="square" className={styles.icon} />
                      </Popover>
                      <IconButton onClick={handleReply} icon={CommentOutlined} shape="square" className={cls('replyIcon', styles.icon)} />
                      {allowDeleteComment && (
                        <IconButton
                          onClick={() => {
                            const commentItem = {
                              comment: get(changeset, 'operations.0.actions.0.li') as any,
                              expandRecordId,
                              datasheetId,
                              setChooseComment,
                            };
                            if (isMobile) {
                              setChooseComment(commentItem);
                            } else {
                              Modal.confirm({
                                title: t(Strings.delete_comment_tip_title),
                                content: t(Strings.delete_comment_tip_content),
                                okText: t(Strings.submit),
                                cancelText: t(Strings.cancel),
                                type: 'danger',
                                onOk: () => {
                                  resourceService.instance!.commandManager.execute({
                                    cmd: CollaCommandName.DeleteComment,
                                    datasheetId: datasheetId,
                                    recordId: expandRecordId,
                                    comment: commentItem.comment,
                                  });
                                },
                              });
                            }
                          }}
                          shape="square"
                          icon={DeleteOutlined}
                          className={styles.icon}
                          data-test-id={EXPAND_RECORD_DELETE_COMMENT_MORE}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.activityInfo}>
                  <Tooltip title={dayjs.tz(Number(createdAt)).format('YYYY-MM-DD HH:mm:ss')}>
                    <span className={styles.relativeTime}>{relativeTime}</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.activityBody}>
            {action ? (
              <ReplyBox action={action} handleEmoji={handleEmoji} datasheetId={datasheetId} expandRecordId={expandRecordId} />
            ) : (
              <ChangesetItemAction revision={revision} actions={actions} datasheetId={datasheetId} cacheFieldOptions={cacheFieldOptions} />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export const ChangesetItem = React.memo(ChangesetItemBase);
