import { getThemeColors, lightColors } from '@vikadata/components';
import { CutMethod, getImageThumbSrc } from '@vikadata/core';
import * as React from 'react';

import TeamIcon from 'static/icon/space/space_icon_department.svg';
import { AvatarBase, IAvatarBaseProps } from './avatar_base';
import styles from './style.module.less';

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

// 生成颜色规则：传入字符串
export const getAvatarRandomColor = (str: string) => {
  const index = str.charCodeAt(Math.floor(str.length / 2)); // 用于生成颜色，取字符串中间字节的unicode值
  return ColorWheel[index % ColorWheel.length];
};

function getFirstWordFromString(str: string) {
  if (!str.length) return '';
  const codePoint = str.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint);
}

export enum AvatarType {
  Member,
  Space,
  Team,
}

export interface IAvatarProps extends Omit<IAvatarBaseProps, 'shape'> {
  id: string; // 说明：组件根据id生成随机颜色，一般情况下，成员、部门、空间头像分别传memberId、teamId、spaceId，保证每个地方调用此组件所生成的背景一样
  title: string; // 说明：无图片时获取title的首个字符作为头像
  isGzip?: boolean;
  children?: JSX.Element;
  type?: AvatarType;
  style?: React.CSSProperties;
  defaultIcon?: JSX.Element;
}

const AvatarHoc = Component => {
  const ratio = process.env.SSR ? 2 : Math.max(window.devicePixelRatio, 2);
  const colors = getThemeColors();
  return (props: IAvatarProps) => {
    const { src, title, isGzip = true, id, size = AvatarSize.Size32, type = AvatarType.Member, style, defaultIcon } = props;
    if (!title || !id) return null;
    // 部门
    if (type === AvatarType.Team) {
      return (
        <Component
          {...props}
          shape="square"
          src={src}
          style={{
            ...style,
            backgroundColor: getAvatarRandomColor(id),
            border: !src && '0px',
            ...style,
          }}
        >
          {!src && <TeamIcon className={styles.teamIcon} style={{ width: size, height: size }} />}
        </Component>
      );
    }
    const avatarSrc = isGzip && src ? getImageThumbSrc(src, {
      method: CutMethod.CUT,
      quality: 100,
      size: size * ratio,
    }) : src;
    const firstWord = getFirstWordFromString(title.trim());
    const avatarBg = avatarSrc ? colors.defaultBg : getAvatarRandomColor(id);
    // 空间
    if (type === AvatarType.Space) {
      return (
        <Component
          {...props}
          shape="square"
          src={avatarSrc}
          style={{
            backgroundColor: avatarBg,
            color: colors.defaultBg,
            border: !src && '0px',
            ...style,
          }}
        >
          {!avatarSrc && firstWord.toUpperCase()}
        </Component>
      );
    }

    // 个人
    return (
      <Component
        {...props}
        shape="circle"
        src={avatarSrc}
        style={{
          backgroundColor: defaultIcon ? colors.rc01 : avatarBg,
          color: colors.defaultBg,
          border: !src && '0px',
          ...style,
        }}
      >
        {!avatarSrc && (defaultIcon || firstWord.toUpperCase())}
      </Component>
    );
  };
};

export const Avatar = AvatarHoc(AvatarBase);
