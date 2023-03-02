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

import { Selectors, Strings, t, UN_GROUP } from '@apitable/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ContextMenu, useThemeColors } from '@apitable/components';
import { AddOutlined, EditOutlined, NarrowOutlined, DeleteOutlined, EyeOpenOutlined } from '@apitable/icons';
import { flatContextData } from 'pc/utils';

export const KANBAN_GROUP_MORE = 'KANBAN_GROUP_MORE';

export const GroupHeadMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { rowCreatable, fieldPropertyEditable } = useSelector(Selectors.getPermissions);
  const colors = useThemeColors();
  return <ContextMenu
    menuId={KANBAN_GROUP_MORE}
    overlay={flatContextData([
      [
        {
          icon: <AddOutlined color={colors.thirdLevelText} />,
          text: t(Strings.add_kanban_group_card),
          hidden: !rowCreatable,
          onClick: ({ props: { addNewRecord }}: any) => {
            addNewRecord();
          },
        },
        {
          icon: <EditOutlined color={colors.thirdLevelText} />,
          text: t(Strings.editing_group),
          hidden(arg: any) {
            const { props: { groupId }} = arg;

            if (!fieldPropertyEditable || groupId === UN_GROUP) {
              return true;
            }

            return false;
          },
          onClick: ({ props: { setEditing }}: any) => {
            setEditing(true);
          },
        },
        {
          icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
          text: t(Strings.hide_kanban_grouping),
          onClick: ({ props: { hideGroup }}: any) => { hideGroup(); },
        },
        {
          icon: <NarrowOutlined color={colors.thirdLevelText} />,
          text: t(Strings.collapse_kanban_group),
          onClick: ({ props: { collapseGroup }}: any) => { collapseGroup(); },
        },
      ],
      [
        {
          icon: <DeleteOutlined color={colors.thirdLevelText} />,
          text: t(Strings.delete),
          hidden(arg: any) {
            const { props: { groupId }} = arg;

            if (!fieldPropertyEditable || groupId === UN_GROUP) {
              return true;
            }

            return false;
          },
          onClick: ({ props: { deleteGroup }}: any) => {
            deleteGroup();
          },
        },
      ],
    ], true)}
  />;

};
