import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual } from 'react-redux';
import { Align } from 'react-window';
import { stopPropagation, useTheme } from '@apitable/components';
import { IReduxState, IViewRow, Selectors, Strings, t } from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { KeyCode } from 'pc/utils';
import { SearchControl } from '../common/search_control';
import { TComponent } from '../common/t_component';
import { SearchContent } from './search_content';
import styles from './style.module.less';

export interface IRecordPickerProps {
  datasheetId: string;
  isSingle?: boolean;
  onSave?: (recordIds: string[]) => void;
  onClose?: () => void;
}

interface ISearchContentRefProps {
  saveValue: (recordId: string) => void;
  getFilteredRows: () => IViewRow[];
  scrollToItem: (index: number, align?: Align) => void;
}

export const RecordPicker: FC<React.PropsWithChildren<IRecordPickerProps>> = memo((props) => {
  const { datasheetId, onSave, onClose, children, isSingle } = props;

  const { datasheet, view, fieldMap } = useAppSelector(
    (state: IReduxState) => ({
      datasheet: Selectors.getDatasheet(state, datasheetId)!,
      view: Selectors.getViewByIdWithDefault(state, datasheetId)!,
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
    }),
    shallowEqual,
  );
  const { color } = useTheme();
  const editorRef = useRef(null);
  const searchContentRef = useRef<ISearchContentRefProps>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const { rows, columns } = view;

  const onClickPortalContainer = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    stopPropagation(e);
  };

  const onValueChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const onCancelClick = useCallback(() => {
    setSearchValue('');
  }, []);

  const saveValue = useCallback(
    (recordIds: string[]) => {
      setSelectedRecordIds(recordIds);
      onSave?.(recordIds);
      if (isSingle && recordIds.length) {
        onClose?.();
      }
    },
    [isSingle, onSave, onClose],
  );

  useEffect(() => {
    if (!searchValue) {
      setFocusIndex(-1);
    }
  }, [searchValue]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.Esc) {
      return;
    }
    stopPropagation(e);

    const filteredRows = searchContentRef.current?.getFilteredRows();
    if (searchValue && filteredRows) {
      const maxLength = filteredRows.length;
      switch (e.keyCode) {
        case KeyCode.Up:
          const prevIndex = focusIndex <= 0 ? maxLength - 1 : focusIndex - 1;
          setFocusIndex(prevIndex);
          searchContentRef.current?.scrollToItem(prevIndex, 'smart');
          return;
        case KeyCode.Down:
          const nextIndex = focusIndex >= maxLength - 1 ? 0 : focusIndex + 1;
          setFocusIndex(nextIndex);
          searchContentRef.current?.scrollToItem(nextIndex, 'smart');
          return;
        case KeyCode.Enter:
          const realFocusIndex = focusIndex === -1 ? 0 : focusIndex;
          const row = filteredRows[realFocusIndex];
          row && searchContentRef.current?.saveValue(row.recordId);
          return;
      }
    }
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if ([KeyCode.Up, KeyCode.Down].includes(e.keyCode)) {
      e.preventDefault();
    }
  };

  const PortalChild = (
    <div className={styles.portalContent} onKeyDown={onKeyDown}>
      <CloseOutlined className={styles.closeIcon} color={color.thirdLevelText} onClick={() => onClose?.()} />
      <h2 className={styles.portalTitleWrapper}>
        <span className={styles.portalTitle}>
          <TComponent
            tkey={t(Strings.function_current_sheet)}
            params={{
              datasheetName: datasheet.name,
            }}
          />
        </span>
      </h2>
      <SearchControl
        ref={editorRef}
        value={searchValue}
        placeholder={t(Strings.search)}
        onValueChange={onValueChange}
        onCancelClick={onCancelClick}
        onkeyDown={onSearchKeyDown}
        switchVisible={!isSingle}
      />
      <SearchContent
        ref={searchContentRef}
        rows={rows!}
        columns={columns!}
        fieldMap={fieldMap}
        datasheetId={datasheetId}
        searchValue={searchValue}
        focusIndex={focusIndex}
        selectedRecordIds={selectedRecordIds}
        onChange={saveValue}
        isSingle={isSingle}
      />
      {children}
    </div>
  );

  return ReactDOM.createPortal(
    <div
      className={styles.portalContainer}
      tabIndex={-1}
      onWheel={stopPropagation}
      onClick={onClickPortalContainer}
      onMouseDown={stopPropagation}
      onMouseMove={stopPropagation}
    >
      {PortalChild}
    </div>,
    document.body,
  );
});
