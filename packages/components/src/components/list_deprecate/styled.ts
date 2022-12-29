import styled, { css } from 'styled-components';
import { IOption } from 'components/select/interface';
import { applyDefaultTheme } from 'theme';
import { Typography } from 'components/typography';

export const StyledItemContainer = styled.div.attrs(applyDefaultTheme) <IOption & { height: number }>`
  position: relative;
  width: 100%;
  height: ${props => props.height + 'px'};

  ${props => {
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        color: ${props => props.theme.palette.text.third};

        .svg {
          fill: currentColor;
        }
      ;
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


  &.paddingPreFixIcon {
    padding-left: 20px;
  }

  &.paddingSuffixIcon {
    padding-right: 20px;
  }


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
    right: 0;
  }

  .prefixIcon {
    left: 0;
  }

  .optionLabel {
    width: 100%;
    height: 100%;
    display: block;
    font-size: 13px;
    line-height: 40px;
  }
`;

export const WrapperDiv = styled.div.attrs(applyDefaultTheme)`
  &:focus {
    outline: none
  }


  @media (any-hover: hover) {
    .hoverBg {
      ${props => css`background: ${props.theme.color.highestBg};`}
    }
  }


  @media screen and(max-width: 768) {
    box-shadow: none;
    background: none;
    height: 100%;

    .listBox {
      overflow: auto;
      max-height: 442px; //FIXME: @sujian
    }

    .optionItem {
      height: 48px;
      line-height: 48px;
      ${props => css`border-bottom: 1px solid ${props.theme.color.blackBlue[200]};`}
    }

    .footerContainer {
      font-size: 14px;
    }

    .noResult {
      font-size: 14px;
    }
  }
`;

export const StyledSearchInputWrapper = styled.div`
  padding: 8px 16px;
`;

export const ResultSpan = styled.span.attrs(applyDefaultTheme)`
  font-size: 11px;
  padding-bottom: 8px;
  height: 30px;
  line-height: 30px;
  color: ${(props) => props.theme.palette.text.third};
  width: 100%;
  text-align: center;
  display: inline-block;

  @media screen and(max-width: 768px) {
    font-size: 14px;
  }
`;

export const StyledListWrapper = styled.div`
  max-height: 340px;
  overflow-y: overlay;
  overflow-x: hidden;
  padding-left: 8px;
  padding-right: 8px;

  @media screen and(max-width: 768px) {
    overflow: auto;
    max-height: 442px;
  }
`;

export const FootWrapper = styled.div`
  &:hover {
    ${props => css`background: ${props.theme.color.blackBlue[100]};`}
  }

  @media screen and(max-width: 768px) {
    font-size: 14px;
  }
`;

export const StyledListItem = styled(Typography).attrs(applyDefaultTheme)<{ disabled?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;

  @media (any-hover: hover) {
    ${(props) => {
    return !props.disabled && css`
        &:hover {
          ${props => css`background: ${props.theme.color.fc6};`}
          border-radius: 8px;
        }
      `;
  }}

  }

  @media screen and(max-width: 768px) {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eee;
  }
`;
