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
import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';

import {
  BasicValueType,
  CollaCommandName, ConfigConstant,
  ExecuteResult,
  Field,
  FieldType,
  FieldTypeDescriptionMap,
  getMaxFieldCountPerSheet,
  getUniqName,
  IReduxState,
  isSelectField,
  Selectors,
  SetFieldFrom,
  StoreActions,
  Strings,
  t,
  ToolBarMenuCardOpenState,
} from '@apitable/core';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  DuplicateOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  EditOutlined,
  FilterOutlined,
  EyeOpenOutlined,
  LockOutlined,
} from '@apitable/icons';
import { Message, MobileContextMenu } from 'pc/components/common';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandFieldPermission } from 'pc/components/field_permission';
import { getShowFieldName } from 'pc/components/multi_grid/context_menu/utils';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getEnvVariables } from 'pc/utils/env';

import { useActiveFieldSetting, useDeleteField, useFilterField, useHideField, useSortField } from '../multi_grid/hooks';
import { expandFieldDescEditorMobile } from './field_desc_editor';

interface IFieldMenu {
  onClose(): void;
  fieldId: string;
}

export const FieldMenu: React.FC<React.PropsWithChildren<IFieldMenu>> = ({ onClose, fieldId }) => {
  const colors = useThemeColors();
  const { datasheetId, fieldMap, view, permissions, field, fieldIndex } = useAppSelector((state: IReduxState) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const view = Selectors.getCurrentView(state)!;
    const fieldIndex = view.columns.findIndex((field) => field.fieldId === fieldId);

    const field = fieldMap[fieldId];
    const permissions = Selectors.getPermissions(state, undefined, fieldId);

    return {
      datasheetId,
      fieldMap,
      view,
      permissions,
      field,
      fieldIndex,
    };
  }, shallowEqual);
  const catalogTreeActiveType = useAppSelector((state) => state.catalogTree.activeType);
  const isPrivate = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE;
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);
  const dispatch = useAppDispatch();
  const handleHideField = useHideField(view);
  const handleSortField = useSortField();
  const handleFilterField = useFilterField();
  const activeFieldSettings = useActiveFieldSetting();
  const deleteField = useDeleteField(field.id, datasheetId);
  const embedId = useAppSelector((state) => state.pageParams.embedId);
  /**
   * Give a warning when a field is deleted during collaboration.
   * Ends rendering early.
   */
  useEffect(() => {
    if (!field) {
      Message.warning({
        content: t(Strings.current_column_been_deleted),
      });
    }
  }, [field]);

  if (!field) {
    return null;
  }

  const { fieldPropertyEditable, descriptionEditable, fieldCreatable, fieldRemovable, editable, fieldSortable, fieldPermissionManageable } =
    permissions;

  const fieldError = Boolean(Field.bindModel(field).validateProperty().error);
  const canFilter = Boolean(Field.bindModel(field).canFilter);
  const showFieldName = getShowFieldName(field.name);
  // Special judgment, when the link field error, need to allow the user to delete the current link field
  const linkedFieldError = field.type === FieldType.Link && fieldError;

  function addField(index: number, fieldId: string, offset: number) {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [
        {
          data: {
            name: getUniqName(
              FieldTypeDescriptionMap[FieldType.Text].title,
              Object.keys(fieldMap).map((id) => fieldMap[id].name),
            ),
            type: FieldType.Text,
            property: null,
          },
          viewId: view.id,
          index,
          fieldId,
          offset,
        },
      ],
    });
    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(t(Strings.toast_insert_field_success), NotifyKey.InsertField);
    }
  }

  function copyField(index: number, fieldId: string, offset: number) {
    const result = resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.AddFields,
      copyCell: true,
      fieldId: field.id,
      data: [
        {
          data: {
            name: getUniqName(
              field.name + t(Strings.copy),
              Object.keys(fieldMap).map((id) => fieldMap[id].name),
            ),
            type: field.type,
            property: field.property,
          },
          viewId: view.id,
          index: index,
          fieldId,
          offset,
        },
      ],
    });

    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(t(Strings.toast_duplicate_field_success), NotifyKey.DuplicateField);
    }
  }

  function openFieldDesc() {
    expandFieldDescEditorMobile({ field, readOnly: false });
  }

  function sortField(desc: boolean) {
    const res = handleSortField(desc, field.id);
    if (res === ExecuteResult.Success) {
      dispatch(StoreActions.setToolbarMenuCardOpen(ToolBarMenuCardOpenState.Sort));
    }
  }

  function filterField() {
    const res = handleFilterField(field.id);
    if (res === ExecuteResult.Success) {
      dispatch(StoreActions.setToolbarMenuCardOpen(ToolBarMenuCardOpenState.Filter));
    }
  }

  function hiddenField() {
    handleHideField([field.id], true);
  }

  function editField() {
    activeFieldSettings(field.id, SetFieldFrom.CONTEXT_MENU);
  }

  function renderSortText(desc: boolean) {
    const { valueType } = Field.bindModel(field);
    let from: any;
    let to: any;
    if (isSelectField(field)) {
      if (desc) {
        return t(Strings.sort_by_option_reverse);
      }
      return t(Strings.sort_by_option_order);
    }
    switch (valueType) {
      case BasicValueType.Boolean:
        from = t(Strings.stat_un_checked);
        to = t(Strings.stat_checked);
        break;
      case BasicValueType.String:
        from = 'A';
        to = 'Z';
        break;
      case BasicValueType.Number:
      case BasicValueType.DateTime:
      default:
        from = '1';
        to = '9';
        break;
    }
    if (desc) {
      return t(Strings.sort_desc, { from: to, to: from });
    }
    return t(Strings.sort_desc, { from, to });
  }

  const menuData = [
    [
      {
        icon: <EditOutlined color={colors.thirdLevelText} />,
        text: t(Strings.modify_field),
        hidden: !fieldPropertyEditable,
        onClick: editField,
      },
      {
        icon: <InfoCircleOutlined color={colors.thirdLevelText} />,
        text: t(Strings.editing_field_desc),
        hidden: !descriptionEditable,
        onClick: openFieldDesc,
      },
      {
        icon: <LockOutlined color={colors.thirdLevelText} />,
        text: t(Strings.config_field_permission),
        onClick: () => {
          expandFieldPermission(field);
        },
        disabled: !fieldPermissionManageable || !getEnvVariables().FIELD_PERMISSION_VISIBLE,
        hidden(arg: any) {
          const {
            props: { fieldId },
          } = arg;

          if (!fieldId || embedId || isPrivate) {
            return true;
          }

          if (!fieldPermissionManageable || !fieldIndex) {
            return true;
          }

          return Boolean(fieldPermissionMap && !fieldPermissionMap[fieldId] && Object.keys(fieldPermissionMap).length > getMaxFieldCountPerSheet());
        },
      },
    ],
    [
      {
        icon: <ArrowLeftOutlined color={colors.thirdLevelText} />,
        text: t(Strings.insert_field_before),
        hidden: !fieldCreatable || fieldIndex === 0,
        onClick: () => addField(fieldIndex, fieldId, 0),
      },
      {
        icon: <ArrowRightOutlined color={colors.thirdLevelText} />,
        text: t(Strings.insert_field_after),
        hidden: !fieldCreatable,
        onClick: () => addField(fieldIndex + 1, fieldId, 1),
      },
      {
        icon: <DuplicateOutlined color={colors.thirdLevelText} />,
        text: t(Strings.duplicate_field),
        hidden: !fieldCreatable || fieldError || !fieldPropertyEditable,
        onClick: () => copyField(fieldIndex + 1, fieldId, 1),
      },
    ],
    [
      {
        icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
        text: renderSortText(false),
        hidden: !fieldSortable,
        onClick: () => sortField(false),
      },
      {
        icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
        text: renderSortText(true),
        hidden: !fieldSortable,
        onClick: () => sortField(true),
      },
    ],
    [
      {
        icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
        text: t(Strings.hide_fields),
        hidden: !editable || fieldIndex === 0 || Boolean(mirrorId),
        onClick: hiddenField,
      },
      {
        icon: <FilterOutlined color={colors.thirdLevelText} />,
        text: t(Strings.filter_fields, { field_name: showFieldName }),
        hidden: !editable || Boolean(mirrorId) || !canFilter,
        onClick: filterField,
      },
    ],
    [
      {
        icon: <DeleteOutlined color={colors.thirdLevelText} />,
        text: t(Strings.delete_field),
        hidden: !((fieldRemovable && fieldIndex !== 0) || linkedFieldError),
        onClick: deleteField,
      },
    ],
  ];

  return (
    <MobileContextMenu
      title={t(Strings.edit)}
      visible={fieldIndex !== -1}
      onClose={onClose}
      data={menuData}
      params={{
        fieldId,
      }}
      height="90%"
    />
  );
};
