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

import React from 'react';
import styled from 'styled-components';

export const Icon = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})``;

export interface IIconProps {
  size?: number | string;
  color?: string | string[];
  className?: string;
  currentColor?: boolean;
  showTitle?: boolean;
  onClick?: () => void;
}
type IconWrapperProps = Pick<IIconProps, 'size' | 'color'>;

const Svg = styled(Icon) <IconWrapperProps>` 
  width: ${(props) => typeof props.size === 'number' ? props.size + 'px' : props.size};
  height: ${(props) => typeof props.size === 'number' ? props.size + 'px' : props.size};
  color: ${(props) => props.color};
`;

interface IMakeIconProps {
  Path: React.FC<{ colors: string[] }>;
  name: string;
  defaultColors: string[];
  width?: string;
  height?: string;
  viewBox: string;
  colorful?: boolean;
  allPathData?: string[];
}

export const makeIcon = ({
  Path, name, defaultColors = [], width = '16', height = '16', viewBox = '0 0 16 16', allPathData = [], colorful
}: IMakeIconProps): React.FC<IIconProps> => {
  const IconComponent: React.FC<IIconProps> = props => {
    const { size = 16, color = defaultColors, className, currentColor, showTitle = false, onClick } = props;
    // const iconType = name.split('_').slice(-1)[0];
    let pathColors = [color].flat();
    if (currentColor) {
      pathColors = Array(defaultColors.length).fill('currentColor');
    }
    if (pathColors.length < defaultColors.length) {
      pathColors.splice(pathColors.length, 0, ...defaultColors.slice(pathColors.length));
    }
    if (colorful) {
      return <Svg width={width} height={height} viewBox={viewBox} className={className} size={size} fill="none" onClick={onClick}>
        {showTitle && <title>{name}</title>}
        <Path colors={pathColors} />
      </Svg>;
    }
    return <Svg width={width} height={height} viewBox={viewBox} className={className} size={size} fill={pathColors[0]} onClick={onClick}>
      {showTitle && <title>{name}</title>}
      <Path colors={['inherit']} />
    </Svg>;
  };

  IconComponent.toString = () => {
    return allPathData.join('\n');
  };
  return IconComponent;
};
