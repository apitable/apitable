import dynamic from 'next/dynamic';
import { AvatarSize, AvatarType, getAvatarRandomColor } from 'pc/components/common';
import { Icon, IconType, Image, Rect, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { FC, memo, useContext } from 'react';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });

function getFirstWordFromString(str: string) {
  if (!str.length) return '';
  const codePoint = str.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint);
}

interface IAvatarProps {
  x?: number;
  y?: number;
  id: string; // 组件根据id生成随机颜色，一般情况下，成员、部门、空间头像分别传memberId、teamId、spaceId，保证每个地方调用此组件所生成的背景一样
  title: string; // 无图片时获取title的首个字符作为头像
  src?: string;
  size?: AvatarSize;
  isGzip?: boolean;
  children?: JSX.Element;
  type?: AvatarType;
  isDefaultIcon?: boolean;
}

export const Avatar: FC<IAvatarProps> = memo((props) => {
  const ratio = Math.max(window.devicePixelRatio, 2);
  const {
    x = 0,
    y = 0,
    src,
    title,
    isGzip = true,
    id,
    size = AvatarSize.Size32,
    type = AvatarType.Member,
    isDefaultIcon,
  } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  if (title == null || id == null) return null;

  const avatarSrc = isGzip && src ? `${src}?imageView2/1/w/${size * ratio}/q/100!` : (src || '');
  const firstWord = getFirstWordFromString(title.trim());
  const avatarBg = avatarSrc ? colors.defaultBg : getAvatarRandomColor(id);

  const renderer = () => {
    switch (type) {
      // 部门
      case AvatarType.Team: {
        if (!src) {
          return (
            <Icon
              type={IconType.TeamAvatar}
              size={size}
              scaleX={0.6}
              scaleY={0.6}
              fill={colors.defaultBg}
              cornerRadius={4}
              background={getAvatarRandomColor(id)}
              transformsEnabled={'all'}
            />
          );
        }
        return (
          <Image
            url={src}
            width={size}
            height={size}
            fill={getAvatarRandomColor(id)}
          />
        );
      }
      case AvatarType.Space: {
        if (!avatarSrc) {
          return (
            <>
              <Rect
                width={size}
                height={size}
                cornerRadius={4}
              />
              <Text
                width={size}
                height={size}
                align={'center'}
                text={firstWord.toUpperCase()}
              />
            </>
          );
        }
        return (
          <Image
            url={avatarSrc}
            width={size}
            height={size}
            fill={avatarBg}
          />
        );
      }
      case AvatarType.Member: {
        if (!avatarSrc && isDefaultIcon) {
          <Icon
            type={IconType.MemberAvatar}
            shape="circle"
            size={size}
            background={colors.rc01}
          />;
        }
        if (!avatarSrc && !isDefaultIcon) {
          const radius = size / 2;
          return (
            <>
              <Circle
                x={radius}
                y={radius}
                radius={radius}
                fill={avatarBg}
              />
              <Text
                width={size}
                height={size}
                align={'center'}
                text={firstWord.toUpperCase()}
                fill={colors.defaultBg}
              />
            </>
          );
        }
        return (
          <Image
            url={avatarSrc}
            shape={'circle'}
            width={size}
            height={size}
            fill={avatarBg}
          />
        );
      }
    }
  };

  return (
    <Group
      x={x}
      y={y}
      listening={false}
    >
      {renderer()}
    </Group>
  );
});
