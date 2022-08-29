import { getNextShadeColor, getContrastText } from 'helper/color_helper';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IButtonBaseProps, IButtonType } from './interface';

export const IconSpanStyled = styled.span<{ existIcon: boolean; position: string }>`
  display:inline-block;
  vertical-align:-0.225em;
  line-height: 1;
  ${props => {
    if (!props.existIcon) {
      return '';
    }
    if (props.position === 'suffix') {
      return css`
        margin-left:4px;
        `;
    }
    return css`
    margin-right:4px;
    `;
  }};
`;

export const TextSpanStyled = styled.span`
  display:inline-block;
  line-height:100%;
`;

export const ButtonBase = styled.button.attrs(applyDefaultTheme) <IButtonBaseProps>`
  cursor: pointer;
  transition: background-color 100ms linear;
  border: none;
  line-height: normal;
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
    display: inline-block;
    margin-right: 4px;
    vertical-align: middle;
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
    const sizeAttrMap = {
      small: {
        height: 32,
        padding: '7px 16px',
        borderRadius: isRound ? 32 : 4,
        fontSize: 12,
      },
      middle: {
        height: 40,
        padding: '9px 16px',
        borderRadius: isRound ? 40 : 6,
        fontSize: 14,
      },
      large: {
        height: 48,
        padding: '13px 16px',
        borderRadius: isRound ? 48 : 8,
        fontSize: 14,
      }
    };
    const attr = sizeAttrMap[props.size || 'middle'];
    return css`
      border-radius: ${attr.borderRadius}px;
      padding: ${attr.padding};
      height: ${attr.height}px;
      font-size: ${attr.fontSize}px;
    `;
  }}
  ${(props) => {
    const {
      deepPurple,
      red,
      orange,
      teal,
      fc1,
      fill0,
      primaryLight,
      primaryLightHover,
      primaryLightActive,
      staticWhite0,
      textBrandDefault,
    } = props.theme.color;
    const getColor = (color: IButtonType | string) => {
      const colorMap: any = {
        default: {
          fill: fill0,
          jelly: primaryLight,
          jellyHover: primaryLightHover,
          jellyActive: primaryLightActive,
          text: fc1,
        },
        primary: {
          fill: textBrandDefault,
          jelly: primaryLight,
          jellyHover: primaryLightHover,
          jellyActive: primaryLightActive,
          jellyText: textBrandDefault,
          text: staticWhite0,
        },
        danger: {
          fill: red[500],
          jelly: red[50],
        },
        warning: {
          fill: orange[500],
          jelly: orange[50],
        },
        success: {
          fill: teal[500],
          jelly: teal[50]
        },
        confirm: {
          fill: deepPurple[500],
          jelly: deepPurple[50],
        },
      };
      const res = colorMap[color];
      if (!res) {
        return {
          fill: color,
          jelly: color,
        };
      }
      return res;
    };

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
    // 禁用状态下，都是 hover 和 active 没反应。
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
