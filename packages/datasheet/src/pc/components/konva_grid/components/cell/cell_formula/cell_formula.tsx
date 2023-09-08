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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { BasicValueType, Field, FormulaBaseError } from '@apitable/core';
import { CellCheckbox } from '../cell_checkbox';
import { CellText } from '../cell_text';
import { ICellProps } from '../cell_value';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export const CellFormula: React.FC<React.PropsWithChildren<ICellProps>> = (props) => {
  const { x, y, field, cellValue } = props;
  const isCheckbox = Field.bindModel(field).basicValueType === BasicValueType.Boolean;

  return (
    <Group x={x} y={y}>
      {isCheckbox && !(cellValue instanceof FormulaBaseError) ? <CellCheckbox {...props} x={0} y={0} /> : <CellText {...props} x={0} y={0} />}
    </Group>
  );
};
