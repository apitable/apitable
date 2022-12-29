import styled, { css } from 'styled-components';
import { AvatarSizeConfig } from '../styled';
import { IAvatarGroup } from './intarface';

export const AvatarGroupStyled = styled.div<Pick<IAvatarGroup, 'size'>>`
  display: inline-flex;
  /* flex-direction: row-reverse; */
  & > span {
    &:first-child {
      margin-left: 0;
    }
    box-sizing: content-box;
    ${(props) => {
    const sizeKey = props.size || 'm';
    const { size, borderWidth } = AvatarSizeConfig[sizeKey];
    return css`
        margin-left: -${size / 4}px;
        border: ${borderWidth}px solid #fff;
    `;
  }
}
`;