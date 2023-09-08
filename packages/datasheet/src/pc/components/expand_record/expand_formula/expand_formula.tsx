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

import * as React from 'react';
import { IFormulaField, Field, BasicValueType, FormulaBaseError } from '@apitable/core';
import { IBaseEditorProps } from 'pc/components/editors/interface';
import { CellCheckbox } from 'pc/components/multi_grid/cell/cell_checkbox';
import { CellText } from 'pc/components/multi_grid/cell/cell_text';
import { useComputeCellValue } from 'pc/hooks/use_cellvalue';
import styles from '../field_editor/style.module.less';
import expandRecordStyles from '../style.module.less';

export const ExpandFormula: React.FC<React.PropsWithChildren<IBaseEditorProps & { recordId: string }>> = (props) => {
  const { recordId } = props;
  const field = props.field as IFormulaField;
  const cellValue = useComputeCellValue({
    recordId,
    field,
  });

  const isCheckbox = Field.bindModel(field).basicValueType === BasicValueType.Boolean;

  if (isCheckbox && !(cellValue instanceof FormulaBaseError)) {
    return <CellCheckbox className={expandRecordStyles.expandFormulaCheckbox} cellValue={cellValue as boolean} field={field} />;
  }
  return <CellText className={styles.expandCellText} cellValue={cellValue as any} field={field} />;
};
