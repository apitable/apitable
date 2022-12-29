import styled, { css } from 'styled-components';
import { ICheckboxProps } from './interface';
import { applyDefaultTheme } from 'theme';

type ICheckboxIconProps = Omit<ICheckboxProps, 'onChange'>;

export const CheckboxIconWrapper = styled.div.attrs(applyDefaultTheme) <ICheckboxIconProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
  transition: background 200ms ease-out 0s;
  border-radius: 2px;
  border: ${(props) => !props.checked ? `2px solid ${props.theme.color.black[400]}` : 'none'};
  &:hover{
    border: ${(props) => !props.checked ? `2px solid ${props.color || props.theme.palette.primary}` : 'none'};
  }
  background: ${(props) => props.checked ? props.color || props.theme.palette.primary : 'none'};
`;

export const CheckboxWrapper = styled.div.attrs(applyDefaultTheme) <ICheckboxIconProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    ${CheckboxIconWrapper} {
      border: ${(props) => !props.checked ? `2px solid ${props.color || props.theme.palette.primary}` : 'none'};
    }
  }
  ${props => {
    return css`
      color: ${props.theme.color.textCommonPrimary};
    `; 
  }}
  ${props => {
    if (props.disabled) {
      return css`
          cursor: not-allowed;
          opacity: 0.5;
          pointer-events: none;
        `;
    }
    return css``;
  }}
`;
