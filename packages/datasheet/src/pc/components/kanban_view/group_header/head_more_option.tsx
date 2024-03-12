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

import * as React from 'react';
import { ContextMenu, useThemeColors } from '@apitable/components';
import { Selectors, Strings, t, UN_GROUP } from '@apitable/core';
import { AddOutlined, EditOutlined, NarrowOutlined, DeleteOutlined, EyeOpenOutlined } from '@apitable/icons';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';

export const KANBAN_GROUP_MORE = 'KANBAN_GROUP_MORE';

export const GroupHeadMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { rowCreatable, fieldPropertyEditable } = useAppSelector(Selectors.getPermissions);
  const colors = useThemeColors();
  const isViewLock = useShowViewLockModal();

  return (
    <ContextMenu
      menuId={KANBAN_GROUP_MORE}
      overlay={flatContextData(
        [
          [
            {
              icon: <AddOutlined color={colors.thirdLevelText} />,
              text: t(Strings.add_kanban_group_card),
              hidden: !rowCreatable,
              onClick: ({ props: { addNewRecord } }: any) => {
                addNewRecord();
              },
            },
            {
              icon: <EditOutlined color={colors.thirdLevelText} />,
              text: t(Strings.editing_group),
              hidden(arg: any) {
                const {
                  props: { groupId },
                } = arg;

                if (!fieldPropertyEditable || groupId === UN_GROUP) {
                  return true;
                }

                return false;
              },
              onClick: ({ props: { setEditing } }: any) => {
                setEditing(true);
              },
            },
            {
              icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
              text: t(Strings.hide_kanban_grouping),
              onClick: ({ props: { hideGroup } }: any) => {
                hideGroup();
              },
              disabled: isViewLock,
              disabledTip: t(Strings.view_lock_setting_desc),
            },
            {
              icon: <NarrowOutlined color={colors.thirdLevelText} />,
              text: t(Strings.collapse_kanban_group),
              onClick: ({ props: { collapseGroup } }: any) => {
                collapseGroup();
              },
            },
          ],
          [
            {
              icon: <DeleteOutlined color={colors.thirdLevelText} />,
              text: t(Strings.delete),
              hidden(arg: any) {
                const {
                  props: { groupId },
                } = arg;

                if (!fieldPropertyEditable || groupId === UN_GROUP) {
                  return true;
                }

                return false;
              },
              onClick: ({ props: { deleteGroup } }: any) => {
                deleteGroup();
              },
            },
          ],
        ],
        true,
      )}
    />
  );
};
