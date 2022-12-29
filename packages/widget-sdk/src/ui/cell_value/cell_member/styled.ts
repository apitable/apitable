import styled, { css } from 'styled-components';

export const CellMemberWrapperStyled = styled.div`
  display: flex;
`;

export const CellMemberStyled = styled.div`
  display: flex;
  padding: 4px 10px 4px 2px;
  background-color: #E8EAED;
  border-radius: 16px;
  margin: 2px 8px 2px 0;
`;

export const AvatarStyled = styled.div<{ avatar?: string; bg?: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  user-select: none;
  border: 1px solid #E8EAED;
  background-position: center;
  background-color: rgb(255, 255, 255);
  ${props => {
    if (props.avatar) {
      return css`
        background-image: url(${props.avatar})
      `;
    }
    return css``;
  }}
  ${props => {
    if (props.bg) {
      return css`
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${props.bg};
        color: #fff;
        font-size: 10px;
      `;
    }
    return css``;
  }}
`;

export const NameStyled = styled.span`
  padding-left: 2px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

