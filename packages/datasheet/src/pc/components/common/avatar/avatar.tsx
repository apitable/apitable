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

import * as React from 'react';
import { getThemeColors, getThemeName, lightColors } from '@apitable/components';
import { CutMethod, getImageThumbSrc, integrateCdnHost } from '@apitable/core';
import { UserGroupOutlined, UserRoleOutlined } from '@apitable/icons';
import { useGetSignatureAssertByToken } from '@apitable/widget-sdk';
import { createAvatarRainbowColorsArr } from 'pc/utils/color_utils';

import { AvatarBase, IAvatarBaseProps } from './avatar_base';

export enum AvatarSize {
  Size16 = 16,
  Size20 = 20,
  Size24 = 24,
  Size32 = 32,
  Size40 = 40,
  Size56 = 56,
  Size64 = 64,
  Size80 = 80,
  Size120 = 120,
}

const ColorWheel = Object.keys(lightColors).reduce<string[]>((pre, cur) => {
  if (cur.startsWith('rc')) {
    pre.push(lightColors[cur]);
  }
  return pre;
}, []);

export const getAvatarRandomColor = (str: string) => {
  const index = (str + '').charCodeAt(Math.floor(str.length / 2));
  return ColorWheel[index % ColorWheel.length];
};

export function getFirstWordFromString(str: string) {
  if(!str) return '';
  const word = str.trim();
  if (!word.length) return '';
  const codePoint = word.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint).toUpperCase();
}

export enum AvatarType {
  Member,
  Space,
  Team,
}

export interface IAvatarProps extends Omit<IAvatarBaseProps, 'shape'> {
  id: string;
  title: string;
  isGzip?: boolean;
  children?: JSX.Element;
  type?: AvatarType;
  avatarColor?: number | null;
  style?: React.CSSProperties;
  defaultIcon?: JSX.Element;
  isRole?: boolean;
}

const AvatarHoc = (Component: any) => {
  const ratio = process.env.SSR ? 2 : Math.max(window.devicePixelRatio, 2);
  const colors = getThemeColors();
  const themeName = getThemeName();
  const bgColorList = createAvatarRainbowColorsArr(themeName);

  const FC = (props: IAvatarProps) => {
    const { src, title, isGzip = true, id, size = AvatarSize.Size32, type = AvatarType.Member, style, defaultIcon, avatarColor, isRole } = props;
    const _src = useGetSignatureAssertByToken(src || null) || '';

    if (!title || !id) return null;

    if (type === AvatarType.Team) {
      return (
        <Component
          {...props}
          shape="square"
          src={_src}
          style={{
            backgroundColor: getAvatarRandomColor(id),
            border: !_src && '0px',
            ...style,
          }}
        >
          {isRole ? (
            <UserRoleOutlined size={size * 0.625} color={colors.textStaticPrimary} />
          ) : (
            !_src && <UserGroupOutlined size={size * 0.625} color={colors.textStaticPrimary} />
          )}
        </Component>
      );
    }
    const avatarSrc =
      isGzip && _src
        ? getImageThumbSrc(integrateCdnHost(_src), {
          method: CutMethod.CUT,
          quality: 100,
          size: size * ratio,
        })
        : _src;
    const firstWord = getFirstWordFromString(title);
    const avatarBg = avatarSrc ? colors.defaultBg : avatarColor != null ? bgColorList[avatarColor] : getAvatarRandomColor(id);
    if (type === AvatarType.Space) {
      return (
        <Component
          {...props}
          shape="square"
          src={avatarSrc}
          style={{
            backgroundColor: avatarBg,
            color: colors.defaultBg,
            border: !_src && '0px',
            ...style,
          }}
        >
          {!avatarSrc && firstWord}
        </Component>
      );
    }
    return (
      <Component
        {...props}
        shape="circle"
        src={avatarSrc}
        style={{
          backgroundColor: defaultIcon ? colors.rc01 : avatarBg,
          color: colors.textStaticPrimary,
          border: !_src && '0px',
          ...style,
        }}
      >
        {!avatarSrc && (defaultIcon || firstWord)}
      </Component>
    );
  };

  return FC;
};

export const Avatar = AvatarHoc(AvatarBase);
