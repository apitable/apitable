/*
 * @doc https://www.notion.so/vikadata/50b41920a64f4bffaf55f7f9b4427985
 */
import {
  ConfigConstant, Field, FieldType, Group, IGroupInfo, ILinearRowGroupTab,
  ISelectFieldOption, LookUpField, Selectors, setComplement, StoreActions, Strings, t,
} from '@vikadata/core';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { GROUP_OFFSET } from 'pc/components/multi_grid/grid_views';
import { store } from 'pc/store';
import { useThemeColors } from '@vikadata/components';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import Trigger from 'rc-trigger';
import { useCallback, useMemo, useRef } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IconArrow from 'static/icon/common/common_icon_pulldown.svg';
import IconPullDown from 'static/icon/datasheet/rightclick/rightclick_icon_pulldown.svg';
import IconPullDownAll from 'static/icon/datasheet/rightclick/rightclick_icon_pulldown_all.svg';
import IconRetract from 'static/icon/datasheet/rightclick/rightclick_icon_retract.svg';
import IconRetractAll from 'static/icon/datasheet/rightclick/rightclick_icon_retract_all.svg';
import { StatOption } from '../../../stat_option';
import styles from '../../../styles.module.less';
import { GROUP_HEIGHT } from '../cell_group_tab';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { dispatch } from 'pc/worker/store';

interface IGroupTab {
  row: ILinearRowGroupTab;
  actualColumnIndex: number;
  groupInfo: IGroupInfo;
  // 是否按默认顺序排序
  isSort?: boolean;
}

export enum ExpandType {
  Pull = 'Pull', // 展开
  Retract = 'Retract', // 收起
  PullAll = 'PullAll',
  RetractAll = 'RetractAll',
}

const GroupTabBase: React.FC<IGroupTab> = props => {
  const { row, actualColumnIndex, groupInfo, isSort } = props;
  const fieldId = groupInfo[row.depth]?.fieldId;
  const pathKey = `${row.recordId}_${row.depth}`;
  const colors = useThemeColors();
  const {
    field,
    statTypeFieldId,
    viewId,
    datasheetId,
    groupingCollapseIds,
    isSearching,
    fieldPermissionMap,
  } = useSelector(state => {

    const columns = Selectors.getVisibleColumns(state);
    const statTypeFieldId = columns[actualColumnIndex].fieldId;
    return {
      statTypeFieldId,
      viewId: Selectors.getActiveView(state),
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      groupingCollapseIds: Selectors.getGroupingCollapseIds(state),
      field: Selectors.getSnapshot(state)!.meta.fieldMap[fieldId],
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
    };
  }, shallowEqual);
  const groupingCollapseIdsMap = new Map<string, boolean>(groupingCollapseIds?.map(v => [v, true]));
  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
  const isCryptoField = fieldRole === ConfigConstant.Role.None;
  const triggerRef = useRef<any>();

  const changeGroupCollapseState = useCallback((newState: string[]) => {
    // 表内查找时，屏蔽折叠分组操作
    if (isSearching) {
      return;
    }
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    // QuickAppend 组件显示依赖于 hoverRecordId, 分组折叠的情况下应该清空, 避免产生视觉误导
    dispatch(StoreActions.setHoverRecordId(datasheetId, null));
    setStorage(StorageName.GroupCollapse,
      { [`${datasheetId},${viewId}`]: newState },
    );
  }, [datasheetId, viewId, isSearching]);

  const state = store.getState();
  const groupSketch = useMemo(() => {
    return new Group(groupInfo, Selectors.getGroupBreakpoint(state));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(groupInfo)]);
  const allGroupTabIds: string[] = useMemo(() => {
    if (!groupInfo) return [];
    return Array.from(groupSketch.getAllGroupTabIdsByRecomputed(state).keys());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupSketch]);

  if (!groupInfo.length) {
    return <></>;
  }

  function clickExpandToggle(e: React.MouseEvent) {
    triggerRef && triggerRef.current!.close(e);
    if (groupingCollapseIdsMap.has(pathKey)) {
      groupingCollapseIdsMap.delete(pathKey);
    } else {
      groupingCollapseIdsMap.set(pathKey, true);
    }
    return changeGroupCollapseState(Array.from(groupingCollapseIdsMap.keys()));
  }

  function partOfToggle() {
    return (
      <div
        className={styles.icon}
        onClick={clickExpandToggle}
      >
        <IconArrow
          fill={colors.thirdLevelText}
          width={10}
          height={8}
          style={{
            transition: 'all 0.3s',
            transform: groupingCollapseIdsMap.has(pathKey) ?
              'rotate(-90deg)' : 'rotate(0)', marginRight: '8px',
          }}
        />
      </div>
    );
  }

  // 值按索引顺序排序
  function sortValueByOptionOrder(value: string[] | null, options: ISelectFieldOption[]) {
    if (!value) {
      return null;
    }
    const mapOptions: Map<string, number> = new Map();
    options.forEach((op, index) => {
      mapOptions.set(op.id, index);
    });
    return Array.from(value).sort((id1, id2) => {
      const idx1 = mapOptions.get(id1) as number;
      const idx2 = mapOptions.get(id2) as number;
      return idx1 - idx2;
    }) as string[];
  }

  function partOfCellValue() {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state)!;
    const recordId = row.recordId;
    const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
    const commonStyle: React.CSSProperties = {
      color: colors.thirdLevelText, flex: '1', whiteSpace: 'nowrap',
    };
    if (cellValue === undefined) {
      return <div style={commonStyle}>({t(Strings.data_error)})</div>;
    }
    if (cellValue === null) {
      return <div style={commonStyle}>({t(Strings.content_is_empty)})</div>;
    }
    let sortValue;
    // 按照索引顺序排序
    if (isSort) {
      // Tab 是“多选"并且 isSort 为 true
      if (field.type === FieldType.MultiSelect) {
        sortValue = sortValueByOptionOrder(cellValue, field.property.options);
      } else if (field.type === FieldType.LookUp) {
        // Tab 是“神奇引用”并且 isSort 为 true 且 realField 是单选或者多选
        const realField = (Field.bindModel(field) as LookUpField).getLookUpEntityField();
        if (realField && realField.property && Array.isArray(realField.property.options)) {
          sortValue = sortValueByOptionOrder(cellValue, realField.property.options);
        }
      }
    }
    return (
      <CellValue
        field={field}
        recordId={recordId}
        cellValue={sortValue || cellValue}
        datasheetId={datasheetId}
        className={styles.cellValuePart}
        isActive
        readonly
      />
    );
  }

  function findChildGroupTab() {
    const state = store.getState();
    const res = groupSketch.getChildBreakpointIds(state, row.recordId, row.depth).map(recordId => `${recordId}_${row.depth + 1}`);
    res.push(`${row.recordId}_${row.depth}`);
    return res;
  }

  function contextMenu() {
    const tabs = findChildGroupTab();

    function groupCommand(type: ExpandType, e: React.MouseEvent) {
      // 正在进行表内查找时，禁用分组相关操作。
      if (isSearching) {
        return triggerRef.current!.close(e);
      }
      if (type === ExpandType.Pull) {
        for (const tab of tabs) {
          groupingCollapseIdsMap.delete(tab);
        }
        changeGroupCollapseState(Array.from(groupingCollapseIdsMap.keys()));
      }

      if (type === ExpandType.Retract) {
        for (const tab of tabs) {
          groupingCollapseIdsMap.set(tab, true);
        }
        changeGroupCollapseState(Array.from(groupingCollapseIdsMap.keys()));
      }

      if (type === ExpandType.PullAll) {
        changeGroupCollapseState([]);
      }

      if (type === ExpandType.RetractAll) {
        changeGroupCollapseState(allGroupTabIds);
      }

      triggerRef.current!.close(e);
    }

    const childGroupTabKey = tabs;

    return (
      <ul className={styles.contextMenu}>
        {
          childGroupTabKey.some(item => groupingCollapseIdsMap.has(item)) ?
            <li onMouseDown={e => { groupCommand(ExpandType.Pull, e); }}>
              <div className={styles.icon}>
                <IconPullDown width={15} height={15} fill={colors.thirdLevelText} />
              </div>
              {t(Strings.expand_subgroup)}
            </li> : <></>
        }
        {
          childGroupTabKey.some(item => !groupingCollapseIdsMap.has(item)) ?
            <li onMouseDown={e => { groupCommand(ExpandType.Retract, e); }}>
              <div className={styles.icon}>
                <IconRetract width={15} height={15} fill={colors.thirdLevelText} />
              </div>
              {t(Strings.collapse_subgroup)}
            </li> : <></>
        }
        {
          allGroupTabIds.some(item => groupingCollapseIdsMap.has(item)) ?
            <li onMouseDown={e => { groupCommand(ExpandType.PullAll, e); }}>
              <div className={styles.icon}>
                <IconPullDownAll width={15} height={15} fill={colors.thirdLevelText} />
              </div>
              {t(Strings.expand_all_group)}
            </li> : <></>
        }
        {
          // 存在没有折叠的组头时
          setComplement(Array.from(groupingCollapseIdsMap.keys()), allGroupTabIds).length > 0 ?
            <li onMouseDown={e => { groupCommand(ExpandType.RetractAll, e); }}>
              <div className={styles.icon}>
                <IconRetractAll width={15} height={15} fill={colors.thirdLevelText} />
              </div>
              {t(Strings.collapse_all_group)}
            </li> : <></>
        }
      </ul>
    );
  }

  const getFieldName = () => {
    const fieldStyles: React.CSSProperties = {
      fontSize: '10px',
      color: colors.thirdLevelText,
      whiteSpace: 'nowrap',
    };
    return (
      <div style={fieldStyles}>
        {field?.name}
      </div>
    );
  };

  const builtinPlacements = {
    topLeft: {
      points: ['tl', 'tl'],
    },
  };

  const FirstColumnGroupTab = () => {
    return <div className={styles.cellWrapper} style={{ flex: '1', height: '100%' }}>
      {
        isCryptoField ?
          <div className={styles.lockedTab}>
            {t(Strings.crypto_field)}
            <FieldPermissionLock fieldId={fieldId} />
          </div> :
          <>
            {
              getFieldName()
            }
            {
              partOfCellValue()
            }
          </>
      }
    </div>;
  };

  return (
    <Trigger
      popupPlacement="topLeft"
      destroyPopupOnHide
      action={['contextMenu']}
      popupAlign={{
        overflow: {
          adjustX: 1,
          adjustY: 1,
        },
      }}
      mouseEnterDelay={0}
      popupClassName="point-popup"
      builtinPlacements={builtinPlacements}
      popup={contextMenu()}
      popupStyle={{
        width: '220px',
        zIndex: 2,
      }}
      alignPoint
      ref={triggerRef}
    >
      <div
        style={{
          width: '100% ',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: actualColumnIndex === 0 ? GROUP_OFFSET : '',
          height: GROUP_HEIGHT,
        }}
      >
        {actualColumnIndex === 0 && partOfToggle()}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1',
            width: 'calc(100% - 16px)',
            height: '100%',
          }}
          onClick={e => { triggerRef.current!.onContextMenuClose(e); }}
        >
          {
            actualColumnIndex === 0 &&
            <FirstColumnGroupTab />
          }

          {
            <StatOption
              fieldId={statTypeFieldId}
              row={row}
            />
          }
        </div>
      </div>
    </Trigger>
  );
};

export const GroupTab = React.memo(GroupTabBase);
