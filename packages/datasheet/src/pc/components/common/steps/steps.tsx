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

import classnames from 'classnames';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { CheckOutlined } from '@apitable/icons';
import styles from './styles.module.less';

export interface IStepsProps {
  current: number;
  steps: IStepItem[];
  onChange: (current: number) => void;
}

export interface IStepItem {
  title: string;
  onClick?: (item: IStepItem, index: number) => void;
}

export const Steps: React.FC<React.PropsWithChildren<IStepsProps>> = ({ current, steps }) => {
  const colors = useThemeColors();
  const stepItem = (item: IStepItem, index: number) => {
    const isFinish = current > index;
    return (
      <div key={item.title} className={classnames(styles.stepItem, current === index && styles.stepItemActive, isFinish && styles.stepItemFinish)}>
        <div className={styles.stepItemIcon} onClick={() => item?.onClick?.(item, index)}>
          {isFinish ? <CheckOutlined color={colors.staticWhite0} size={16} /> : index + 1}
        </div>
        <div className={styles.stepItemContent}>
          <div className={styles.stepItemTitle}>{item.title}</div>
        </div>
      </div>
    );
  };

  return <div className={styles.steps}>{steps.map((v, index) => stepItem(v, index))}</div>;
};
