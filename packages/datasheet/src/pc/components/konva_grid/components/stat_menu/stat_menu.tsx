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
import { shallowEqual } from 'react-redux';
import { ContextMenu, useContextMenu } from '@apitable/components';
import { CollaCommandName, Field, getStatTypeList, KONVA_DATASHEET_ID, Selectors, StatType } from '@apitable/core';
import { getFieldStatType } from 'pc/components/multi_grid/cell/stat_option';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
// import styles from './style.module.less';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData, isTouchDevice } from 'pc/utils';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { MouseDownType } from '../../../multi_grid';

export interface IFieldBoundary {
  x: number;
  y: number;
  fieldId: string;
}

interface IStatMenuProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getBoundary: (e: MouseEvent) => IFieldBoundary | null;
}

export const StatMenu: React.FC<React.PropsWithChildren<IStatMenuProps>> = React.memo((props) => {
  const { getBoundary, parentRef } = props;
  const [fieldId, setFieldId] = useState<string>('');
  const { show } = useContextMenu({ id: KONVA_DATASHEET_ID.GRID_STAT_MENU });
  const { fieldMap, statType } = useAppSelector((state) => {
    const datasheetId = state.pageParams.datasheetId!;
    const statType = getFieldStatType(state, fieldId);

    return {
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      statType,
    };
  }, shallowEqual);
  const view = useAppSelector(Selectors.getCurrentView)!;
  const state = store.getState();
  const field = fieldMap[fieldId];
  const fieldStatTypeList = field && getStatTypeList(field, state);

  function commandForStat(newStatType: StatType) {
    if (!statType && newStatType === StatType.None) return;
    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetColumnsProperty,
          viewId: view.id,
          fieldId: field.id,
          data: {
            statType: newStatType,
          },
        });
      },
      {
        columns: Selectors.getVisibleColumns(state).map((column) => (column.fieldId === field.id ? { ...column, statType: newStatType } : column)),
      },
    );
  }

  const showContextMenu = (e: any) => {
    if (e.button === MouseDownType.Right) return;
    const fieldBoundary = getBoundary(e);
    if (!fieldBoundary) return;
    const { x, y, fieldId } = fieldBoundary;
    show(e as any, {
      id: KONVA_DATASHEET_ID.GRID_STAT_MENU,
      position: {
        x,
        y,
      },
    });
    setFieldId(fieldId);
  };

  useEffect(() => {
    const element = parentRef?.current;
    if (!element) return;
    element.addEventListener('click', showContextMenu);
    return () => {
      element.removeEventListener('click', showContextMenu);
    };
  });

  // Compatible with touch device not triggering click event issue
  useEffect(() => {
    if (!isTouchDevice()) return;
    const element = parentRef?.current;
    if (!element) return;
    element.addEventListener('touchend', showContextMenu);
    return () => {
      element.removeEventListener('touchend', showContextMenu);
    };
  });

  // IContextMenuData[]
  const data: any[] = [];
  const statData =
    fieldStatTypeList &&
    fieldStatTypeList.map((item: StatType | never) => {
      return {
        text: Field.bindModel(field).statType2text(item),
        onClick: () => commandForStat(item),
        icon: <></>,
        hidden: false,
        style: {
          height: 35,
          padding: 0,
          margin: 0,
          width: '100%',
          justifyContent: 'center',
          textAlign: 'center',
        },
      };
    });

  if (statData != null) {
    data.push(statData);
  }

  return (
    <ContextMenu
      // className={styles.statMenu}
      menuId={KONVA_DATASHEET_ID.GRID_STAT_MENU}
      overlay={flatContextData(data, true)}
      width={150}
      // style={{
      //   width: 150,
      //   minWidth: 150,
      //   textAlign: 'center',
      //   padding: 0
      // }}
    />
  );
});
