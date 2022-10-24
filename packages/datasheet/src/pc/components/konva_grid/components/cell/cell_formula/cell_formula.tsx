import { BasicValueType, Field, FormulaBaseError } from '@apitable/core';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { CellCheckbox } from '../cell_checkbox';
import { CellText } from '../cell_text';
import { ICellProps } from '../cell_value';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
export const CellFormula: React.FC<ICellProps> = (props) => {
  const { x, y, field, cellValue } = props;
  const isCheckbox = Field.bindModel(field).basicValueType === BasicValueType.Boolean;

  return (
    <Group
      x={x}
      y={y}
    >
      {
        isCheckbox && !(cellValue instanceof FormulaBaseError) ?
          <CellCheckbox {...props} x={0} y={0} /> :
          <CellText {...props} x={0} y={0} />
      }
    </Group>
  );
};
