import { useThemeColors } from '@vikadata/components';

import {
  BasicValueType, CollaCommandName, ExecuteResult, Field, FieldType, FieldTypeDescriptionMap, getMaxFieldCountPerSheet, getUniqName, IReduxState,
  isSelectField, Selectors, SetFieldFrom, StoreActions, Strings, t, ToolBarMenuCardOpenState
} from '@apitable/core';
import {
  ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined, EditDescribeOutlined, EditOutlined,
  FilterOutlined, HideFilled, LockOutlined
} from '@vikadata/icons';
import { Message, MobileContextMenu } from 'pc/components/common';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandFieldPermission } from 'pc/components/field_permission';
import { getShowFieldName } from 'pc/components/multi_grid/context_menu/utils';
import { resourceService } from 'pc/resource_service';
import * as React from 'react';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useActiveFieldSetting, useDeleteField, useFilterField, useHideField, useSortField } from '../multi_grid/hooks';
import { expandFieldDescEditorMobile } from './field_desc_editor';

interface IFieldMenu {
  onClose(): void;
  fieldId: string;
}

export const FieldMenu: React.FC<IFieldMenu> = (
  {
    onClose,
    fieldId,
  }) => {
  const colors = useThemeColors();
  const {
    datasheetId,
    fieldMap,
    view,
    permissions,
    field,
    fieldIndex,
  } = useSelector((state: IReduxState) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const fieldMap = Selectors.getFieldMap(state, datasheetId)!;
    const view = Selectors.getCurrentView(state)!;
    const fieldIndex = view.columns.findIndex(field => field.fieldId === fieldId);

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
  const fieldPermissionMap = useSelector(Selectors.getFieldPermissionMap);
  const mirrorId = useSelector(state => state.pageParams.mirrorId);
  const dispatch = useDispatch();
  const handleHideField = useHideField(view);
  const handleSortField = useSortField();
  const handleFilterField = useFilterField();
  const activeFieldSettings = useActiveFieldSetting();
  const deleteField = useDeleteField(field.id, datasheetId);
  const commandManager = resourceService.instance!.commandManager;
  /**
   * 协同过程中，字段被删除给出警告。提前结束渲染。
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

  const {
    fieldPropertyEditable,
    descriptionEditable,
    fieldCreatable,
    fieldRemovable,
    editable,
    fieldSortable,
    fieldPermissionManageable,
  } = permissions;

  const fieldError = Boolean(Field.bindModel(field).validateProperty().error);
  const showFieldName = getShowFieldName(field.name);
  // 特殊判断，当关联字段出错的时候，需要允许用户删除当前关联字段
  const linkedFieldError = field.type === FieldType.Link && fieldError;

  function addField(index: number, fieldId: string, offset: number) {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddFields,
      data: [{
        data: {
          name: getUniqName(FieldTypeDescriptionMap[FieldType.Text].title, Object.keys(fieldMap).map(id => fieldMap[id].name)),
          type: FieldType.Text,
          property: null,
        },
        viewId: view.id,
        index,
        fieldId,
        offset,
      }],
    });
    if (ExecuteResult.Success === result.result) {
      notifyWithUndo(t(Strings.toast_insert_field_success), NotifyKey.InsertField);
    }
  }

  function copyField(index: number, fieldId: string, offset: number) {
    const result = commandManager.execute({
      cmd: CollaCommandName.AddFields,
      copyCell: true,
      fieldId: field.id,
      data: [{
        data: {
          name: getUniqName(
            field.name + t(Strings.copy),
            Object.keys(fieldMap).map(id => fieldMap[id].name),
          ),
          type: field.type,
          property: field.property,
        },
        viewId: view.id,
        index: index,
        fieldId,
        offset,
      }],
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
        icon: <EditDescribeOutlined color={colors.thirdLevelText} />,
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
        disabled: !fieldPermissionManageable,
        hidden(arg) {
          const { props: { fieldId }} = arg;

          if (!fieldId) {
            return true;
          }

          if (!fieldPermissionManageable || !fieldIndex) {
            return true;
          }

          return Boolean(
            (
              fieldPermissionMap &&
              !fieldPermissionMap[fieldId] &&
              Object.keys(fieldPermissionMap).length > getMaxFieldCountPerSheet()
            ),
          );
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
        icon: <CopyOutlined color={colors.thirdLevelText} />,
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
        icon: <HideFilled color={colors.thirdLevelText} />,
        text: t(Strings.hide_fields),
        hidden: !editable || fieldIndex === 0 || Boolean(mirrorId),
        onClick: hiddenField,
      },
      {
        icon: <FilterOutlined color={colors.thirdLevelText} />,
        text: t(Strings.filter_fields, { field_name: showFieldName }),
        hidden: !editable || Boolean(mirrorId),
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
