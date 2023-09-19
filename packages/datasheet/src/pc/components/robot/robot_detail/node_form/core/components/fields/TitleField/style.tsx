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

import { FloatUiTooltip as Tooltip } from '@apitable/components';
import { QuestionCircleOutlined } from '@apitable/icons';
import styles from './style.module.less';

export interface IHelp {
  text: string;
  url: string;
}

//  TODO: Here the tooltips component is missing, hovering over the icon should show helpText
export const HelpIconButton = ({ help }: { help: IHelp }) => {
  if (!help) return null;
  return (
    <Tooltip content={help.text}>
      <a href={help.url} rel="noopener noreferrer" style={{ marginLeft: 4 }} target="_blank">
        <QuestionCircleOutlined className={styles.helpIcon} color="#8c8c8c" />
      </a>
    </Tooltip>
  );
};
