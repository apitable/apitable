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
  background: props.theme.palette.background.primary,
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

  const handleChange = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(color.rgb);
    const { r, g, b, a = 1 } = color.rgb;
    const newColor = Color({ r, g, b }).alpha(a).rgb().string();
    onChange && onChange(newColor);
  };

  return (
    <div>
      <GlobalStyle />
      <StyledSwatch onClick={handleClick} {...triggerProps}>
        <StyledColor rgbaColor={color} />
      </StyledSwatch>
      { displayColorPicker && renderLayer(
        <div {...layerProps}>
          <SketchPicker color={color} onChange={handleChange} />
          <Arrow {...arrowProps} size={5} roundness={0} />
        </div>
      )}
    </div>
  );
};

