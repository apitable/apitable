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

import SwipeOut from 'rc-swipeout';
import * as React from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { IViewProperty, Selectors, StoreActions, Strings, t } from '@apitable/core';
import { DragOutlined } from '@apitable/icons';
import { Message } from 'pc/components/common';
import { Modal } from 'pc/components/common/mobile/modal';
import { changeView } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';
import { ViewIcon } from '../../view_switcher/view_icon';
import style from '../style.module.less';

const _SwipeOut: any = SwipeOut;

export enum ActionType {
  Delete,
  Rename,
  Duplicate,
  Add,
}

interface IViewItemProps {
  view: IViewProperty;
  activeViewId: string;
  onChange: (actionType: ActionType, view: IViewProperty) => void;
  onClose(): void;
  draggable: boolean;
  validator(value: string): boolean;
}

export const ViewItem: React.FC<React.PropsWithChildren<IViewItemProps>> = (props) => {
  const colors = useThemeColors();
  const { onChange, draggable, activeViewId, view, validator } = props;

  const { viewCreatable, viewRenamable, viewRemovable, datasheetId } = useAppSelector((state) => {
    const { viewCreatable, viewRenamable, viewRemovable } = Selectors.getPermissions(state);

    const { datasheetId } = state.pageParams;

    return {
      viewCreatable,
      viewRenamable,
      viewRemovable,
      datasheetId,
    };
  }, shallowEqual);

  const rightContent = [
    {
      text: t(Strings.duplicate),
      onPress: () => {
        onChange(ActionType.Duplicate, view);
      },
      style: { backgroundColor: colors.successColor },
      className: style.swipeItem,
    },
    {
      text: t(Strings.rename),
      onPress: () => {
        Modal.prompt({
          title: t(Strings.rename),
          defaultValue: view.name,
          onOk: (value) => {
            if (value === view.name) {
              return;
            }
            if (!validator(value)) {
              Message.error({
                content: t(Strings.view_name_length_err, {
                  maxCount: getEnvVariables().VIEW_NAME_MAX_COUNT,
                }),
              });
              return;
            }
            onChange(ActionType.Rename, {
              ...view,
              name: value,
            });
          },
        });
      },
      style: { backgroundColor: colors.warningColor },
      className: style.swipeItem,
    },
    {
      text: t(Strings.delete),
      onPress: async () => {
        const formList = await StoreActions.fetchForeignFormList(datasheetId!, view.id!);
        Modal.warning({
          title: t(Strings.delete),
          content:
            formList.length > 0
              ? t(Strings.notes_delete_the_view_linked_to_form, {
                view_name: view.name,
              })
              : t(Strings.del_view_content, {
                view_name: view.name,
              }),
          onOk: () => {
            onChange(ActionType.Delete, view);
          },
        });
      },
      style: { backgroundColor: colors.errorColor },
      className: style.swipeItem,
    },
  ];

  const viewPermissions = [viewCreatable, viewRenamable, viewRemovable];

  const _rightContent = rightContent.filter((_, index) => viewPermissions[index]);

  const active = activeViewId === view.id;
  const fillColor = active ? colors.primaryColor : colors.thirdLevelText;
  const fontColor = active ? colors.primaryColor : colors.firstLevelText;

  return (
    <_SwipeOut right={_rightContent} autoClose disabled={!viewCreatable && !viewRenamable && !viewRemovable}>
      <div
        className={style.viewItem}
        onClick={() => {
          changeView(view.id);
          props.onClose();
        }}
      >
        {draggable && (
          <div className={style.iconMove}>
            <DragOutlined size={10} color={fillColor} />
          </div>
        )}
        <ViewIcon viewType={view.type} color={fillColor} />
        <span className={style.text} style={{ color: fontColor }}>
          {view.name}
        </span>
      </div>
    </_SwipeOut>
  );
};
