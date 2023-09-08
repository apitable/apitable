import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, Align } from 'react-window';
import { IFieldMap, IViewColumn, IViewRow } from '@apitable/core';
import { Row } from './row';
import styles from './style.module.less';

interface IRecordListProps {
  datasheetId: string;
  rows: IViewRow[];
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  focusIndex: number;
  selectable?: boolean;
  selectedRecordIds?: string[] | null;
  onClick?: (recordId: string) => void;
}

const RecordListBase: React.ForwardRefRenderFunction<{}, IRecordListProps> = (props, ref) => {
  const { datasheetId, rows, columns, fieldMap, selectedRecordIds, selectable = true, focusIndex, onClick } = props;
  const listRef = useRef<List>(null);

  const selectedSet = useMemo(() => new Set(selectedRecordIds), [selectedRecordIds]);

  useImperativeHandle(ref, () => ({
    scrollTo(scrollOffset: number) {
      listRef.current && listRef.current.scrollTo(scrollOffset);
    },
    scrollToItem(index: number, align?: Align) {
      listRef.current && listRef.current.scrollToItem(index, align);
    },
  }));

  const itemData = {
    datasheetId,
    rows,
    columns,
    fieldMap,
    focusIndex,
    selectable,
    selectedSet,
    onClick,
  };

  return (
    <div className={styles.recordListWrapper}>
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ height, width }) => {
          return (
            <List
              height={height}
              width={width}
              itemCount={rows.length}
              itemSize={98}
              ref={listRef}
              itemKey={(index: number) => rows[index].recordId}
              itemData={itemData}
            >
              {Row}
            </List>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export const RecordList = React.memo(forwardRef(RecordListBase));
