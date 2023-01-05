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

import { Loading } from '@apitable/components';
import { integrateCdnHost, SystemConfig } from '@apitable/core';
import React from 'react';

const EmojiEmoji = React.lazy(() => import('emoji-mart/dist/components/emoji/emoji'));

const getEmojiSource = (set = 'apple', size = 32) => {
  const emojiPath = SystemConfig.settings[`emoji_${set}_${size}`]?.value;
  return integrateCdnHost(emojiPath);
};

interface IEmoji {
  set?: string;
  size?: number;
  emoji: string;
}

export const Emoji = (props: IEmoji) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <EmojiEmoji
        backgroundImageFn={() => getEmojiSource(props.set, 64)}
        {...props}
      />
    </React.Suspense>
  );
};