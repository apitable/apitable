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

import { colorVars } from '@apitable/components';
import { WarnFilled, WarnCircleFilled, CheckCircleFilled, InfoCircleFilled } from '@apitable/icons';
// const modulesFiles = require.context('./modules', true, /.js$/)

enum StatusType {
  Info = 'info',
  Primary = 'primary',
  Success = 'success',
  Error = 'error',
  Danger = 'danger',
  Warning = 'warning',
}

interface IStatusIconFuncProps {
  type: string,
  fillColor?: string;
  width?: number;
  height?: number;
}
export const StatusIconFunc = (props: IStatusIconFuncProps) => {
  const { type, fillColor, width = 24 } = props;
  switch (type) {
    case StatusType.Info:
      return InfoCircleFilled({ size: width, color: fillColor || colorVars.primaryColor });
    case StatusType.Primary:
      return InfoCircleFilled({ size: width, color: fillColor || colorVars.primaryColor });
    case StatusType.Success:
      return CheckCircleFilled({ size: width, color: fillColor || colorVars.successColor });
    case StatusType.Error:
      return WarnCircleFilled({ size: width, color: fillColor || colorVars.textDangerDefault });
    case StatusType.Danger:
      return WarnCircleFilled({ size: width, color: fillColor || colorVars.textDangerDefault });
    case StatusType.Warning:
      return WarnFilled({ size: width, color: fillColor || colorVars.textWarnDefault });
    default:
      return null;
  }
};
