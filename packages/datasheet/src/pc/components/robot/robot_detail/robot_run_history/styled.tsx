import { ChevronDownOutlined } from '@vikadata/icons';
import styled, { css } from 'styled-components';

export const StyledArrowIcon = styled.span <{ rotated: boolean }>`
  transition: transform 0.3s;
  cursor: pointer;
  ${props => props.rotated && css` transform: rotate(180deg);`}
`;

export const DropIcon = styled(ChevronDownOutlined)`
  vertical-align: middle;
`;