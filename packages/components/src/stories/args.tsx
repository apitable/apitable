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

// https://storybook.js.org/docs/react/essentials/controls

import React from 'react';
import { LockOutlined, ShareFilled, RankFilled, WebOutlined } from '@apitable/icons';

export const iconComponents = {
  LockOutlined: <LockOutlined currentColor />,
  ShareFilled: <ShareFilled currentColor />,
  RankFilled: <RankFilled currentColor />,
  WebOutlined: <WebOutlined currentColor />,
};

export const iconArg = {
  options: ['LockOutlined', 'ShareFilled', 'RankFilled', 'WebOutlined'],
  mapping: iconComponents,
};

export const icons = {
  LockOutlined,
  ShareFilled,
  RankFilled,
  WebOutlined,
};

export const iconPrimaryArg = {
  options: ['LockOutlined', 'ShareFilled', 'RankFilled', 'WebOutlined'],
  mapping: icons,
};