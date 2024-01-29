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

import { useEffect, useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useContextMenu } from '@apitable/components';
import { DATASHEET_ID, Selectors, StoreActions } from '@apitable/core';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import {
  CELL_CLASS,
  GHOST_RECORD_ID,
  FIELD_DOT,
  FIELD_HEAD_CLASS,
  getElementDataset,
  getParentNodeByClass,
  OPERATE_HEAD_CLASS,
  isTouchDevice,
} from 'pc/utils';
import { stopPropagation } from 'pc/utils/dom';
import { FieldMenu } from './field_menu';
import { GRID_RECORD_MENU, RecordMenu } from './record_menu';

type IdMap = {
  recordId?: string | null;
  fieldId?: string | null;
};

interface IContextFieldOwnProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getIdMapByEvent?: (e: MouseEvent) => IdMap; // Provides the ability to allow the caller to pass in recordId and fieldId
  editFieldSetting?: (fieldId: string) => void;
  editFieldDesc?: (fieldId: string) => void;
  onFrozenColumn?: (fieldId: string, reset: boolean) => void;
}

export const ContextMenuBase: React.FC<React.PropsWithChildren<IContextFieldOwnProps>> = (props) => {
  const { getIdMapByEvent, parentRef, editFieldSetting, editFieldDesc, onFrozenColumn } = props;
  const [fieldIdForMenu, setFieldIdForMenu] = useState('');
  const dispatch = useDispatch();
  const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
  const recordRanges = useAppSelector((state) => Selectors.getSelectionRecordRanges(state));

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

  const showContextMenu = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const { recordId, fieldId } = getIdMapByEvent ? getIdMapByEvent(e as MouseEvent) : _getIdMapByEvent(e as MouseEvent);
    if (!recordId && !fieldId) {
      hideAll();
      return;
    }

    dispatch(StoreActions.clearActiveFieldState(datasheetId));

    if (fieldId) {
      const event = (e.type === 'touchend' ? (e as TouchEvent).changedTouches?.[0] : e) || e;
      showField(event as any, {
        id: DATASHEET_ID.FIELD_CONTEXT,
        props: {
          fieldId,
        },
      });
      setFieldIdForMenu(fieldId);
    }

    if (recordId) {
      if (recordId === GHOST_RECORD_ID && recordRanges == null) {
        return;
      }

      showGrid(e as any, {
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
    store.dispatch(
      StoreActions.setActiveCell(datasheetId, {
        recordId: recordId!,
        fieldId: visibleColumns[0].fieldId,
      }),
    );
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

  // Compatible with touch device not triggering click event issue
  useEffect(() => {
    if (!isTouchDevice()) return;
    const element = parentRef!.current;
    if (!element) return;
    element.addEventListener('touchend', showContextMenu);
    return () => {
      element.removeEventListener('touchend', showContextMenu);
    };
  });

  return (
    <div onMouseDown={stopPropagation} onWheel={stopPropagation} onContextMenu={(e) => e.preventDefault()}>
      <FieldMenu fieldId={fieldIdForMenu} editFieldSetting={editFieldSetting} editFieldDesc={editFieldDesc} onFrozenColumn={onFrozenColumn} />
      <RecordMenu />
    </div>
  );
};

export const ContextMenu = React.memo(ContextMenuBase);
