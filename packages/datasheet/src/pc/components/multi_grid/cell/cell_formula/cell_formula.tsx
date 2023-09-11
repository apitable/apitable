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

import { useEffect, useState } from 'react';
import * as React from 'react';
import { BasicValueType, Field, FormulaBaseError, IFormulaField, RowHeightLevel, Strings, t } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { CellCheckbox } from '../cell_checkbox';
import { CellText } from '../cell_text';
import { ICellComponentProps } from '../cell_value/interface';

interface ICellFormula extends ICellComponentProps {
  field: IFormulaField;
  recordId: string;
  rowHeightLevel?: RowHeightLevel;
}

export const CellFormula: React.FC<React.PropsWithChildren<ICellFormula>> = (props) => {
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
    <div onDoubleClickCapture={handleDbClick} style={{ width: '100%' }}>
      {showTip ? (
        <Tooltip title={t(Strings.formula_check_info)} visible={showTip} placement="top" autoAdjustOverflow showTipAnyway>
          {renderCell()}
        </Tooltip>
      ) : (
        renderCell()
      )}
    </div>
  );
};
