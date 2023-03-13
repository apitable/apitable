import { Loading } from '@apitable/components';
import { integrateCdnHost } from '@apitable/core';
import React from 'react';

const EmojiEmoji = React.lazy(() => import('emoji-mart/dist/components/emoji/emoji'));
const getEmojiSource = (set = 'apple', size = 32) => {
  return integrateCdnHost(`emoji-${set}-${size}.png`);
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