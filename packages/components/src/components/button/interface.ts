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

export type IButtonType = 'default' | 'danger' | 'primary' | 'warning';
export interface IButtonBaseProps {
  shape?: 'round';
  variant?: 'jelly' | 'fill';
  size?: 'small' | 'middle' | 'large';
  btnColor?: IButtonType | string;
  disabled?: boolean;
  block?: boolean;
}

type IButtonHTMLAttributes = Omit<React.ButtonHTMLAttributes<any>, | 'color'>;

export interface IButtonProps extends IButtonHTMLAttributes {
  htmlType?: 'submit' | 'reset' | 'button';
  /** border shape */
  shape?: 'round';
  /** child elements */
  children?: React.ReactNode;
  /** class name */
  className?: string;
  /** button color default | danger | primary | string */
  color?: IButtonType | string;
  /**
   * prefix icon
   */
  prefixIcon?: React.ReactElement;
  /**
   * suffix icon
   */
  suffixIcon?: React.ReactElement;
  /**
   * whether button should be disabled
   */
  disabled?: boolean;
  /**
   * with 100% width
   */
  block?: boolean;
  /**
   * variant type
   */
  variant?: 'fill' | 'jelly';
  /**
   * button size
   */
  size?: 'small' | 'middle' | 'large';
  /**
   * whether button is loading
   */
  loading?: boolean;
}

export interface IIconSpanStyled {
  existIcon: boolean;
  position: string;
  size?: 'small' | 'middle' | 'large';
}
