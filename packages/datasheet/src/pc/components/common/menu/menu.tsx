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

import {
  CollaCommandName, ExecuteResult, FieldType, ICellValue,
  ICollaCommandExecuteResult, ISegment,
  IViewColumn, Selectors, Strings, t,
} from '@apitable/core';
import path from 'path-browserify';
import { ContextmenuItem, Message } from 'pc/components/common';
import { Divider } from 'pc/components/common/divider';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { copy2clipBoard } from 'pc/utils';
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useThemeColors } from '@apitable/components';

import {
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ColumnUrlOutlined,
  CopyOutlined,
  ExpandRecordOutlined,
} from '@apitable/icons';

import { notifyWithUndo } from '../notify';
import { NotifyKey } from '../notify/notify.interface';
import styles from './style.module.less';

interface IMenuContextState {
  x: number;
  y: number;
  recordId?: string;
  onAddRecord?(index: number): ICollaCommandExecuteResult<{}>;
}

interface IMenuContext {
  contextState: IMenuContextState;
  setContextState: React.Dispatch<any>;
  insertDirection: 'horizontal' | 'vertical';
}

const menuContextInit = { x: 0, y: 0 };

export const MenuContext = React.createContext<IMenuContext>({
  contextState: menuContextInit,
  setContextState: () => { return; },
  insertDirection: 'horizontal',
});

export const Menu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { contextState, setContextState, insertDirection } = useContext(MenuContext);
  const colors = useThemeColors();
  const { recordId, x, y, onAddRecord } = contextState;
  const view = useSelector(state => Selectors.getCurrentView(state))!;
  const snapshot = useSelector(state => Selectors.getSnapshot(state))!;
  const fieldMap = snapshot.meta.fieldMap;
  const thisRecordIndex = view.rows.findIndex(item => item.recordId === recordId);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    if (!recordId) return;
    setContextState(menuContextInit);
  }, [recordId, setContextState]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { clientHeight, clientWidth } = containerRef.current;
    const isOverHeight = clientHeight + y > window.innerHeight;
    const isOverWidth = clientWidth + x > window.innerWidth;
    setPosition({
      x: isOverWidth ? (x - clientWidth) : x,
      y: isOverHeight ? (y - clientHeight) : y,
    });
  }, [x, y]);

  useEffect(() => {
    document.addEventListener('wheel', closeMenu);
    document.addEventListener('click', closeMenu);
    return () => {
      document.removeEventListener('wheel', closeMenu);
      document.removeEventListener('click', closeMenu);
    };
  }, [closeMenu]);

  if (!recordId) return null;

  const addRecord = (index: number) => {
    const result = onAddRecord ? onAddRecord(index) : resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index,
      cellValues: [{}],
    });
    if (ExecuteResult.Success === result.result) {
      result.data && expandRecordIdNavigate(result.data[0]);
    }
  };

  function copyLink() {
    const url = new URL(window.location.href);
    url.pathname = path.join(url.pathname, recordId!);

    copy2clipBoard(url.toString(), () => {
      Message.success({ content: t(Strings.link_copy_success) });
    });
  }

  const copyRecord = (recordIndex: number) => {
    const cellCollection = (view.columns as IViewColumn[]).reduce((total, cur, index) => {
      let value = Selectors.getCellValue(store.getState(), snapshot!, recordId, cur.fieldId);
      const fieldType = fieldMap[cur.fieldId].type;
      if (fieldType === FieldType.Text && index === 0 && value) {
        value = [...value] as ISegment[];
      }
      total[cur.fieldId] = value;
      return total;
    }, {} as { [fieldId: string]: ICellValue });
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index: recordIndex,
      cellValues: cellCollection ? [cellCollection] : undefined,
    });
  };

  const expand = () => {
    expandRecordIdNavigate(recordId);
  };

  const deleteRecord = () => {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.DeleteRecords,
      data: [recordId],
    });
    if (
      ExecuteResult.Success === result.result
    ) {
      notifyWithUndo(
        t(Strings.notification_delete_record_by_count, {
          count: 1,
        }),
        NotifyKey.DeleteRecord,
      );
    }

  };

  const IconInsertBefore = insertDirection === 'horizontal' ? ArrowLeftOutlined : ArrowUpOutlined;
  const TextInsertBefore = insertDirection === 'horizontal' ?
    t(Strings.gallery_view_insert_left) : t(Strings.kanban_insert_record_above);
  const IconInsertAfter = insertDirection === 'horizontal' ? ArrowRightOutlined : ArrowDownOutlined;
  const TextInsertAfter = insertDirection === 'horizontal' ?
    t(Strings.gallery_view_insert_right) : t(Strings.kanban_insert_record_below);

  return (
    <div
      className={styles.contextMenuWrapper}
      ref={containerRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
      }}
    >
      {
        <>
          <div onClick={() => addRecord(thisRecordIndex)}>
            <ContextmenuItem
              icon={<IconInsertBefore color={colors.thirdLevelText} />}
              name={TextInsertBefore}
            />
          </div>
          <div onClick={() => addRecord(thisRecordIndex + 1)}>
            <ContextmenuItem
              icon={<IconInsertAfter color={colors.thirdLevelText} />}
              name={TextInsertAfter}
            />
          </div>
        </>
      }
      <Divider marginTop={4} marginBottom={4} className={styles.divider} />
      <div onClick={() => copyLink()}>
        <ContextmenuItem
          icon={<ColumnUrlOutlined color={colors.thirdLevelText} />}
          name={t(Strings.copy_card_link)}
        />
      </div>
      <div onClick={() => copyRecord(thisRecordIndex + 1)}>
        <ContextmenuItem
          icon={<CopyOutlined color={colors.thirdLevelText} />}
          name={t(Strings.gallery_view_copy_record)}
        />
      </div>
      <div onClick={expand}>
        <ContextmenuItem
          icon={<ExpandRecordOutlined color={colors.thirdLevelText} />}
          name={t(Strings.gallery_view_expand_record)}
        />
      </div>
      <Divider marginTop={4} marginBottom={4} className={styles.divider} />
      <div onClick={deleteRecord}>
        <ContextmenuItem
          icon={<DeleteOutlined color={colors.thirdLevelText} />}
          name={t(Strings.gallery_view_delete_record)}
        />
      </div>
    </div >
  );
};
