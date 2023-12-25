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

import styled  from 'styled-components';
import {
  space, SpaceProps,
  color, ColorProps,
  typography, TypographyProps,
  layout, LayoutProps,
  flexbox, FlexboxProps,
  grid, GridProps,
  background, BackgroundProps,
  border, BorderProps,
  position, PositionProps,
  shadow, ShadowProps,
  compose,
} from 'styled-system';

type IBoxProps = SpaceProps & LayoutProps & ColorProps & FlexboxProps & TypographyProps
  & GridProps & BackgroundProps & BorderProps & PositionProps & ShadowProps & {
  gap?: string | number;
};

export const Box: any = styled.div<IBoxProps>(
  compose(
    space,
    color,
    typography,
    layout,
    flexbox,
    grid,
    background,
    border,
    position,
    shadow,
  ),
);
