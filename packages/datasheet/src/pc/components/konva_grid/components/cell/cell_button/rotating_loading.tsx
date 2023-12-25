import Konva from 'konva';
import { Group } from 'konva/lib/Group';
import React, { FC, useEffect, useRef } from 'react';
import { Path as PathComponent, Rect as RectComponent, Group as GroupComponent } from 'react-konva';
import { LoadingFilled } from '@apitable/icons';

const transformsEnabled = 'position';
const RotatingLoading: FC<{
  x: number;
  textColor: string;
  name: string;
  y: number;
}> = ({ x, y, name, textColor }) => {
  const groupRef = useRef<Group | null>();
  const size = 16;
  useEffect(() => {
    const cloudAnimation = new Konva.Animation((frame) => {
      if (!frame) return;
      // const posX = Math.sin((frame.time * 2 * Math.PI) / 60);
      // @ts-ignore
      groupRef.current?.rotate?.(16);
    });

    cloudAnimation.start();
    return () => {
      cloudAnimation.stop();
    };
  }, []);

  return (
    <GroupComponent
      name={name}
      x={x + size / 2}
      y={y + size / 2}
      offsetX={size / 2}
      offsetY={size / 2}
      ref={(ref) => {
        groupRef.current = ref;
      }}
    >
      <PathComponent
        data={LoadingFilled.toString()}
        width={size}
        height={size}
        fill={textColor}
        transformsEnabled={transformsEnabled}
        perfectDrawEnabled={false}
        listening={false}
      />
    </GroupComponent>
  );
};

export default RotatingLoading;
