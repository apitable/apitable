import { DATASHEET_ID, Selectors, StoreActions } from '@apitable/core';
import { store } from 'pc/store';
import { CELL_CLASS, GHOST_RECORD_ID, FIELD_DOT, FIELD_HEAD_CLASS, getElementDataset, getParentNodeByClass, OPERATE_HEAD_CLASS } from 'pc/utils';
import { stopPropagation } from 'pc/utils/dom';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldMenu } from './field_menu';
import { GRID_RECORD_MENU, RecordMenu } from './record_menu';
import { useContextMenu } from '@vikadata/components';
import { isIPad13 } from 'react-device-detect';
import { expandRecordIdNavigate } from 'pc/components/expand_record';

type IdMap = {
  recordId?: string | null;
  fieldId?: string | null;
};

interface IContextFieldOwnProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getIdMapByEvent?: (e: MouseEvent) => IdMap; // 提供允许调用者传入 recordId 和 fieldId 的能力
  editFieldSetting?: (fieldId: string) => void;
  editFieldDesc?: (fieldId: string) => void;
  onFrozenColumn?: (fieldId: string) => void;
}

export const ContextMenuBase: React.FC<IContextFieldOwnProps> = props => {
  const { getIdMapByEvent, parentRef, editFieldSetting, editFieldDesc, onFrozenColumn } = props;
  const [fieldIdForMenu, setFieldIdForMenu] = useState('');
  const dispatch = useDispatch();
  const datasheetId = useSelector(Selectors.getActiveDatasheetId)!;
  const recordRanges = useSelector(state => Selectors.getSelectionRecordRanges(state));

  const { show: showField, hideAll } = useContextMenu({ id: DATASHEET_ID.FIELD_CONTEXT });
  const { show: showGrid } = useContextMenu({ id: GRID_RECORD_MENU });

  const _getIdMapByEvent = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    const fieldElement = e.type === 'click' ? getParentNodeByClass(element, FIELD_DOT) : getParentNodeByClass(element, FIELD_HEAD_CLASS);
    const recordElement = e.type !== 'click' ? getParentNodeByClass(element, [CELL_CLASS, OPERATE_HEAD_CLASS]) : null;
    const fieldId = getElementDataset(fieldElement, 'fieldId');
    const recordId = getElementDataset(recordElement, 'recordId');

    if (recordId && recordId !== GHOST_RECORD_ID) {
      getParentNodeByClass(element, OPERATE_HEAD_CLASS) && setActiveCell(recordId);
    }

    return {
      fieldId,
      recordId,
    };
  };

  const showContextMenu = (e) => {
    e.preventDefault();
    const { recordId, fieldId } = getIdMapByEvent ? getIdMapByEvent(e) : _getIdMapByEvent(e);
    if (!recordId && !fieldId) {
      hideAll();
      return;
    }

    dispatch(StoreActions.clearActiveFieldState(datasheetId));

    if (fieldId) {
      showField(e, {
        id: DATASHEET_ID.FIELD_CONTEXT,
        props: {
          fieldId,
        },
      });
      setFieldIdForMenu(fieldId);
    }

    if (recordId) {
      if (
        recordId === GHOST_RECORD_ID
        && recordRanges == null
      ) {
        return;
      }
      
      showGrid(e, {
        id: GRID_RECORD_MENU,
        props: {
          recordId,
        },
      });
    }
  };

  function setActiveCell(recordId: string) {
    const state = store.getState();
    const visibleColumns = Selectors.getVisibleColumns(state);
    const isSideRecordOpen = state.space.isSideRecordOpen;
    store.dispatch(StoreActions.setActiveCell(datasheetId, {
      recordId: recordId!,
      fieldId: visibleColumns[0].fieldId,
    }));
    if (isSideRecordOpen) {
      expandRecordIdNavigate(recordId);
    }
  }

  useEffect(() => {
    const element = parentRef?.current;
    if (!element) return;
    element.addEventListener('contextmenu', showContextMenu);
    element.addEventListener('click', showContextMenu);
    return () => {
      element.removeEventListener('contextmenu', showContextMenu);
      element.removeEventListener('click', showContextMenu);
    };
  });

  // 兼容 iPad 无法触发 click 事件的问题
  useEffect(() => {
    if (!isIPad13) return;
    const element = parentRef!.current;
    if (!element) return;
    element.addEventListener('touchend', showContextMenu);
    return () => {
      element.removeEventListener('touchend', showContextMenu);
    };
  });

  return (
    <div
      onMouseDown={stopPropagation}
      onWheel={stopPropagation}
      onContextMenu={e => e.preventDefault()}
    >
      <FieldMenu
        fieldId={fieldIdForMenu}
        editFieldSetting={editFieldSetting}
        editFieldDesc={editFieldDesc}
        onFrozenColumn={onFrozenColumn}
      />
      <RecordMenu />
    </div>
  );
};

export const ContextMenu = React.memo(ContextMenuBase);
