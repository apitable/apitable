import * as React from 'react';
import styles from './styles.module.less';
import { useSelector } from 'react-redux';
import { Selectors } from '@apitable/core';
import { MicroColumn } from '../micro_column/micro_column';
import { MicroRow } from '../micro_row/micro_row';
import { IDragOption } from '../drag/interface';

interface IMicroComponent {
  dragOption: IDragOption;
}

export const MicroComponent: React.FC<IMicroComponent> = props => {
  const { dragOption } = props;
  const { dragOffsetY, dragOffsetX } = dragOption;
  const { dragTarget } = useSelector(state => Selectors.getGridViewDragState(state));
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
