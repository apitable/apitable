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

import { GridChildComponentProps } from 'react-window';
import { PropsWithChildren } from 'react';
import * as React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IGridViewProperty, Selectors } from '@apitable/core';
import { StatOption } from '../stat_option';
import styles from '../styles.module.less';

type StatOptionForGridBaseProps = GridChildComponentProps & { rightRegion: boolean };

const StatOptionForGridBase: React.FC<React.PropsWithChildren<StatOptionForGridBaseProps>> = ({
  columnIndex, style, rightRegion,
}) => {
  const fieldId = useSelector(state => {
    const frozenColumnCount = (Selectors.getCurrentView(state) as IGridViewProperty).frozenColumnCount;
    const columns = Selectors.getVisibleColumns(state);
    const curColumnIndex = rightRegion ? columnIndex + frozenColumnCount : columnIndex;
    const col = columns[curColumnIndex];
    if (!col) return '';
    return col.fieldId;
  }, shallowEqual);

  if (!fieldId) return null;

  return <StatOption className={styles.gridBottom} fieldId={fieldId} style={style} />;
};

const StatOptionForGridLeftBase = (props: PropsWithChildren<GridChildComponentProps>) => {
  return (
    <StatOptionForGridBase {...props} rightRegion={false} />
  );
};

const StatOptionForGridRightBase = (props: PropsWithChildren<GridChildComponentProps>) => {
  return (
    <StatOptionForGridBase {...props} rightRegion />
  );
};

export const StatOptionForGridLeft = React.memo(StatOptionForGridLeftBase);
export const StatOptionForGridRight = React.memo(StatOptionForGridRightBase);
