import { useDebounce, useUpdateEffect } from 'ahooks';
import Fuse from 'fuse.js';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Align, FixedSizeList } from 'react-window';
import { Field, FieldType, IFieldMap, IViewColumn, IViewRow, Selectors, Strings, t } from '@apitable/core';
import { TComponent } from 'pc/components/common/t_component';
import { store } from 'pc/store';
import { RecordList } from './record_list';
import styles from './style.module.less';

interface ISearchContentProps {
  searchValue: string;
  focusIndex: number;
  rows: IViewRow[];
  columns: IViewColumn[];
  fieldMap: IFieldMap;
  datasheetId: string;
  selectedRecordIds: string[];
  onChange: (recordIds: string[]) => void;
  isSingle?: boolean;
}

const SearchContentBase: React.ForwardRefRenderFunction<{ getFilteredRows(): IViewRow[] }, ISearchContentProps> = (props, ref) => {
  const { focusIndex, rows, columns, fieldMap, datasheetId, isSingle, selectedRecordIds, searchValue: _searchValue, onChange } = props;
  const recordListRef = useRef<FixedSizeList>(null);
  const searchValue = useDebounce(_searchValue, { wait: 300 });
  const [searchedFlag, setSearchedFlag] = useState(false);

  const saveValue = useCallback(
    (recordId: string) => {
      let finalValue;
      if (selectedRecordIds.includes(recordId)) {
        finalValue = selectedRecordIds.filter((v) => v !== recordId);
      } else {
        finalValue = isSingle ? [recordId] : [...selectedRecordIds, recordId];
      }
      onChange(finalValue);
    },
    [isSingle, selectedRecordIds, onChange],
  );

  useUpdateEffect(() => setSearchedFlag(true), [_searchValue]);

  const searchSource = useMemo(() => {
    if (!searchedFlag) {
      return null;
    }
    return rows.map((row) => {
      const recordId = row.recordId;
      const result: {
        recordId: string;
        content: { [fieldId: string]: string | null };
      } = {
        recordId,
        content: {},
      };
      // Search set construction for visible columns only
      columns.slice(0, 6).forEach((column) => {
        const fieldId = column.fieldId;
        const field = fieldMap[fieldId];
        if (field.type === FieldType.Attachment) {
          return;
        }
        const state = store.getState();
        const snapshot = Selectors.getSnapshot(state, datasheetId)!;
        const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
        result.content[field.id] = Field.bindModel(field).cellValueToString(cellValue);
      });
      return result;
    });
  }, [columns, datasheetId, fieldMap, rows, searchedFlag]);

  const fuse = useMemo(() => {
    if (searchSource == null) {
      return null;
    }
    const searchKeys = columns.slice(1).map((column) => ({
      name: 'content.' + column.fieldId,
      weight: 1,
    }));
    // Give higher weights to the first column, the main field
    const frozenColumnId = columns[0].fieldId;
    const fuse = new Fuse(searchSource, {
      keys: [{ name: 'content.' + frozenColumnId, weight: 2 }, ...searchKeys],
      /**
       * Only 0.1 for include mode, all others are split (0 for exact match, 1 for fuzzy search)
       * Follow the scoring theory, refer to: https://fusejs.io/concepts/scoring-theory.html
       */
      threshold: 0,
      // No advanced mode on for now, waiting for product confirmation later
      // useExtendedSearch: true,
      ignoreLocation: true,
    });
    return fuse;
  }, [columns, searchSource]);

  const visibleRows = useMemo(() => {
    if (!searchValue || fuse == null) {
      return rows;
    }
    return fuse.search(searchValue).map((result) => ({ recordId: result.item.recordId }));
  }, [searchValue, fuse, rows]);

  useImperativeHandle(ref, () => ({
    getFilteredRows(): IViewRow[] {
      return visibleRows;
    },
    scrollToItem: (index: number, align?: Align) => {
      recordListRef.current && recordListRef.current.scrollToItem(index, align);
    },
    saveValue: (recordId: string) => saveValue(recordId),
  }));

  return (
    <div className={styles.searchContentWrapper}>
      {visibleRows.length ? (
        <RecordList
          ref={recordListRef}
          datasheetId={datasheetId}
          rows={visibleRows}
          columns={columns}
          fieldMap={fieldMap}
          focusIndex={focusIndex}
          selectedRecordIds={selectedRecordIds}
          onClick={saveValue}
        />
      ) : (
        <div className={styles.searchEmpty}>
          <div className={styles.searchEmptyText}>
            <TComponent
              tkey={t(Strings.not_found_record_contains_value)}
              params={{
                searchValueSpan: searchValue,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchContent = memo(forwardRef(SearchContentBase));
