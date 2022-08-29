import * as React from 'react';
import { ConfigConstant } from '@vikadata/core';
import { useThemeColors } from '@vikadata/components';
import FormIcon from 'static/icon/datasheet/toolbar_form.svg';

const nodeIconMap = {
  [ConfigConstant.NodeType.FORM]: FormIcon,
};

interface INodeIcon {
  nodeType: ConfigConstant.NodeType;
  width?: number;
  height?: number;
  fill?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}

export const NodeIcon: React.FC<INodeIcon> = props => {
  const colors = useThemeColors();
  const { nodeType, width = 15, height = 15, fill = colors.thirdLevelText, onClick } = props;

  if (nodeType && nodeIconMap[nodeType]) {
    return React.createElement(nodeIconMap[nodeType], {
      width,
      height,
      fill,
      onClick,
    });
  } 
  return <></>;
};
