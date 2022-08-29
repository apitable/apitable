import styled, { css } from 'styled-components';
import { IOptionItem } from './interface';

type IOptionItemStyled = Omit<IOptionItem, 'text'>;

export const OptionsWrapperStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const OptionItemStyled = styled.div<IOptionItemStyled>`
  display: inline-block;
  padding: 0 8px;
  margin: 3px 8px 2px 0;
  border-radius: 10px;
  max-width: 100%;
  font-size: 12px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props => {
    const { bg, textColor } = props;
    return css`
      color: ${textColor};
      background-color: ${bg};
    `;
  }}
`;