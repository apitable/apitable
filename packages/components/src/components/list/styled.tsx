import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { IListProps } from './interface';

export const ListStyled = styled.div.attrs(applyDefaultTheme)<IListProps>`
  box-sizing: border-box;
  font-size: 14px;
  ${props => {
    if (props.bordered) {
      return css`
        border: 1px solid ${props.theme.color.borderCommon};
        border-radius: 4px;
      `;
    }
    return '';
  }}
  & > div:last-child {
    border-bottom: none;
  }
`;

export const ListHeaderStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
      border-bottom: 1px solid ${props.theme.color.borderCommon};
    `;
  }}
`;

export const ListFooterStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
    `;
  }}
`;

export const ListItemStyled = styled.div.attrs(applyDefaultTheme)`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
      border-bottom: 1px solid ${props.theme.color.borderCommon};
    `;
  }}
  &:last-child {
    border-bottom: none;
  }
`;

export const ListItemActionsStyled = styled.div`
  flex: 0 0 auto;
`;