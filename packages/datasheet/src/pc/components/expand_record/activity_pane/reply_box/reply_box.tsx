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

import styles from './style.module.less';
import { get } from 'lodash';
import { ReplyComment } from 'pc/components/expand_record/activity_pane/reply_comment';
import { useContext } from 'react';
import { ActivityContext } from 'pc/components/expand_record/activity_pane/activity_context';
import { useRequest } from 'pc/hooks';
import { DatasheetApi, IJOTAction } from '@apitable/core';
import SlateEditor from 'pc/components/draft_editor/slate_editor';

interface IReplyBox {
  action: number | IJOTAction;
  handleEmoji: ( emojiKey: string) => void;
  datasheetId: string;
  expandRecordId: string;
}

export const ReplyBox = ({ action, handleEmoji, datasheetId, expandRecordId }: IReplyBox) => {
  const { emojis, commentReplyMap, updateCommentReplyMap } = useContext(ActivityContext);
  const { run: getCommentsByIds, loading: requestLoading } = useRequest(DatasheetApi.getCommentsByIds, { manual: true });

  const getReplyComment = (action: number | IJOTAction) => {
    const commentId = get(action, 'commentMsg.reply.commentId');
    const isDeleted = get(action, 'commentMsg.reply.isDeleted');

    if (isDeleted) {
      return {
        isDeleted
      };
    }

    if (commentReplyMap[commentId]) {
      return commentReplyMap[commentId];
    }

    if (!commentId || !commentId.length) {
      return;
    }

    if (requestLoading) {
      return { blocks: [{ text: '' }] };
    }

    getCommentsByIds(datasheetId, expandRecordId, commentId).then(res => {
      if (!res || !res.data) {
        return;
      }
      const { success, data } = res.data;
      if (success) {
        updateCommentReplyMap((pre: any) => ({ ...pre, ...data }));
      }
    });
  };

  return <div className={styles.comment}>
    <ReplyComment reply={getReplyComment(action)} isStatic />
    <SlateEditor
      key={get(action, 'createdAt')}
      initialValue={get(action, 'commentMsg.content')}
      emojis={get(emojis, get(action, 'commentId'))}
      handleEmoji={handleEmoji}
      readOnly
    />
  </div>;
};
