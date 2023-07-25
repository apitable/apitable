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

import { getNextShadeColor, getContrastText } from 'helper/color_helper';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IButtonBaseProps, IButtonType, IIconSpanStyled } from './interface';
import { ILightOrDarkThemeColors } from '../../colors';

const SIZE_MARGIN_MAP = {
  small: 4,
  middle: 8,
  large: 8
};

const SIZE_ATTR_MAP = {
  small: {
    height: 32,
    padding: '7px 16px',
    borderRadius: 4,
    fontSize: 12,
  },
  middle: {
    height: 40,
    padding: '9px 16px',
    borderRadius: 6,
    fontSize: 14,
  },
  large: {
    height: 48,
    padding: '13px 16px',
    borderRadius: 8,
    fontSize: 14,
  }
};

const getColors = (color: ILightOrDarkThemeColors) => (btnTypeOrColor: IButtonType | string) => {
  const {
    deepPurple,
    bgDangerDefault,
    bgWarnDefault,
    bgSuccessDefault,
    textCommonPrimary,
    bgControlsDefault,
    bgBrandLightHover,
    bgBrandLightActive,
    textStaticPrimary,
    textBrandDefault,
    bgBrandLightDefault,
    bgDangerLightDefault,
    bgDangerLightHover,
    bgDangerLightActive,
    textDangerDefault,
    bgWarnLightDefault,
    bgWarnLightHover,
    bgWarnLightActive,
    textWarnDefault,
    bgSuccessLightDefault,
    bgSuccessLightHover,
    bgSuccessLightActive,
    textSuccessDefault,
    bgBrandDefault
  } = color;
  switch (btnTypeOrColor) {
    case 'default':
      return {
        fill: bgControlsDefault,
        jelly: bgBrandLightDefault,
        jellyHover: bgBrandLightHover,
        jellyActive: bgBrandLightActive,
        jellyText: textBrandDefault,
        text: textCommonPrimary,
      };
    case 'primary':
      return {
        fill: textBrandDefault,
        jelly: bgBrandLightDefault,
        jellyHover: bgBrandLightHover,
        jellyActive: bgBrandLightActive,
        jellyText: textBrandDefault,
        text: textStaticPrimary,
      };
    case 'danger':
      return {
        fill: bgDangerDefault,
        jelly: bgDangerLightDefault,
        jellyHover: bgDangerLightHover,
        jellyActive: bgWarnLightActive,
        jellyText: textWarnDefault,
      };
    case 'warning':
      return {
        fill: bgWarnDefault,
        jelly: bgWarnLightDefault,
        jellyHover: bgWarnLightHover,
        jellyActive: bgDangerLightActive,
        jellyText: textDangerDefault,
      };
    case 'success':
      return {
        fill: bgSuccessDefault,
        jelly: bgSuccessLightDefault,
        jellyHover: bgSuccessLightHover,
        jellyActive: bgSuccessLightActive,
        jellyText: textSuccessDefault,
      };
    case 'confirm':
      return {
        fill: deepPurple[500],
        jelly: bgBrandDefault,
        jellyHover: bgBrandLightHover,
        jellyActive: bgBrandLightActive,
        jellyText: textSuccessDefault,
      };
    default:
      return {
        fill: btnTypeOrColor,
        jelly: btnTypeOrColor,
      };
  }
};

export const IconSpanStyled = styled.span<IIconSpanStyled>`
  display:inline-block;
  line-height: 1;
  ${props => {
    if (!props.existIcon) {
      return '';
    }
    const marginWithSize = SIZE_MARGIN_MAP[props.size || 'middle'];
    if (props.position === 'suffix') {
      return css`
        margin-left:${marginWithSize}px;
        `;
    }
    return css`
    margin-right:${marginWithSize}px;
    `;
  }};
`;

export const TextSpanStyled = styled.span`
  display:inline-block;
  line-height:100%;
`;

export const ButtonBase = styled.button.attrs(applyDefaultTheme) <IButtonBaseProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 100ms linear;
  border: none;
  span,
  svg {
    pointer-events: none;
  }

  &:focus {
    box-shadow: none;
    outline: none;
  };
  &:active {
    box-shadow: none;
    outline: none;
  };
  .loading {
    ${(props) => {
    const marginWithSize = SIZE_MARGIN_MAP[props.size || 'middle'];
    return css`
    margin-right:${marginWithSize}px;
    `;
  }}
  }
  ${(props) => {
    if (props.block) return css`width:100%;`;
    return;
  }}
  ${(props) => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
      `;
    }
    return;
  }};
  ${(props) => {
    const isRound = props.shape === 'round';
    const attr = SIZE_ATTR_MAP[props.size || 'middle'];
    return css`
      border-radius: ${isRound ? attr.height : attr.borderRadius}px;
      padding: ${attr.padding};
      height: ${attr.height}px;
      font-size: ${attr.fontSize}px;
    `;
  }}
  ${(props) => {
    const getColor = getColors(props.theme.color);
    const btnType = props.variant || 'fill';
    const btnColor = props.btnColor || 'default';
    let textColor = 'unset';
    const bgColor = getColor(btnColor)[btnType];
    const defaultTextColor = getColor(btnColor).text;
    let hoverBgColor = 'none';
    let activeBgColor = 'none';
    let hoverTextColor = 'unset';
    let activeTextColor = 'unset';
    const getHoverColor = (color: string) => {
      return getNextShadeColor(color, 1);
    };

    const getActiveColor = (color: string) => {
      return getNextShadeColor(color, 2);
    };

    switch (props.variant) {
      case 'fill':
        textColor = defaultTextColor ? defaultTextColor : getContrastText(bgColor, props.theme.palette.contrastThreshold);
        hoverBgColor = getHoverColor(bgColor);
        hoverTextColor = defaultTextColor ? defaultTextColor : getContrastText(hoverBgColor, props.theme.palette.contrastThreshold);
        activeBgColor = getActiveColor(bgColor);
        activeTextColor = defaultTextColor ? defaultTextColor : getContrastText(activeBgColor, props.theme.palette.contrastThreshold);
        break;
      case 'jelly':
        textColor = getColor(btnColor).jellyText || defaultTextColor || getNextShadeColor(bgColor, 5);
        hoverTextColor = textColor;
        activeTextColor = textColor;
        hoverBgColor = getColor(btnColor).jellyHover || getHoverColor(bgColor);
        activeBgColor = getColor(btnColor).jellyActive || getActiveColor(bgColor);
        break;
    }
    // Disabled status cancel hover and active status ui changes
    if (props.disabled) {
      hoverBgColor = bgColor;
      activeBgColor = bgColor;
    }
    
    return css`
      background: ${bgColor};
      color: ${textColor};
      &:hover {
        color: ${hoverTextColor};
        background: ${hoverBgColor};
      };
      &:active {
        color: ${activeTextColor};
        background: ${activeBgColor};
      }
    `;
  }};
`;

ButtonBase.defaultProps = {
  type: 'button',
};
