import styled, { createGlobalStyle, css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IOption } from 'components/select/interface';
import { ListDeprecate } from '../list_deprecate';

const CssItem = css<Pick<IOption, 'disabled' | 'prefixIcon' | 'suffixIcon'>>`
  position: relative;
  height: 40px;

  ${props => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;

        .prefixIcon, .optionLabel {
          opacity: 0.5;
        }
      `;
    }
    return;
  }}

  padding-left: ${props => {
    if (props.prefixIcon) {
      return '20px';
    }
    return '';
  }};

  padding-right: ${props => {
    if (props.suffixIcon) {
      return '20px';
    }
    return '';
  }};

  svg {
    vertical-align: -0.225em;
  }


  .suffixIcon,
  .prefixIcon {
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
  }

  .suffixIcon {
    right: 0px;
  }

  .prefixIcon {
    left: 0px;

    &.isChecked {
      svg {
        fill: ${props => {
    return props.theme.color.primaryColor;
  }};
      }
    }

  }

  .optionLabel {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 13px;
    line-height: 40px;

    &.isChecked {
      color: ${props => {
    return props.theme.color.primaryColor;
  }};
    }
  }
`;

export const StyledSelectTrigger = styled.div.attrs(applyDefaultTheme) <{ disabled: boolean; focus: boolean }>`
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
  padding: 0 28px 0 8px;
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  user-select: none;
  outline: none;
  transition: all .3s;

  ${(props) => {
    const { fc5 } = props.theme.color;
    if (props.disabled) {
      return css`
        cursor: not-allowed;
      `;
    }
    return !props.disabled && css`
      &:hover {
        border-color: ${fc5};
      }
    `;
  }};

  ${(props) => {
    const { fc6 } = props.theme.color;
    return css`
      background-color: ${fc6};
    `;
  }};

  ${props => {
    const { fc0 } = props.theme.color;
    if (props.focus) {
      return css`
        border-color: ${fc0} !important;
      `;
    }

    return !props.disabled && css`
      &:focus-within {
        border-color: ${fc0} !important;
      }
    `;
  }}
`;

export const StyledSelectedContainer = styled.div.attrs(applyDefaultTheme)`
  flex: 1;
  display: flex;
  align-items: center;

  .optionIcon {
    display: flex;
    align-items: center;
    margin-right: 4px;
  }

  .placeholder {
    display: inline-block;
    font-size: 13px;
    ${(props) => {
    const { blackBlue } = props.theme.color;
    return css`
        color: ${blackBlue[500]};
      `;
  }}
  }

  ${CssItem};
`;

export const PrefixIcon = styled.span`
  height: 100%;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-right: 4px;
`;

export const StyledArrowIcon = styled(PrefixIcon) <{ rotated: boolean }>`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  ${props => props.rotated && css` transform: rotate(180deg); `}
  height: auto;
  transform-origin: 40%;
`;

export const GlobalStyle = createGlobalStyle`
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const hightLightCls = styled.div.attrs(applyDefaultTheme)`
  background: none;
  color: ${(props) => props.theme.palette.primary};
  padding: 0;
`;

export const StyledListContainer = styled.div.attrs(applyDefaultTheme) <{ width: string; minWidth: string }>`
  width: ${(props) => props.width};
  min-width: ${(props) => props.minWidth};
  padding: 4px 0;
  ${props => css`
    background-color: ${props.theme.color.highestBg};
    box-shadow: ${props.theme.color.shadowCommonHighest};
  `}
  border-radius: 4px;
`;

export const OptionOutside = styled(ListDeprecate.Item).attrs(applyDefaultTheme)`

  ${CssItem};

  padding-left: ${props => {
    if (props.prefixIcon) {
      return '28px';
    }
    return '';
  }};

  padding-right: ${props => {
    if (props.suffixIcon) {
      return '28px';
    }
    return '';
  }};

  .suffixIcon {
    right: 8px;
  }

  .prefixIcon {
    left: 8px;
  }
`;
