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

import { useContext, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { ContextMenu, useContextMenu } from '@apitable/components';
import { Group, ILinearRow, KONVA_DATASHEET_ID, Selectors, setComplement, StoreActions, Strings, t } from '@apitable/core';
import { ConicalDownFilled, ConicalRightFilled, CopyOutlined, TriangleDownFilled, TriangleRightFilled } from '@apitable/icons';

import { ExpandType } from 'pc/components/multi_grid/cell/virtual_cell/cell_group_tab/group_tab/group_tab';
import { useDispatch } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { copy2clipBoard, flatContextData } from 'pc/utils';
import { setStorage, StorageName } from 'pc/utils/storage';
import { KonvaGridContext } from '../..';
import { MouseDownType } from '../../../multi_grid';

interface IStatMenuProps {
  parentRef: React.RefObject<HTMLDivElement> | undefined;
  getBoundary: (e: any) => { x: number; y: number; row: ILinearRow } | null;
}

export const GroupMenu: React.FC<React.PropsWithChildren<IStatMenuProps>> = (props) => {
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { parentRef, getBoundary } = props;
  const [row, setRow] = useState<{ recordId: string; depth: number } | null>(null);
  const [statText, setStatText] = React.useState<string>('');
  const dispatch = useDispatch();

  const { show } = useContextMenu({ id: KONVA_DATASHEET_ID.GRID_GROUP_MENU });
  const { viewId, datasheetId, groupInfo, isSearching, groupCollapseIds, groupBreakpoint } = useAppSelector((state) => {
    return {
      viewId: Selectors.getActiveViewId(state)!,
      groupCollapseIds: Selectors.getGroupingCollapseIds(state),
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      datasheetId: state.pageParams.datasheetId!,
      groupBreakpoint: Selectors.getGroupBreakpoint(state),
    };
  }, shallowEqual);
  const groupingCollapseIdsMap = new Map<string, boolean>(groupCollapseIds?.map((v) => [v, true]));

  const changeGroupCollapseState = (newState: string[]) => {
    // Masking collapsing grouping operation when searching within a datasheet
    if (isSearching) return;
    dispatch(StoreActions.setGroupingCollapse(datasheetId, newState));
    // QuickAppend component display depends on hoverRecordId, which should be cleared in case of group collapse to avoid visual misleading
    dispatch(StoreActions.setHoverRecordId(datasheetId, null));
    setStorage(StorageName.GroupCollapse, { [`${datasheetId},${viewId}`]: newState });
  };

  function groupCommand(type: ExpandType) {
    // Disables grouping-related operations when a table lookup is being performed.
    if (isSearching) return;
    if (type === ExpandType.Pull) {
      for (const tab of childGroupTabKey) {
        groupingCollapseIdsMap.delete(tab);
      }
      changeGroupCollapseState(Array.from(groupingCollapseIdsMap.keys()));
    }

    if (type === ExpandType.Retract) {
      for (const tab of childGroupTabKey) {
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
  }

  const state = store.getState();

  const groupSketch = useMemo(() => {
    return new Group(groupInfo, groupBreakpoint);
  }, [groupBreakpoint, groupInfo]);

  const allGroupTabIds: string[] = useMemo(() => {
    if (!groupInfo) return [];
    const allGroupTabIds = Array.from(groupSketch.getAllGroupTabIdsByRecomputed(state).keys());
    return allGroupTabIds;
    // eslint-disable-next-line
  }, [groupSketch]);

  const childGroupTabKey = useMemo(() => {
    const state = store.getState();
    if (!row) return [];
    const res = groupSketch.getChildBreakpointIds(state, row.recordId, row.depth).map((recordId) => `${recordId}_${row.depth + 1}`);
    res.push(`${row.recordId}_${row.depth}`);
    return res;
  }, [groupSketch, row]);

  const showContextMenu = (e: MouseEvent) => {
    if (e.button !== MouseDownType.Right) return;

    const fieldBoundary = getBoundary(e);
    if (!fieldBoundary) return;

    const { x, y, row } = fieldBoundary;
    if (row == null) return;

    const _statText = sessionStorage.getItem('selected_state');
    setStatText(_statText || '');

    show(e as unknown as React.MouseEvent<HTMLElement>, {
      id: KONVA_DATASHEET_ID.GRID_GROUP_MENU,
      position: {
        x,
        y,
      },
    });
    setRow(row);
  };

  const onCopy = () => {
    if (!statText) return;

    copy2clipBoard(statText);
  };

  useEffect(() => {
    const element = parentRef!.current;
    if (!element) return;
    element.addEventListener('contextmenu', showContextMenu);
    element.addEventListener('click', showContextMenu);
    return () => {
      element.removeEventListener('contextmenu', showContextMenu);
      element.removeEventListener('click', showContextMenu);
    };
  });

  const data = flatContextData(
    [
      [
        {
          text: t(Strings.expand_subgroup),
          icon: <TriangleDownFilled size={15} color={colors.thirdLevelText} />,
          hidden: !childGroupTabKey.some((item) => groupingCollapseIdsMap.has(item)),
          onClick: () => groupCommand(ExpandType.Pull),
        },
        {
          text: t(Strings.collapse_subgroup),
          icon: <TriangleRightFilled size={15} color={colors.thirdLevelText} />,
          hidden: !childGroupTabKey.some((item) => !groupingCollapseIdsMap.has(item)),
          onClick: () => groupCommand(ExpandType.Retract),
        },
        {
          text: t(Strings.expand_all_group),
          icon: <ConicalDownFilled size={15} color={colors.thirdLevelText} />,
          hidden: !allGroupTabIds.some((item) => groupingCollapseIdsMap.has(item)),
          onClick: () => groupCommand(ExpandType.PullAll),
        },
        {
          text: t(Strings.collapse_all_group),
          icon: <ConicalRightFilled size={15} color={colors.thirdLevelText} />,
          hidden: !setComplement(Array.from(groupingCollapseIdsMap.keys()), allGroupTabIds).length,
          onClick: () => groupCommand(ExpandType.RetractAll),
        },
        {
          icon: <CopyOutlined color={colors.thirdLevelText} />,
          text: t(Strings.copy_link),
          onClick: () => onCopy(),
          disabled: !statText,
        },
      ],
    ],
    true,
  );

  return <ContextMenu menuId={KONVA_DATASHEET_ID.GRID_GROUP_MENU} overlay={data} />;
};
