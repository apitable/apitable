import { BasicValueType } from '@apitable/core';
import { useThemeColors } from '@apitable/components';
import * as React from 'react';
import CheckBoxIcon from 'static/icon/datasheet/column/datasheet_icon_checkbox.svg';
import NumberIcon from 'static/icon/datasheet/column/datasheet_icon_figure.svg';
import StringIcon from 'static/icon/datasheet/column/datasheet_icon_text.svg';
import DateTimeIcon from 'static/icon/datasheet/column/datasheet_icon_calendar.svg';

const IconMap = {
  [BasicValueType.Array]: StringIcon,
  [BasicValueType.DateTime]: DateTimeIcon,
  [BasicValueType.Number]: NumberIcon,
  [BasicValueType.String]: StringIcon,
  [BasicValueType.Boolean]: CheckBoxIcon,
};

interface IViewIcon {
  valueType: BasicValueType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const ValueTypeIcon: React.FC<IViewIcon> = props => {
  const colors = useThemeColors();
  const { valueType, width = 16, height = 16, fill = colors.thirdLevelText, onClick } = props;
  const ComponentIcon = valueType && IconMap[valueType];
  if (ComponentIcon) {
    return <ComponentIcon width={width} height={height} fill={fill} onClick={onClick} />;
  } 
  return null;
  
};
