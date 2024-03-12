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
import { Selectors } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';
import { IDragOption } from '../drag/interface';
import { MicroColumn } from '../micro_column/micro_column';
import { MicroRow } from '../micro_row/micro_row';
import styles from './styles.module.less';

interface IMicroComponent {
  dragOption: IDragOption;
}

export const MicroComponent: React.FC<React.PropsWithChildren<IMicroComponent>> = (props) => {
  const { dragOption } = props;
  const { dragOffsetY, dragOffsetX } = dragOption;
  const { dragTarget } = useAppSelector((state) => Selectors.getGridViewDragState(state));
  const microRowStyle: React.CSSProperties = {
    top: dragOffsetY + 5,
    left: dragOffsetX + 5,
  };

  function Micro() {
    if (dragTarget.recordId) {
      return <MicroRow />;
    }
    if (dragTarget.fieldId && dragTarget.columnIndex !== 0 && dragOffsetX) {
      return <MicroColumn />;
    }
    return <></>;
  }

  return (
    <div style={microRowStyle} className={styles.microWrapper}>
      {Micro()}
    </div>
  );
};
