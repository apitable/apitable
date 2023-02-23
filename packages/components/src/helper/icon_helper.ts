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

import { InfoCircleFilled, WarnCircleFilled, CheckCircleFilled, WarnFilled } from '@apitable/icons';
import React from 'react';

export const IconMap: any = {
  default: InfoCircleFilled,
  error: WarnCircleFilled,
  warning: WarnFilled,
  success: CheckCircleFilled,
};

/**
 * Multicolor icons do not use currentColor
 * @param icon
 * @returns
 */
const shouldUseCurrentColor = (icon: React.ReactElement) => {
  if (Array.isArray(icon?.props?.color)) {
    return false;
  }
  return true;
};
export const getCurrentColorIcon = (icon?: React.ReactElement) => {
  return icon && shouldUseCurrentColor(icon) ? React.cloneElement(icon, { currentColor: true }) : icon;
};
