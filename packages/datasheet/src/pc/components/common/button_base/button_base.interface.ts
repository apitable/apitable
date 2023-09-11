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

export type ButtonSize = 'x-small' | 'small' | 'middle' | 'large';

type ButtonShape = 'circle' | 'round' | 'square';

type IAnchorButtonProps = {
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

type INativeButtonProps = {
  htmlType?: 'submit' | 'button' | 'reset';
  onClick?: React.MouseEventHandler<HTMLElement>;
} & Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

interface IButtonBaseProps {
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
  border?: boolean;
  reversal?: boolean;
  shadow?: boolean;
  className?: string;
  prefixCls?: string;
}

export type IButtonBase = IButtonBaseProps & IAnchorButtonProps & INativeButtonProps;
