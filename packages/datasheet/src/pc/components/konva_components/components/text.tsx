import { useThemeColors } from '@vikadata/components';
import { ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';

const TextComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/text'), { ssr: false });

export const Text: FC<ShapeConfig> = memo((props) => {
  const colors = useThemeColors();
  const {
    x,
    y,
    width,
    height,
    text,
    padding,
    align = 'left',
    verticalAlign = 'middle',
    fill = colors.firstLevelText,
    textDecoration,
    fontSize = 13,
    fontStyle = 'normal',
    ellipsis = true,
    wrap = 'none',
    transformsEnabled = 'position',
    listening = false,
    fontFamily = `'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
                  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    ...rest
  } = props;

  return (
    <TextComponent
      x={x}
      y={y}
      text={text}
      width={width}
      height={height}
      padding={padding}
      verticalAlign={verticalAlign}
      align={align}
      fill={fill}
      textDecoration={textDecoration}
      fontSize={fontSize}
      fontStyle={fontStyle}
      fontFamily={fontFamily}
      hitStrokeWidth={0}
      ellipsis={ellipsis}
      wrap={wrap}
      transformsEnabled={transformsEnabled}
      perfectDrawEnabled={false}
      listening={listening}
      {...rest}
    />
  );
});
