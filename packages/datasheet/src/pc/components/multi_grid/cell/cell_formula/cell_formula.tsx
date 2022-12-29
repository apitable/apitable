import {
  BasicValueType, Field,
  FormulaBaseError, IFormulaField,
  RowHeightLevel, Strings, t,
} from '@apitable/core';
import { Tooltip } from 'pc/components/common';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { CellCheckbox } from '../cell_checkbox';
import { CellText } from '../cell_text';
import { ICellComponentProps } from '../cell_value/interface';

interface ICellFormula extends ICellComponentProps {
  field: IFormulaField;
  recordId: string,
  rowHeightLevel?: RowHeightLevel,
}

export const CellFormula: React.FC<ICellFormula> = props => {
  const { cellValue, field } = props;
  const isCheckbox = Field.bindModel(field).basicValueType === BasicValueType.Boolean;
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    setShowTip(false);
  }, [props.isActive]);

  const handleDbClick = () => {
    setShowTip(true);
    setTimeout(() => setShowTip(false), 2000);
  };

  const renderCell = () => {
    if (isCheckbox && !(cellValue instanceof FormulaBaseError)) {
      return <CellCheckbox {...props} cellValue={cellValue as any} />;
    }
    return <CellText {...props} cellValue={cellValue as any} />;
  };
  return (
    <div onDoubleClickCapture={handleDbClick} style={{ width: '100%' }} >
      {
        showTip ?
          <Tooltip
            title={t(Strings.formula_check_info)}
            visible={showTip}
            placement="top"
            autoAdjustOverflow
            showTipAnyway
          >
            {renderCell()}
          </Tooltip> :
          renderCell()
      }
    </div>
  );
};
