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

import { createContext } from 'react';
import { IUnitMap } from '@apitable/core';

interface ICommentEmoji {
  [commentId: string]: {
    [emojiKey: string]: string[];
  };
}

export interface ICommentReplyMap {
  [commentId: string]: any;
}

export interface IActivityContext {
  replyText: any;
  setReplyText(text: any): void;
  emojis: ICommentEmoji;
  setEmojis(emojis: ICommentEmoji): void;
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
