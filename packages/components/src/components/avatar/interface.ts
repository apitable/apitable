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

import { AvatarSizeConfig } from './styled';

export type IAvatarSizeConfigKey = keyof typeof AvatarSizeConfig;

export interface IAvatarProps {
  /** avatar shape */
  shape?: 'circle' | 'square';
  /** avatar size xxs(20px)、xs(24px)、s(32px)、m(40px)、l(64px)、xl(80px) */
  size?: IAvatarSizeConfigKey;
  /** avatar link */
  src?: React.ReactNode;
  /** avatar icon */
  icon?: React.ReactNode;
  /** custom inline style */
  style?: React.CSSProperties;
  /** class name */
  className?: string;
  /** avatar image alt attribute */
  alt?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}