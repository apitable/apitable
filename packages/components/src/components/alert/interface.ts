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

import { IHtmlElementBase } from 'interface';

export interface IAlertProps extends IHtmlElementBase {
  /**
   * Prompt type, associated with color and icon
   */
  type: 'default' | 'error' | 'warning' | 'success'
  /**
   * title of the alert
   */
  title?: string;
  /**
   * content of the alert
   */
  content: string | React.ReactNode;
  /**
   * whether the alert should close
   */
  closable?: boolean;
  /**
   * close action callback function
   */
  onClose?: () => void;
}

export type IAlertWrapper = Pick<IAlertProps, 'title' | 'type'>;
