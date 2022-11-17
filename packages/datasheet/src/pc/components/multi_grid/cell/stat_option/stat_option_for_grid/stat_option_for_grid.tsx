import { GridChildComponentProps } from 'react-window';
import { PropsWithChildren } from 'react';
import * as React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { IGridViewProperty, Selectors } from '@apitable/core';
import { StatOption } from '../stat_option';
import styles from '../styles.module.less';

type StatOptionForGridBaseProps = GridChildComponentProps & { rightRegion: boolean };

const StatOptionForGridBase: React.FC<StatOptionForGridBaseProps> = ({
  columnIndex, style, rightRegion,
}) => {
  const fieldId = useSelector(state => {
    const frozenColumnCount = (Selectors.getCurrentView(state) as IGridViewProperty).frozenColumnCount;
    const columns = Selectors.getVisibleColumns(state);
    const curColumnIndex = rightRegion ? columnIndex + frozenColumnCount : columnIndex;
    const col = columns[curColumnIndex];
    if (!col) return '';
    return col.fieldId;
  }, shallowEqual);

  if (!fieldId) return null;

  return <StatOption className={styles.gridBottom} fieldId={fieldId} style={style} />;
};

const StatOptionForGridLeftBase = (props: PropsWithChildren<GridChildComponentProps>) => {
  return (
    <StatOptionForGridBase {...props} rightRegion={false} />
  );
};

const StatOptionForGridRightBase = (props: PropsWithChildren<GridChildComponentProps>) => {
  return (
    <StatOptionForGridBase {...props} rightRegion />
  );
};

export const StatOptionForGridLeft = React.memo(StatOptionForGridLeftBase);
export const StatOptionForGridRight = React.memo(StatOptionForGridRightBase);
