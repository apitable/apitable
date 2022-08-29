import { IUnitMap } from '@vikadata/core';
import { createContext } from 'react';

interface ICommentEmoji {
  [commentId: string]: {
    [emojiKey: string]: string[]
  }
}

interface ICommentReplyMap {
  [commentId: string]: any
}

export interface IActivityContext {
  replyText: any,
  setReplyText(text: any):void;
  emojis: ICommentEmoji,
  setEmojis(emojis: ICommentEmoji):void;
  commentReplyMap: ICommentReplyMap;
  updateCommentReplyMap(commentReply: ICommentReplyMap): void;
  focus: boolean;
  setFocus: (focus: boolean) => void;
  unitMap: IUnitMap | null;
  datasheetId: string;
  replyUnitId?: string;
  setReplyUnitId(replyUnitId?: string): void;
}

export const ActivityContext = createContext({} as IActivityContext);
