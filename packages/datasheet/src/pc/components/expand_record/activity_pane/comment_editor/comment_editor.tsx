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

import { useClickAway, useUpdateEffect } from 'ahooks';
import cls from 'classnames';
import dayjs from 'dayjs';
import { get, pick } from 'lodash';
import * as React from 'react';
import { useCallback, useContext, useRef, useState } from 'react';
import { Descendant } from 'slate';
import { Button, LinkButton } from '@apitable/components';
import { CollaCommandName, ExecuteResult, IApi, Selectors, Strings, t } from '@apitable/core';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { Message } from 'pc/components/common/message';
import SlateEditor from 'pc/components/draft_editor/slate_editor';
import { ITextNode, serialize, transformNodes2Link, walk } from 'pc/components/draft_editor/utils';
import { getRecordName } from 'pc/components/expand_record/utils';
import { verificationPermission } from 'pc/events/notification_verification';
import { usePlatform } from 'pc/hooks/use_platform';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { COMMENT_SUBMIT_BUTTON, EXPAND_RECORD_COMMENT_WRAPPER } from 'pc/utils/test_id_constant';
import { ActivityContext } from '../activity_context';
import { IActivityPaneProps } from '../interface';
import { ReplyComment } from '../reply_comment';
import styles from './style.module.less';

const MAX_COMMENT_LENGTH = 1000;

export const CommentEditor: React.FC<React.PropsWithChildren<IActivityPaneProps>> = (props) => {
  const { datasheetId, expandRecordId, viewId } = props;
  const unitId = useAppSelector((state) => state.user.info?.unitId)!;
  const curViewId = useAppSelector((state) => viewId || state.pageParams.viewId);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const editRef = useRef<any>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const commentEditRef = useRef<HTMLDivElement>(null);
  const mirrorId = useAppSelector((state) => state.pageParams.datasheetId === datasheetId && state.pageParams.mirrorId);

  const { replyText, setReplyText, focus: focusStatus, setFocus, setReplyUnitId } = useContext(ActivityContext);

  const [content, setContent] = useState<Descendant[]>();
  const { mobile } = usePlatform();

  useUpdateEffect(() => {
    setFocus(false);
    setReplyText(undefined);
    setReplyUnitId(undefined);
    editRef.current?.clear();
  }, [expandRecordId]);

  function getFirstColumnValue() {
    const localStore = store.getState();
    const snapshot = Selectors.getSnapshot(localStore, datasheetId)!;
    const firstColumn = snapshot.meta.views[0]!.columns[0];
    const cellValue = Selectors.getCellValue(localStore, snapshot, expandRecordId, firstColumn.fieldId);
    return getRecordName(cellValue, snapshot.meta.fieldMap[firstColumn.fieldId]) || '';
  }

  function notifyEffect(content: ITextNode[]) {
    const unitIds: string[] = walk(content);
    if (!unitIds.length) {
      return;
    }
    const recordTitle = getFirstColumnValue();
    
    verificationPermission({
      isNotify: true,
      nodeId: mirrorId || datasheetId,
      viewId: curViewId,
      linkId: '',
      unitRecs: [
        {
          recordIds: [expandRecordId],
          unitIds: unitIds,
          recordTitle,
        },
      ],
      type: IApi.MindType.Comment,
      extra: {
        recordTitle,
        content: serialize(content, spaceInfo, true).join(''),
        createdAt: dayjs.tz(Date.now()).format('YYYY-MM-DD HH:mm'),
      },
    });
  }

  function checkPlainText(text: string) {
    const len = text.length;
    if (!len) {
      // todo Feels better to add an empty prompt
      return false;
    }
    if (len >= MAX_COMMENT_LENGTH) {
      Message.warning({
        content: t(Strings.comment_too_long, {
          word_count: MAX_COMMENT_LENGTH,
        }),
      });
      return false;
    }
    return true;
  }

  const isCommentEmpty = useCallback(() => {
    const _text = serialize(content as unknown as ITextNode).join('');
    const _content = checkPlainText(_text);
    return !_content;
  }, [content]);

  function slateSubmit() {
    // Not submitted when content is empty
    if (isCommentEmpty()) {
      return;
    }
    const _content = transformNodes2Link(content as ITextNode[]);
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.InsertComment,
      datasheetId: datasheetId,
      recordId: expandRecordId,
      comments: [
        {
          createdAt: Date.now(),
          unitId,
          commentMsg: {
            type: 'dfs',
            reply: pick(replyText, ['commentId']),
            content: _content,
            html: '',
          },
        },
      ],
    });

    if (result.result === ExecuteResult.Success) {
      notifyEffect(content as any);
      setReplyText(undefined);
      setReplyUnitId(undefined);
      editRef.current?.clear();
    } else {
      Message.warning({
        content: t(Strings.operate_fail),
      });
    }
  }

  const onClick = () => {
    !focusStatus && setFocus && setFocus(true);
  };

  useClickAway(
    (event: MouseEvent | TouchEvent) => {
      // Spotlight comments when clicking reply
      const replyClass = get(event, 'target.className');
      if (replyClass && typeof replyClass === 'string' && (replyClass as string).includes('replyIcon')) {
        editRef.current?.focus(true);
        return;
      }
      if (isCommentEmpty()) {
        setFocus(false);
        setReplyText(undefined);
        setReplyUnitId(undefined);
        editRef.current?.clear();
      }
    },
    commentEditRef,
    'click',
  );

  const contentChangeHandler = (content: Descendant[]) => {
    // Storage state
    setContent(content);
  };

  return (
    <div className={styles.commentEditWrapper} id="commentEdit" ref={commentEditRef}>
      {replyText && (
        <ReplyComment
          reply={replyText}
          handleClose={() => {
            setReplyText(undefined);
            setReplyUnitId(undefined);
          }}
        />
      )}
      <div className={styles.commentEdit}>
        <div
          data-test-id={EXPAND_RECORD_COMMENT_WRAPPER}
          className={cls(styles.borderWrapper, { [styles.focus]: focusStatus })}
          tabIndex={1}
          onMouseDown={onClick}
          ref={borderRef}
        >
          <div style={{ padding: '8px' }}>
            <SlateEditor
              className={styles.commentSlateEditor}
              syncContent={contentChangeHandler}
              submit={slateSubmit}
              maxRow={4}
              ref={editRef}
              onBlur={() => {
                if (mobile) {
                  window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight));
                }
              }}
            />
          </div>
          <ComponentDisplay minWidthCompatible={ScreenSize.md}>
            <div className={styles.submitWrapper}>
              <div className={styles.shortKeyTip}>
                {t(Strings.new_a_line)}
                {t(Strings.comma)}
                {t(Strings.send_comment_tip)}
              </div>
              <Button disabled={isCommentEmpty()} data-test-id={COMMENT_SUBMIT_BUTTON} onClick={slateSubmit} color="primary" size={'small'}>
                {t(Strings.send)}
              </Button>
            </div>
          </ComponentDisplay>
        </div>
        <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
          <div className={styles.submitWrapper}>
            <LinkButton onTouchEnd={slateSubmit} underline={false} component={'button'}>
              {t(Strings.send)}
            </LinkButton>
          </div>
        </ComponentDisplay>
      </div>
    </div>
  );
};
