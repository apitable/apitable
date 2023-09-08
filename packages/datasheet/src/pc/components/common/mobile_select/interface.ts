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

import { SelectProps } from 'antd/lib/select';
import * as React from 'react';

export interface IMobileSelectProps extends SelectProps<any> {
  /**
   * @description Callback handling for closures
   */
  onClose?: () => void;

  /**
   * @description Content of the options
   */
  optionData?: IMobileOptionItem[];

  /**
   * @description Title of the mobile option
   */
  title?: string;

  triggerStyle?: React.CSSProperties;

  /**
   * @description Height of selector on mobile
   */
  height?: number | string;

  /**
   * @description Customising the content of triggers
   */
  triggerComponent?: React.ReactNode;

  /**
   * @description Customise the content of the pop-up card
   * @param {any} setVisible
   * @returns {React.ReactNode}
   */
  renderList?: ({ setVisible }: { setVisible: (bool: boolean) => void }) => React.ReactNode;
}

interface IMobileOptionItem {
  /**
   * @description The label to be displayed in the list, either as a string or as a node
   */
  label: React.ReactNode;

  /**
   * @description The value corresponding to the option
   */
  value: any;

  /**
   * @description Front icon of the option
   */
  prefixIcon?: React.ReactNode;

  /**
   * @description Back icon for options
   */
  suffixIcon?: React.ReactNode;

  /**
   * @description Is the current option operable
   */
  disabled?: boolean;
}
