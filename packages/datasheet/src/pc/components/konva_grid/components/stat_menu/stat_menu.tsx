import { useEffect, useState } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { store } from 'pc/store';
import { resourceService } from 'pc/resource_service';
import { ContextMenu, useContextMenu } from '@vikadata/components';
import { CollaCommandName, Field, getStatTypeList, KONVA_DATASHEET_ID, Selectors, StatType } from '@vikadata/core';
import { getFieldStatType } from 'pc/components/multi_grid/cell/stat_option';
import { MouseDownType } from 'pc/components/selection_wrapper';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { isIPad13 } from 'react-device-detect';
// import styles from './style.module.less';
import { flatContextData } from 'pc/utils';

export interface IFieldBoundary {
  x: number;
  y: number;
  fieldId: string;
}

interface IStatMenuProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getBoundary: (e) => IFieldBoundary | null;
}

export const StatMenu: React.FC<IStatMenuProps> = React.memo((props) => {
  const { getBoundary, parentRef } = props;
  const [fieldId, setFieldId] = useState<string>('');
  const { show } = useContextMenu({ id: KONVA_DATASHEET_ID.GRID_STAT_MENU });
  const {
    fieldMap,
    statType,
  } = useSelector(state => {
    const datasheetId = state.pageParams.datasheetId!;
    const statType = getFieldStatType(state, fieldId);

    return {
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      statType,
    };
  }, shallowEqual);
  const view = useSelector(Selectors.getCurrentView)!;
  const state = store.getState();
  const field = fieldMap[fieldId];
  const fieldStatTypeList = field && getStatTypeList(field, state);

  function commandForStat(newStatType: StatType) {
    const commandManager = resourceService.instance!.commandManager;
    if (!statType && newStatType === StatType.None) return;
    executeCommandWithMirror(()=>{
      commandManager.execute({
        cmd: CollaCommandName.SetColumnsProperty,
        viewId: view.id,
        fieldId: field.id,
        data: {
          statType: newStatType,
        },
      });
    }, {
      columns: Selectors.getVisibleColumns(state).map(column => column.fieldId === field.id ? { ...column, statType: newStatType } : column)
    });

  }

  const showContextMenu = (e) => {
    if (e.button === MouseDownType.Right) return;
    const fieldBoundary = getBoundary(e);
    if (!fieldBoundary) return;
    const { x, y, fieldId } = fieldBoundary;
    show(e, {
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

  // 兼容 iPad 无法触发 click 事件的问题
  useEffect(() => {
    if (!isIPad13) return;
    const element = parentRef?.current;
    if (!element) return;
    element.addEventListener('touchend', showContextMenu);
    return () => {
      element.removeEventListener('touchend', showContextMenu);
    };
  });

  // IContextMenuData[]
  const data: any[] = [];
  const statData = fieldStatTypeList && fieldStatTypeList.map((item: StatType | never) => {
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
      }
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
