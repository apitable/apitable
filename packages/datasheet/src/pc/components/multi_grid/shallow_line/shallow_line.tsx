import { useMemo } from 'react';
import * as React from 'react';
import { IGridViewColumn, Selectors } from '@apitable/core';
import styles from './styles.module.less';
import { OPERATE_COLUMN_WIDTH } from '../cell';

interface IShallowLine {
  frozenColumns: IGridViewColumn[];
  groupOffset: number;
  scrollLeft: number;
}

export const ShallowLine: React.FC<IShallowLine> = React.memo(props => {
  const { frozenColumns, groupOffset, scrollLeft } = props;
  const frozenColumnWidth = useMemo(() => {
    return frozenColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), 0);
  }, [frozenColumns]);
  return (
    <div
      className={styles.shallowLine}
      style={{
        left: scrollLeft > 0 ?
          frozenColumnWidth + OPERATE_COLUMN_WIDTH - 5 + groupOffset + 3 : -10000,
      }}
    />
  );
});
