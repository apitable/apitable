import { useThemeColors } from '@apitable/components';
import { Box } from 'konva/lib/shapes/Transformer';
import dynamic from 'next/dynamic';
import { FC, memo, useCallback, useEffect, useMemo, useRef } from 'react';

const TransformerComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/transformer'), { ssr: false });

interface ITransformerProps {
  shapeName: string;
  leftAnchorEnable?: boolean;
  rightAnchorEnable?: boolean;
  boundBoxFunc?: (oldBox: Box, newBox: Box) => Box;
}

enum PositionType {
  MiddleLeft = 'MiddleLeft',
  MiddleRight = 'MiddleRight',
}

export const Transformer: FC<ITransformerProps> = memo((props) => {
  const colors = useThemeColors();
  const { shapeName, leftAnchorEnable = true, rightAnchorEnable = true, boundBoxFunc } = props;
  const transformerRef = useRef<any>();

  const enabledAnchors = useMemo(() => {
    const anchors: string[] = [];

    if (leftAnchorEnable) {
      anchors.push('middle-left');
    }
    if (rightAnchorEnable) {
      anchors.push('middle-right');
    }
    return anchors;
  }, [leftAnchorEnable, rightAnchorEnable]);

  const anchor = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 25;
    canvas.height = 25;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = colors.defaultBg;
    return canvas;
  }, [colors]);

  const setAnchor = useCallback((type: PositionType) => {
    const transformer = transformerRef.current;
    const isLeft = type === PositionType.MiddleLeft;
    const anchorClass = isLeft ? '.middle-left' : '.middle-right';
    const transformerAnchor = transformer.find(anchorClass)[0];

    transformerAnchor.fillPriority('pattern');
    transformerAnchor.fillPatternImage(anchor);
    transformerAnchor.strokeEnabled(false);
  }, [anchor]);

  useEffect(() => {
    if(!transformerRef.current) {
      return;
    }
    const stage = transformerRef.current.getStage();
    const selectedNode = stage.findOne('.' + shapeName);
    if (selectedNode === transformerRef.current.nodes()[0]) return;
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      setAnchor(PositionType.MiddleLeft);
      setAnchor(PositionType.MiddleRight);
    } else {
      transformerRef.current.nodes([]);
    }
    transformerRef.current.getLayer().batchDraw();
  }, [setAnchor, shapeName]);

  return (
    <TransformerComponent
      name={'transformer'}
      _ref={transformerRef}
      rotateEnabled={false}
      ignoreStroke
      anchorSize={25}
      enabledAnchors={enabledAnchors}
      borderStrokeWidth={0}
      boundBoxFunc={boundBoxFunc}
    />
  );
});
