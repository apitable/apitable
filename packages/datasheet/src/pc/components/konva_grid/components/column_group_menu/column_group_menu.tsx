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

import { useState } from 'react';
import { ContextMenu, useThemeColors } from '@apitable/components';
import { CollaCommandName, IColumnGroup, IGridViewProperty, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@apitable/core';
import { DeleteOutlined, EditOutlined } from '@apitable/icons';
import { ColumnGroupNameModal } from 'pc/components/multi_grid/context_menu/column_group_name_modal';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';

interface IColumnGroupMenuInfo {
  props?: {
    columnGroupId?: string;
  };
}

export const ColumnGroupMenu = () => {
  const colors = useThemeColors();
  const view = useAppSelector(Selectors.getCurrentView)! as IGridViewProperty;
  const permissions = useAppSelector(Selectors.getPermissions);
  const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);
  const [renamingGroupId, setRenamingGroupId] = useState<string | null>(null);

  if (mirrorId || !permissions.editable) return null;

  const columnGroups = view.columnGroups || [];
  const renamingGroup = columnGroups.find((group) => group.id === renamingGroupId) || null;
  const disabled = !permissions.columnGroupable || Boolean(view.lockInfo);

  const getColumnGroup = (info?: IColumnGroupMenuInfo) => {
    return columnGroups.find((group) => group.id === info?.props?.columnGroupId) || null;
  };

  const setColumnGroups = (data: IColumnGroup[]) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetColumnGroups,
      viewId: view.id,
      data,
    });
  };

  const renameColumnGroup = (name: string) => {
    if (!renamingGroup) return;
    setColumnGroups(columnGroups.map((group) => (group.id === renamingGroup.id ? { ...group, name } : group)));
    setRenamingGroupId(null);
  };

  const menuData = flatContextData(
    [
      [
        {
          icon: <EditOutlined color={colors.thirdLevelText} />,
          text: t(Strings.rename),
          disabled,
          onClick: (info: IColumnGroupMenuInfo) => {
            const group = getColumnGroup(info);
            group && setRenamingGroupId(group.id);
          },
          id: 'rename_column_group',
        },
        {
          icon: <DeleteOutlined color={colors.thirdLevelText} />,
          text: t(Strings.disband_column_group),
          disabled,
          onClick: (info: IColumnGroupMenuInfo) => {
            const group = getColumnGroup(info);
            group && setColumnGroups(columnGroups.filter((item) => item.id !== group.id));
          },
          id: 'disband_column_group',
        },
      ],
    ],
    true,
  );

  return (
    <>
      <ContextMenu menuId={KONVA_DATASHEET_ID.GRID_COLUMN_GROUP_MENU} overlay={menuData} width={180} />
      {renamingGroup && (
        <ColumnGroupNameModal
          title={t(Strings.rename)}
          initialValue={renamingGroup.name || t(Strings.column_group_default_name)}
          onCancel={() => setRenamingGroupId(null)}
          onSubmit={renameColumnGroup}
        />
      )}
    </>
  );
};
