import { Loading } from '@vikadata/components';
import { integrateCdnHost } from '@vikadata/core';
import React from 'react';
import dynamic from 'next/dynamic';

const EmojiEmoji = dynamic<any>(() => import('emoji-mart/dist/components/emoji/emoji'), {
  ssr: false,
  loading: () => <Loading />
});
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
    <EmojiEmoji
      backgroundImageFn={() => getEmojiSource(props.set, 64)}
      {...props}
    />
  );
};