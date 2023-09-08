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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { colorVars, Loading, Skeleton, TextButton } from '@apitable/components';
import { integrateCdnHost, Strings, t, SystemConfig } from '@apitable/core';

// @ts-ignore
const EmojiEmoji = dynamic(() => import('emoji-mart/dist/components/emoji/emoji'), {
  ssr: false,
  loading: () => <Loading />,
});
// @ts-ignore
const EmojiPicker = dynamic(() => import('emoji-mart/dist/components/picker/picker'), {
  ssr: false,
  loading: () => (
    <div style={{ margin: 16 }}>
      <Skeleton width="38%" />
      <Skeleton count={2} />
      <Skeleton width="61%" />
    </div>
  ),
});

const getEmojiSource = (set = 'apple', size = 32) => {
  const emojiPath = SystemConfig.settings[`emoji_${set}_${size}`]?.value;
  return integrateCdnHost(emojiPath);
};

const i18n = {
  search: t(Strings.search),
  clear: t(Strings.clear), // Accessible label on "clear" button
  notfound: t(Strings.emoji_not_found),
  skintext: 'Choose your default skin tone',
  categories: {
    search: t(Strings.emoji_search_result),
    recent: t(Strings.emoji_recent),
    smileys: t(Strings.emoji_smileys),
    people: t(Strings.emoji_people),
    nature: t(Strings.emoji_nature),
    foods: t(Strings.emoji_foods),
    activity: t(Strings.emoji_activity),
    places: t(Strings.emoji_places),
    objects: t(Strings.emoji_objects),
    symbols: t(Strings.emoji_symbols),
    flags: t(Strings.emoji_flags),
    custom: t(Strings.emoji_custom),
  },
  categorieslabel: 'Emoji categories', // Accessible title for the list of categories
  skintones: {
    1: 'Default Skin Tone',
    2: 'Light Skin Tone',
    3: 'Medium-Light Skin Tone',
    4: 'Medium Skin Tone',
    5: 'Medium-Dark Skin Tone',
    6: 'Dark Skin Tone',
  },
};

export function Emoji(props: any) {
  return <EmojiEmoji backgroundImageFn={() => getEmojiSource(props.set, 64)} {...props} />;
}

export const Picker: React.FC<React.PropsWithChildren<Record<any, any>>> = (props: any) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const searchWrapper = document.querySelector('.emoji-mart-search');
      if (searchWrapper && props.onReset) {
        const buttonWrapper = document.createElement('div');
        searchWrapper.className = searchWrapper.classList + ' searchWithReset';
        buttonWrapper.setAttribute('class', 'resetBtn');
        const _buttonWrapper = searchWrapper.appendChild(buttonWrapper);
        const root = createRoot(_buttonWrapper);
        root.render(
          <TextButton style={{ color: colorVars.fc1 }} onClick={props.onReset}>
            {t(Strings.reset)}
          </TextButton>,
        );
        clearInterval(interval);
      }
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [props.onReset]);

  return (
    <div className="emoji-wrapper">
      {visible ? (
        <EmojiPicker
          perLine={10}
          sheetSize={props.size || 32}
          showPreview={false}
          showSkinTones={false}
          backgroundImageFn={() => getEmojiSource(props.set, props.sheetSize)}
          i18n={i18n}
          {...props}
        />
      ) : (
        <div style={{ margin: 16 }}>
          <Skeleton width="38%" />
          <Skeleton count={2} />
          <Skeleton width="61%" />
        </div>
      )}
    </div>
  );
};
