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

import { Button, LinkButton, useThemeColors } from '@apitable/components';
import {
  CollaCommandName, ExecuteResult, Field, FieldType, ILinkField, ILinkIds, IReduxState, ISegment, IViewRow, SegmentType, Selectors, StoreActions,
  Strings, t, TextBaseField,
} from '@apitable/core';
import { Align, FixedSizeList } from 'react-window';
import { useDebounce, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import { isEqual } from 'lodash';
import { Loading, Tooltip } from 'pc/components/common';
import { TComponent } from 'pc/components/common/t_component';
import { expandRecordInCenter } from 'pc/components/expand_record';
import { expandPreviewModalClose } from 'pc/components/preview_file';
import { useDispatch, useGetViewByIdWithDefault } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import * as React from 'react';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import IconAdd from 'static/icon/common/common_icon_add_content.svg';
import ImageNoRecord from 'static/icon/datasheet/datasheet_img_modal_norecord.png';
import { RecordList } from './record_list';
import style from './style.module.less';

interface ISearchContentProps {
  field: ILinkField;
  searchValue: string;
  cellValue: ILinkIds;
  onlyShowSelected: boolean;
  focusIndex: number;
  onChange: (value: string[] | null) => void;
  datasheetId: string;
}

const SearchContentBase: React.ForwardRefRenderFunction<{ getFilteredRows(): { [key: string]: string }[] }, ISearchContentProps> = (props, ref) => {
  const { field, searchValue: _searchValue, onlyShowSelected, cellValue, onChange, focusIndex, datasheetId } = props;
  const foreignDatasheetId = field.property.foreignDatasheetId;
  const colors = useThemeColors();
  const { foreignDatasheet, foreignDatasheetErrorCode } = useSelector((state: IReduxState) => {
    return {
      foreignDatasheet: Selectors.getDatasheet(state, foreignDatasheetId)!,
      foreignDatasheetErrorCode: Selectors.getDatasheetErrorCode(state, foreignDatasheetId),
    };
  });
  const { readable: foreignDatasheetReadable, editable: foreignDatasheetEditable } = useSelector(state => {
    return Selectors.getPermissions(state, foreignDatasheetId);
  });
  const { formId, mirrorId, datasheetId: urlDsId } = useSelector(state => state.pageParams);
  
  const foreignView = useGetViewByIdWithDefault(field.property.foreignDatasheetId, field.property.limitToView) as any;
  const hasLimitToView = Boolean(field.property.limitToView && foreignView?.id === field.property.limitToView);
  const { recordMap, meta } = foreignDatasheet.snapshot;
  const fieldMap = meta.fieldMap;
  const recordListRef = useRef<FixedSizeList>(null);
  const dispatch = useDispatch();
  const searchValue = useDebounce(_searchValue, { wait: 300 });
  const [filteredRecordIdMap, setFilteredRecordIdMap] = useState<{ [key: string]: string }>({});
  const [selectedRecordIds, setSelectedRecordIds] = useState<IViewRow[]>([]);
  const [searchedFlag, setSearchedFlag] = useState(false);

  const foreignDataMap = useMemo(() => {
    if (hasLimitToView && !foreignDatasheet.isPartOfData) {
      return {
        foreignRows: Selectors.getVisibleRowsBase(store.getState(), foreignDatasheet.snapshot, foreignView),
        foreignColumns: Selectors.getVisibleColumnsBase(foreignView),
      };
    }
   
    let foreignRows = foreignDatasheet.snapshot.meta.views[0].rows;
    if (formId) {
      foreignRows = foreignRows.filter((item) => !item.recordId.endsWith('_temp'));
    }
    return {
      foreignRows,
      foreignColumns: Selectors.getVisibleColumns(store.getState(), foreignDatasheet.id)
    };
  }, [hasLimitToView, foreignDatasheet, store, foreignView, formId]);

  const { foreignRows, foreignColumns } = foreignDataMap;

  const saveValue = useCallback((recordId: string) => {
    let value: string[] = [];

    if (field.property.limitSingleRecord) {
      value = [recordId];
      onChange(value);
      return;
    }

    if (cellValue && cellValue.includes(recordId)) {
      value = cellValue.filter(id => id !== recordId);
    } else {
      value = cellValue ? cellValue.concat([recordId]) : [recordId];
    }
    onChange(value.length ? value : null);
  }, [cellValue, onChange, field]);

  const addNewRecord = () => {
    let newCellValue: ISegment[] | undefined;
    const foreignPrimaryField = fieldMap[foreignColumns[0].fieldId];
    if (!foreignPrimaryField) {
      return;
    }

    if (Field.bindModel(foreignPrimaryField) instanceof TextBaseField && searchValue) {
      newCellValue = [{ type: SegmentType.Text, text: searchValue }];
    }

    const ret = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      datasheetId: foreignDatasheet.id,
      viewId: hasLimitToView ? foreignView.id : '',
      index: foreignRows.length,
      count: 1,
      cellValues: newCellValue ? [{ [foreignPrimaryField.id]: newCellValue }] : undefined,
    });

    if (ExecuteResult.Success === ret.result) {
      const recordId = ret.data && ret.data[0];
      saveValue(recordId);

      if (newCellValue == null) {
        expandPreviewModalClose();
        expandRecordInCenter({
          activeRecordId: recordId,
          recordIds: [recordId],
          viewId: hasLimitToView ? foreignView.id : undefined,
          datasheetId: foreignDatasheet.id,
          onClose: () => { recordListRef.current && recordListRef.current.scrollToItem(foreignRows.length); },
        });
      } else {
        recordListRef.current && recordListRef.current.scrollToItem(0);
      }
    }
  };

  useEffect(() => {
    const onlyRecordIdMap = {};
    Object.keys(recordMap).forEach(recordId => {
      onlyRecordIdMap[recordId] = recordId;
    });
    if (!isEqual(onlyRecordIdMap, filteredRecordIdMap)) {
      setFilteredRecordIdMap(onlyRecordIdMap);
    }
  }, [filteredRecordIdMap, recordMap]);

  useEffect(() => {
    if (cellValue?.length) {
      const currentSelectedRecordIds: IViewRow[] = cellValue.map(recordId => ({ recordId }));
      return setSelectedRecordIds(currentSelectedRecordIds);
    }
    return setSelectedRecordIds([]);
  }, [cellValue]);

  /**
   * Complete foreignRows for interactions compatible with the specified view switch.
   * Table A associated with Table B
   * Table B has View 1 and View 2
   * A A table originally associated a record in view 1 with a record that does not exist in view 2
   * This changes the specified view to View 2
   * The data source for view 2 does not have a selected record, but it needs to be displayed to the user in the UI interaction
   */
  const entityForeignRows = useMemo(() => {
    const foreignRowMap: { [recordId: string]: string } = {};
    const restForeignRows: IViewRow[] = [];
    foreignRows.map(({ recordId }) => foreignRowMap[recordId] = recordId);
    selectedRecordIds.forEach(({ recordId }) => {
      if (!foreignRowMap[recordId]) {
        restForeignRows.push({ recordId });
      }
    });
    return [...foreignRows, ...restForeignRows];
  }, [foreignRows, selectedRecordIds]);

  /**
   * Extracts the results of the calculation of the logic related to "see selected records only" for caching
   * First cache the cellValue in the mapping table, then iterate through the foreignRows to find the order
   */
  const onlyShowRows = useMemo(() => {
    if (onlyShowSelected) {
      return selectedRecordIds;
    }
    return null;
  }, [onlyShowSelected, selectedRecordIds]);

  useUpdateEffect(() => setSearchedFlag(true), [_searchValue]);

  // First construct a search array and convert all cell values to string for temporary use by the search engine.
  // Currently only changes in the number of rows in the associated table, 
  // the dstId and whether or not to "see only selected records" will cause the search set to be reconstructed.
  const searchSource = useMemo(() => {
    let rows: IViewRow[] = entityForeignRows;

    // has not been searched, the search data source is not loaded.
    // Prevent stalling from opening the search box of a linked table in case of large data in the linked table
    if (!searchedFlag) {
      return null;
    }
    if (onlyShowRows) {
      rows = onlyShowRows;
    }
    return rows.filter(row => {
      return Boolean(filteredRecordIdMap[row.recordId]);
    }).map(row => {
      const recordId = row.recordId;
      const result: {
        recordId: string, content: { [fieldId: string]: string | null },
      } = { recordId: recordId, content: {}};
      // Search set construction for visible columns only
      foreignColumns.slice(0, 6).forEach(column => {
        const field = fieldMap[column.fieldId];

        // Filtering of attachment fields
        if (!field || field.type === FieldType.Attachment) {
          return;
        }
        const state = store.getState();
        const foreignDatasheet = Selectors.getDatasheet(state, foreignDatasheetId)!;
        const cellValue = Selectors.getCellValue(state, foreignDatasheet.snapshot, recordId, field.id);
        result.content[field.id] = Field.bindModel(field).cellValueToString(cellValue);
      });
      return result;
    });
  }, [entityForeignRows, foreignColumns, filteredRecordIdMap, fieldMap, foreignDatasheetId, onlyShowRows, searchedFlag, store]);

  const fuse = useMemo(() => {
    // If no search has been done, then no search set is constructed
    if (searchSource == null) {
      return null;
    }
    // Readable permissions on related tables and above are required to support queries on data other than the first column
    const searchKeys = (formId || foreignDatasheetReadable) ?
      foreignColumns.slice(1).map(column => ({ name: 'content.' + column.fieldId, weight: 1 })) : [];
    // Give higher weights to the first column, the main field
    const fuse = new Fuse(searchSource, {
      keys: [{ name: 'content.' + foreignColumns[0].fieldId, weight: 2 }, ...searchKeys],
      /**
       * Only 0.1 for include mode, all others are split (0 for exact match, 1 for fuzzy search)
       * Follow the scoring theory, refer to: https://fusejs.io/concepts/scoring-theory.html
       */
      threshold: 0,
      // Ignore the position in the string where the match appears, otherwise it is subject to scoring theory
      // When ignoreLocation is true, the exact match will also change to include mode
      ignoreLocation: true,
      // No advanced mode on for now, waiting for product confirmation later
      // useExtendedSearch: true,
    });
    return fuse;
  }, [foreignColumns, searchSource, foreignDatasheetReadable, formId]);

  const rows = useMemo(() => {
    let rows: IViewRow[] = entityForeignRows;
    if (onlyShowRows) {
      rows = onlyShowRows;
    }

    // Theoretically fuse will not be null, but here is a compatibility
    if (!searchValue || fuse == null) {
      return rows;
    }

    return fuse.search(searchValue).map(result => {
      return { recordId: (result as any).item.recordId }; // FIXME:TYPE
    });

    // If the records of the associated table are not added or subtracted, the query results are only updated when the searchValue changes
    // eslint-disable-next-line
  }, [entityForeignRows, searchValue, onlyShowSelected, filteredRecordIdMap]);

  useImperativeHandle(ref, () => ({
    getFilteredRows(): { recordId: string }[] {
      return rows;
    },
    scrollToItem: (index: number, align?: Align) => {
      recordListRef.current && recordListRef.current.scrollToItem(index, align);
    },
    saveValue: (recordId: string) => saveValue(recordId),
  }));

  useEffect(() => {
    // When adding an associated record, load all the records of the associated table for searching
    if (foreignDatasheet.isPartOfData && !foreignDatasheetErrorCode) {
      if (formId) {
        dispatch(StoreActions.fetchForeignDatasheet(formId, foreignDatasheet.id) as any);
        return;
      }
      if (mirrorId && (!datasheetId || datasheetId === urlDsId)) {
        dispatch(StoreActions.fetchForeignDatasheet(mirrorId, foreignDatasheet.id) as any);
        return;
      }

      datasheetId && dispatch(StoreActions.fetchForeignDatasheet(datasheetId, foreignDatasheet.id) as any);
    }
    // eslint-disable-next-line
  }, [foreignDatasheet.isPartOfData, foreignDatasheet.id, dispatch, formId, mirrorId, datasheetId]);

  return (
    <>
      <div className={style.cardMiddle}>
        {foreignDatasheet.isPartOfData && !foreignDatasheetErrorCode ? <Loading className={style.loading} /> :
          rows.length ?
            <RecordList
              ref={recordListRef}
              datasheetId={foreignDatasheet.id}
              rows={rows}
              view={foreignView}
              focusIndex={focusIndex}
              selectedRecordIds={cellValue}
              onClick={saveValue}
              foreignDatasheetReadable={foreignDatasheetReadable}
            /> :
            <div className={style.empty}>
              {onlyShowSelected ?
                <>
                  <img height={151} src={ImageNoRecord.src} alt="no record" />
                  <div className={style.text}>{t(Strings.no_selected_record)}</div>
                </> :
                <>
                  <div className={style.text}>{
                    <TComponent
                      tkey={t(Strings.not_found_record_contains_value)}
                      params={{
                        searchValueSpan: <span className={style.searchValue}>{searchValue}</span>,
                      }}
                    />
                  }</div>
                  {
                    foreignDatasheetEditable && !formId &&
                    <Button
                      className={classNames(style.addRecordBtn, 'textButton')}
                      onClick={addNewRecord}
                      color="primary"
                      prefixIcon={<IconAdd fill={colors.black[50]} width="14px" height="14px" />}
                    >
                      {<TComponent
                        tkey={t(Strings.add_new_record_by_name)}
                        params={{
                          span: searchValue && <span className={style.searchValue}>{searchValue}</span>,
                        }}
                      />}
                    </Button>
                  }
                </>
              }
            </div>
        }
      </div>
      <Tooltip
        title={foreignDatasheetEditable ? '' : t(Strings.no_permission_to_edit_datasheet)}
        trigger="hover"
      >
        <div className={classNames(style.addRecord)}>
          <LinkButton
            component="button"
            underline={false}
            onClick={addNewRecord}
            color={colors.fc2}
            prefixIcon={<IconAdd fill="currentColor" />}
            disabled={!foreignDatasheetEditable}
            block
          >
            {
              <TComponent
                tkey={t(Strings.add_new_record_by_name)}
                params={{
                  span: searchValue && <span className={style.searchValue}>{searchValue}</span>,
                }}
              />
            }
          </LinkButton>
        </div>
      </Tooltip>
    </>
  );
};

export const SearchContent = memo(forwardRef(SearchContentBase));
