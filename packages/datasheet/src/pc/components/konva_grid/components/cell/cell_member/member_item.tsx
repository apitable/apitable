import { IUnitValue, IUserValue, MemberType } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { AvatarSize, AvatarType } from 'pc/components/common';
import { Rect, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { rgbaToHex } from 'pc/utils';
import * as React from 'react';
import { useContext } from 'react';
import { Avatar } from './avatar';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
interface IMemberItemProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  avatarSize?: number;
  unitInfo: IUnitValue | IUserValue;
}

function isUnitLeave(unit: IUnitValue | IUserValue) {
  if (!unit) return true;
  if (unit.isDeleted) { return true; }
  if (unit.type === MemberType.Member && !unit.isActive) { return true; }
  return false;
}

const AVATAR_MARGIN_LEFT = 2;
const AVATAR_MARGIN_RIGHT = 4;

export const MemberItem: React.FC<IMemberItemProps> = props => {
  const { unitInfo, x = 0, y = 0, width, height, avatarSize = AvatarSize.Size20, children } = props;
  const { unitId, avatar, name, type, uuid, isSelf, desc } = unitInfo as any;
  const isLeave = isUnitLeave(unitInfo);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  return (
    <Group
      x={x}
      y={y}
      opacity={isLeave ? 0.5 : 1}
    >
      <Rect
        width={width}
        height={height}
        fill={rgbaToHex(colors.firstLevelText, 0.1)}
        cornerRadius={unitInfo.type === MemberType.Team ? 4 : 16}
      />
      <Avatar
        x={AVATAR_MARGIN_LEFT}
        y={(height - avatarSize) / 2}
        id={unitId || uuid!}
        title={name}
        size={avatarSize}
        src={avatar}
        type={type === MemberType.Team ? AvatarType.Team : AvatarType.Member}
        isDefaultIcon={isSelf}
      />
      <Text
        x={avatarSize + AVATAR_MARGIN_RIGHT}
        height={height}
        text={name}
      />
      {
        desc &&
        <Text
          x={50}
          height={height}
          text={name}
        />
      }
      {children}
    </Group>
  );
};
