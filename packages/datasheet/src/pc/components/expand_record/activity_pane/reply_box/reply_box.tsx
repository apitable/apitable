import styles from './style.module.less';
import { get } from 'lodash';
import { ReplyComment } from 'pc/components/expand_record/activity_pane/reply_comment';
import { useContext } from 'react';
import { ActivityContext } from 'pc/components/expand_record/activity_pane/activity_context';
import { useRequest } from 'pc/hooks';
import { DatasheetApi } from '@apitable/core';
import SlateEditor from 'pc/components/draft_editor/slate_editor';

export const ReplyBox = ({ action, handleEmoji, datasheetId, expandRecordId }) => {
  const { emojis, commentReplyMap, updateCommentReplyMap } = useContext(ActivityContext);
  const { run: getCommentsByIds, loading: requestLoading } = useRequest(DatasheetApi.getCommentsByIds, { manual: true });

  const getReplyComment = (action) => {
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
        updateCommentReplyMap(pre => ({ ...pre, ...data }));
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
