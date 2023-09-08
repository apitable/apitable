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

import { forwardRef } from 'react';
import * as React from 'react';
import { ICellValue } from '@apitable/core';
import { DateTimeEditor, IDateTimeEditorProps } from 'pc/components/editors/date_time_editor';
import { CellDateTime } from 'pc/components/multi_grid/cell/cell_date_time';
import { IExpandFieldEditRef } from '../field_editor';
import style from './style.module.less';

interface IExpandDateTimeEditorProps {
  commonProps: IDateTimeEditorProps;
  isFocus: boolean;
  cellValue: ICellValue;
  showAlarm?: boolean;
}

const ExpandDateTimeEditorBase: React.ForwardRefRenderFunction<IExpandFieldEditRef, IExpandDateTimeEditorProps> = (props, ref) => {
  const { commonProps, isFocus, cellValue, showAlarm } = props;
  return (
    <>
      <DateTimeEditor {...commonProps} ref={(ele) => ((ref as any).current = ele)} showAlarm={showAlarm} />
      {commonProps.editable && !isFocus && (
        <div className={style.overlay}>
          <CellDateTime cellValue={cellValue} field={commonProps.field} recordId={commonProps.recordId} showAlarm={showAlarm} />
        </div>
      )}
    </>
  );
};

export const ExpandDateTimeEditor = forwardRef(ExpandDateTimeEditorBase);
