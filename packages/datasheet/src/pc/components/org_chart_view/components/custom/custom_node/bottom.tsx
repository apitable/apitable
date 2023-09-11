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

import classNames from 'classnames';
import { FC, useContext } from 'react';
import { useThemeColors } from '@apitable/components';
import { FlowContext } from 'pc/components/org_chart_view/context/flow_context';
import styles from '../styles.module.less';

interface IBottomProps {
  id: string;
  linkIds: string[];
}

export const Bottom: FC<React.PropsWithChildren<IBottomProps>> = ({ id, linkIds }) => {
  const colors = useThemeColors();
  const { setNodeStateMap, horizontal } = useContext(FlowContext);

  return (
    <div
      className={classNames(styles.collapse, {
        [styles.horizontal!]: horizontal,
      })}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.25 8C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 
                11.4518 1.75 8C1.75 4.54822 4.54822 1.75 8 1.75C11.4518 1.75 14.25 4.54822 14.25 8Z"
          fill={colors.defaultBg}
          stroke={colors.primaryColor}
          strokeWidth="1.5"
        />
        <text
          x={8}
          y={12}
          textAnchor="middle"
          fill={colors.primaryColor}
          fontSize={12}
          fontWeight="bold"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setNodeStateMap((prevState) => {
              const nextState = { ...prevState };
              delete nextState[id];
              return nextState;
            });
          }}
        >
          {linkIds.length}
        </text>
      </svg>
    </div>
  );
};
