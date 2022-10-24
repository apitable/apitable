import { Selectors, Strings, t, UN_GROUP } from '@apitable/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ContextMenu, useThemeColors } from '@vikadata/components';
import { AddOutlined, EditOutlined, NarrowRecordOutlined, DeleteOutlined, HideFilled } from '@vikadata/icons';
import { flatContextData } from 'pc/utils';

export const KANBAN_GROUP_MORE = 'KANBAN_GROUP_MORE';

export const GroupHeadMenu: React.FC = props => {
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
          onClick: ({ props: { addNewRecord }}) => {
            addNewRecord();
          },
        },
        {
          icon: <EditOutlined color={colors.thirdLevelText} />,
          text: t(Strings.editing_group),
          hidden(arg) {
            const { props: { groupId }} = arg;

            if (!fieldPropertyEditable || groupId === UN_GROUP) {
              return true;
            }

            return false;
          },
          onClick: ({ props: { setEditing }}) => {
            setEditing(true);
          },
        },
        {
          icon: <HideFilled color={colors.thirdLevelText} />,
          text: t(Strings.hide_kanban_grouping),
          onClick: ({ props: { hideGroup }}) => { hideGroup(); },
        },
        {
          icon: <NarrowRecordOutlined color={colors.thirdLevelText} />,
          text: t(Strings.collapse_kanban_group),
          onClick: ({ props: { collapseGroup }}) => { collapseGroup(); },
        },
      ],
      [
        {
          icon: <DeleteOutlined color={colors.thirdLevelText} />,
          text: t(Strings.delete),
          hidden(arg) {
            const { props: { groupId }} = arg;

            if (!fieldPropertyEditable || groupId === UN_GROUP) {
              return true;
            }

            return false;
          },
          onClick: ({ props: { deleteGroup }}) => {
            deleteGroup();
          },
        },
      ],
    ], true)}
  />;

};
