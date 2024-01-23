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

/*
 * @doc https://www.notion.so/vikadata/50b41920a64f4bffaf55f7f9b4427985
 */
import Trigger from 'rc-trigger';
import { useCallback, useMemo, useRef } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  Field,
  FieldType,
  Group,
  IGroupInfo,
  ILinearRowGroupTab,
  ISelectFieldOption,
  LookUpField,
  Selectors,
  setComplement,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { ConicalDownFilled, ConicalRightFilled, TriangleDownFilled, TriangleRightFilled } from '@apitable/icons';
import { FieldPermissionLock } from 'pc/components/field_permission';
import { CellValue } from 'pc/components/multi_grid/cell/cell_value';
import { GROUP_OFFSET } from 'pc/components/multi_grid/enum';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import { dispatch } from 'pc/worker/store';
import { StatOption } from '../../../stat_option';
import styles from '../../../styles.module.less';
import { GROUP_HEIGHT } from '../constant';

interface IGroupTab {
  row: ILinearRowGroupTab;
  actualColumnIndex: number;
  groupInfo: IGroupInfo;
  isSort?: boolean;
}

export enum ExpandType {
  Pull = 'Pull',
  Retract = 'Retract',
  PullAll = 'PullAll',
  RetractAll = 'RetractAll',
}

const GroupTabBase: React.FC<React.PropsWithChildren<IGroupTab>> = (props) => {
  const { row, actualColumnIndex, groupInfo, isSort } = props;
  const fieldId = groupInfo[row.depth]?.fieldId;
  const pathKey = `${row.recordId}_${row.depth}`;
  const colors = useThemeColors();
  const { field, statTypeFieldId, viewId, datasheetId, groupingCollapseIds, isSearching, fieldPermissionMap } = useAppSelector((state) => {
    const columns = Selectors.getVisibleColumns(state);
    const statTypeFieldId = columns[actualColumnIndex].fieldId;
    return {
      statTypeFieldId,
      viewId: Selectors.getActiveViewId(state),
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      groupingCollapseIds: Selectors.getGroupingCollapseIds(state),
      field: Selectors.getSnapshot(state)!.meta.fieldMap[fieldId],
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
    };
  }, shallowEqual);
  const groupingCollapseIdsMap = new Map<string, boolean>(groupingCollapseIds?.map((v) => [v, true]));
  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, fieldId);
  const isCryptoField = fieldRole === ConfigConstant.Role.None;
  const triggerRef = useRef<any>();

  const changeGroupCollapseState = useCallback(
    (newState: string[]) => {
      // Blocking collapsing grouping operation when searching within a table
      if (isSearching) {
        return;
      }
      dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
      // QuickAppend component display depends on hoverRecordId, which should be cleared in case of group collapse to avoid visual misleading
      dispatch(StoreActions.setHoverRecordId(datasheetId, null));
      setStorage(StorageName.GroupCollapse, { [`${datasheetId},${viewId}`]: newState });
    },
    [datasheetId, viewId, isSearching],
  );

  const state = store.getState();
  const groupSketch = useMemo(() => {
    return new Group(groupInfo, Selectors.getGroupBreakpoint(state));
    // eslint-disable-next-line
  }, [JSON.stringify(groupInfo)]);
  const allGroupTabIds: string[] = useMemo(() => {
    if (!groupInfo) return [];
    return Array.from(groupSketch.getAllGroupTabIdsByRecomputed(state).keys());
    // eslint-disable-next-line
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
        style={{
          transition: 'all 0.3s',
          transform: groupingCollapseIdsMap.has(pathKey) ? 'rotate(-90deg)' : 'rotate(0)',
          marginRight: '8px',
        }}
      >
        <TriangleDownFilled color={colors.thirdLevelText} size={10} />
      </div>
    );
  }

  // Values are sorted by index order
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
      color: colors.thirdLevelText,
      flex: '1',
      whiteSpace: 'nowrap',
    };
    if (cellValue === undefined) {
      return <div style={commonStyle}>({t(Strings.data_error)})</div>;
    }
    if (cellValue === null) {
      return <div style={commonStyle}>({t(Strings.content_is_empty)})</div>;
    }
    let sortValue;
    // Sort by index order
    if (isSort) {
      // Tab is multi-select and isSort is true
      if (field.type === FieldType.MultiSelect) {
        sortValue = sortValueByOptionOrder(cellValue, field.property.options);
      } else if (field.type === FieldType.LookUp) {
        // Tab is a lookup and isSort is true and realField is single or multiple choice
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
    const res = groupSketch.getChildBreakpointIds(state, row.recordId, row.depth).map((recordId) => `${recordId}_${row.depth + 1}`);
    res.push(`${row.recordId}_${row.depth}`);
    return res;
  }

  function contextMenu() {
    const tabs = findChildGroupTab();

    function groupCommand(type: ExpandType, e: React.MouseEvent) {
      // Disables grouping-related operations when a table lookup is being performed.
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
        {childGroupTabKey.some((item) => groupingCollapseIdsMap.has(item)) ? (
          <li
            onMouseDown={(e) => {
              groupCommand(ExpandType.Pull, e);
            }}
          >
            <div className={styles.icon}>
              <TriangleDownFilled size={15} color={colors.thirdLevelText} />
            </div>
            {t(Strings.expand_subgroup)}
          </li>
        ) : (
          <></>
        )}
        {childGroupTabKey.some((item) => !groupingCollapseIdsMap.has(item)) ? (
          <li
            onMouseDown={(e) => {
              groupCommand(ExpandType.Retract, e);
            }}
          >
            <div className={styles.icon}>
              <TriangleRightFilled size={15} color={colors.thirdLevelText} />
            </div>
            {t(Strings.collapse_subgroup)}
          </li>
        ) : (
          <></>
        )}
        {allGroupTabIds.some((item) => groupingCollapseIdsMap.has(item)) ? (
          <li
            onMouseDown={(e) => {
              groupCommand(ExpandType.PullAll, e);
            }}
          >
            <div className={styles.icon}>
              <ConicalDownFilled size={15} color={colors.thirdLevelText} />
            </div>
            {t(Strings.expand_all_group)}
          </li>
        ) : (
          <></>
        )}
        {
          // When there are group tab that are not collapsed
          setComplement(Array.from(groupingCollapseIdsMap.keys()), allGroupTabIds).length > 0 ? (
            <li
              onMouseDown={(e) => {
                groupCommand(ExpandType.RetractAll, e);
              }}
            >
              <div className={styles.icon}>
                <ConicalRightFilled size={15} color={colors.thirdLevelText} />
              </div>
              {t(Strings.collapse_all_group)}
            </li>
          ) : (
            <></>
          )
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
    return <div style={fieldStyles}>{field?.name}</div>;
  };

  const builtinPlacements = {
    topLeft: {
      points: ['tl', 'tl'],
    },
  };

  const FirstColumnGroupTab = () => {
    return (
      <div className={styles.cellWrapper} style={{ flex: '1', height: '100%' }}>
        {isCryptoField ? (
          <div className={styles.lockedTab}>
            {t(Strings.crypto_field)}
            <FieldPermissionLock fieldId={fieldId} />
          </div>
        ) : (
          <>
            {getFieldName()}
            {partOfCellValue()}
          </>
        )}
      </div>
    );
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
          onClick={(e) => {
            triggerRef.current!.onContextMenuClose(e);
          }}
        >
          {actualColumnIndex === 0 && <FirstColumnGroupTab />}

          {<StatOption fieldId={statTypeFieldId} row={row} />}
        </div>
      </div>
    </Trigger>
  );
};

export const GroupTab = React.memo(GroupTabBase);
