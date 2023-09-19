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

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;
export interface ISwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  text?: boolean|string;
  prefixCls?: string;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  clazz ?: {
    checkedText?: string,
    unCheckedText?: string,
    checkedCircle?: string
    unCheckedCircle?: string
    checkedBackground?: string
    unCheckedBackground?: string
  }
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  /**
   * Whether checked or not
   */
  checked?: boolean;
  /**
   * Default is Checked or UnChecked
   */
  defaultChecked?: boolean;
  /**
   * switch loading status
   */
  loading?: boolean;
  /**
   * loading icon
   */
  loadingIcon?: React.ReactNode;
  /**
   * inline styles
   */
  style?: React.CSSProperties;
  title?: string;
  /**
   * size
   */
  size?: 'small' | 'default' | 'large' |'xl';
}
