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
import { get } from 'lodash';
import * as React from 'react';
import { ICellValue, Strings, t } from '@apitable/core';
import { FileOutlined } from '@apitable/icons';
import styles from '../../../expand_record/expand_work_doc/styles.module.less';
import { ICellComponentProps } from '../cell_value/interface';

type ICellWorkDoc = ICellComponentProps & {
  cellValue: ICellValue;
};

export const CellWorkdoc: React.FC<React.PropsWithChildren<ICellWorkDoc>> = (props) => {
  const { cellValue } = props;
  const title = get(cellValue, '0.title') || t(Strings.workdoc_unnamed);
  return (
    <div className={classNames('expandWorkdoc', styles.expandWorkdoc)}>
      <div className={classNames('workdocBtn', styles.workdocBtn)}>
        <FileOutlined />
        <div className={styles.workdocTitle}>{title}</div>
      </div>
    </div>
  );
};
