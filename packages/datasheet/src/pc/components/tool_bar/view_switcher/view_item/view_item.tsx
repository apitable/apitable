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

import { Tooltip } from 'antd';
import * as React from 'react';
import { useThemeColors } from '@apitable/components';
import { Selectors, Strings, t } from '@apitable/core';
import { AutosaveOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { ViewIcon } from '../view_icon';
import { OperateItem } from './operate_item';

interface IViewItemOwnProps {
  currentViewId: string;
  currentViewName: string;
  viewLength: number;
  currentViewIndex: number;
  activityViewId: string;
  isEditingId: string;
  errorMsg: string;
  viewType: number;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter: () => void;
  switchView: (e: React.MouseEvent, id: string) => void;
  confirmDelete: (e: React.MouseEvent, id: string) => void;
  renameEvent: (id: string, name: string) => void;
  duplicateView: (id: string) => void;
  autoSave?: boolean;
  isViewLock?: boolean;
}

type IViewItemProps = IViewItemOwnProps;

// TODO: Deletion requires pop-up confirmation.
export const ViewItem: React.FC<React.PropsWithChildren<IViewItemProps>> = (props) => {
  const {
    currentViewId,
    currentViewName,
    isEditingId,
    renameEvent,
    viewType,
    switchView,
    confirmDelete,
    errorMsg,
    onInput,
    onPressEnter,
    duplicateView,
    autoSave,
    isViewLock,
  } = props;
  const colors = useThemeColors();
  const { viewCreatable, viewRenamable, viewMovable, viewRemovable } = useAppSelector(Selectors.getPermissions);
  const spaceManualSaveViewIsOpen = useAppSelector((state) => {
    return state.labs.includes('view_manual_save');
  });

  const rename = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    renameEvent(currentViewId, currentViewName);
  };

  // The type of view icon.
  const viewIconFill = props.activityViewId === currentViewId ? colors.primaryColor : colors.thirdLevelText;

  const clickView = (e: React.MouseEvent) => {
    stopPropagation(e);
    switchView(e, currentViewId);
  };

  const showSuffixIcon = props.activityViewId === currentViewId && spaceManualSaveViewIsOpen && autoSave;
  return (
    <OperateItem
      allowSort={viewMovable}
      editing={isEditingId === currentViewId}
      prefixIcon={
        <span style={{ display: 'flex' }} onClick={stopPropagation}>
          <ViewIcon viewType={viewType} size={16} color={viewIconFill} />
        </span>
      }
      isActive={props.activityViewId === currentViewId}
      onItemClick={clickView}
      id={currentViewId}
      suffixIcon={
        showSuffixIcon ? (
          <Tooltip title={t(Strings.auto_save_has_been_opend)}>
            <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>
              <AutosaveOutlined color={colors.primaryColor} />
            </span>
          </Tooltip>
        ) : undefined
      }
      inputData={{
        value: currentViewName,
        errMsg: errorMsg,
        onEnter: onPressEnter,
        onChange: onInput,
      }}
      operateData={{
        delete: {
          show: viewRemovable && props.viewLength > 1 && !isViewLock,
          tooltip: t(Strings.delete),
          onClick: (e) => {
            confirmDelete(e as any as React.MouseEvent, currentViewId);
          },
        },
        duplicate: {
          show: viewCreatable,
          tooltip: t(Strings.duplicate),
          onClick: () => {
            duplicateView(currentViewId);
          },
        },
        rename: {
          show: viewRenamable,
          tooltip: t(Strings.rename),
          onClick: (e) => {
            rename(e);
          },
        },
      }}
    />
  );
};
