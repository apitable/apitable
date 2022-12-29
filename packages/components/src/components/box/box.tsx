import styled from 'styled-components';
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
  & GridProps & BackgroundProps & BorderProps & PositionProps & ShadowProps;

export const Box = styled.div<IBoxProps>(
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
  )
);