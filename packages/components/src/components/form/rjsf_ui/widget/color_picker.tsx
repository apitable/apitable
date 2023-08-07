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

import { WidgetProps } from '@rjsf/core';
import Color from 'color';
import React, { useState } from 'react';
import { ColorResult, RGBColor, SketchPicker } from 'react-color';
import { useLayer, Arrow } from 'react-laag';
import styled, { createGlobalStyle } from 'styled-components';
import { applyDefaultTheme } from 'theme';

const GlobalStyle = createGlobalStyle`
  #layers {
    z-index: 1001;
  }
`;

const StyledColor = styled.div<{ rgbaColor: RGBColor }>(props => (
  {
    width: '36px',
    height: '14px',
    borderRadius: '2px',
    background: `rgba(${props.rgbaColor.r}, ${props.rgbaColor.g}, ${props.rgbaColor.b}, ${props.rgbaColor.a})`,
  }
));

const StyledSwatch = styled.div.attrs(applyDefaultTheme)(props => ({
  padding: '5px',
  background: props.theme.color.bgCommonHigh,
  borderRadius: '1px',
  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
  display: 'inline-block',
  cursor: 'pointer',
}));

export const ColorWidget = ({ value, onChange }: WidgetProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const _color = Color(value);
  const [color, setColor] = useState<RGBColor>({
    r: _color.red(),
    g: _color.green(),
    b: _color.blue(),
    a: _color.alpha(),
  });

  const {
    renderLayer,
    triggerProps,
    layerProps,
    arrowProps
  } = useLayer({
    isOpen: displayColorPicker,
    auto: true,
    onOutsideClick: () => setDisplayColorPicker(false)
  });

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.rgb);
    const { r, g, b, a = 1 } = color.rgb;
    const newColor = Color({ r, g, b }).alpha(a).rgb().string();
    onChange && onChange(newColor);
  };

  const GlobalStyleProxy: any = GlobalStyle;
  const _SketchPicker: any = SketchPicker;

  return (
    <div>
      <GlobalStyleProxy />
      <StyledSwatch onClick={handleClick} {...triggerProps}>
        <StyledColor rgbaColor={color} />
      </StyledSwatch>
      { displayColorPicker && renderLayer(
        <div {...layerProps}>
          <_SketchPicker color={color} onChange={handleChange} />
          <Arrow {...arrowProps} size={5} roundness={0} />
        </div>
      )}
    </div>
  );
};

