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

export interface IAvatarGroup {
  /**
   * maximum number of avatars displayed
   */
  max?: number;
  /** avatar size xxs(20px)、xs(24px)、s(32px)、m(40px)、l(64px)、xl(80px) */
  size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
  /**
   * avatar inline style
   */
  maxStyle?: React.CSSProperties;
  /**
   * popover
   */
  popoverContent?: React.ReactNode;
}
