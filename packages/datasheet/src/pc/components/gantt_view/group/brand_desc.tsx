import { Strings, t } from '@apitable/core';
import { LogoPurpleFilled, LogoTextEnFilled, LogoTextFilled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { EXPORT_IMAGE_PADDING } from 'pc/components/gantt_view/constant';
import { Icon, Line, Text } from 'pc/components/konva_components';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

const LogoPurpleFilledPath = LogoPurpleFilled.toString();
const LogoTextFilledPath = LogoTextFilled.toString();
const LogoTextEnFilledPath = LogoTextEnFilled.toString();
const LINE_WIDTH = 100;

const BrandDesc = (props) => {
  const { baseX, containerHeight, isLight, colors, isZhCN } = props;

  return <Group
    x={baseX}
    y={containerHeight + EXPORT_IMAGE_PADDING * 2}
    listening={false}
  >
    <Line
      y={0.5}
      points={[0, 0, LINE_WIDTH, 0]}
      stroke={colors.fc5}
    />
    <Icon
      x={isZhCN ? 132 : 197}
      y={-8}
      scaleX={0.12}
      scaleY={0.12}
      transformsEnabled={'all'}
      data={LogoPurpleFilledPath}
      fill={colors.primaryColor}
    />
    <Icon
      x={isZhCN ? 150 : 215}
      y={-8}
      data={isZhCN ? LogoTextFilledPath : LogoTextEnFilledPath}
      fill={isLight ? '#000650' : '#ffffff'}
    />
    <Text
      x={isZhCN ? 198 : 125}
      y={-5}
      text={t(Strings.export_brand_desc)}
      fontSize={12}
      fill={colors.thirdLevelText}
    />
    <Line
      y={0.5}
      x={300}
      points={[0, 0, LINE_WIDTH, 0]}
      stroke={colors.fc5}
    />
  </Group>;
};
export default BrandDesc;
