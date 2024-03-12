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

import { useMount } from 'ahooks';
import * as React from 'react';
import { memo, useMemo, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { ContextMenu, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  CollaCommandName,
  DATASHEET_ID,
  Events,
  ExecuteResult,
  Field,
  FieldOperateType,
  FieldType,
  FieldTypeDescriptionMap,
  PermissionType,
  getMaxFieldCountPerSheet,
  getUniqName,
  isSelectField,
  Player,
  Selectors,
  SetFieldFrom,
  StoreActions,
  Strings,
  t,
  ToolBarMenuCardOpenState,
  ViewType,
  IGridViewProperty, ConfigConstant
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
  FreezeOutlined,
  GroupOutlined,
  EyeOpenOutlined,
  LockOutlined,
} from '@apitable/icons';
import { ContextName, ShortcutContext } from 'modules/shared/shortcut_key';
import { fieldChangeConfirm } from 'pc/components/common/field_change_confirm/field_change_confirm';
import { notifyWithUndo } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandFieldPermission } from 'pc/components/field_permission';
import { getCopyField, getShowFieldName } from 'pc/components/multi_grid/context_menu/utils';
import { useCacheScroll } from 'pc/context';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

import { FIELD_HEAD_CLASS } from '../../../utils/constant';
import { useActiveFieldSetting, useFilterField, useGroupField, useHideField, useSortField } from '../hooks';

interface IFieldMenuProps {
  fieldId: string;
  editFieldSetting?: (fieldId: string) => void;
  editFieldDesc?: (fieldId: string) => void;
  onFrozenColumn?: (fieldId: string, reset: boolean) => void;
}

export const FieldMenu: React.FC<React.PropsWithChildren<IFieldMenuProps>> = memo(
  ({ fieldId, editFieldSetting: _editFieldSetting, editFieldDesc: _editFieldDesc, onFrozenColumn }) => {
    const colors = useThemeColors();
    const datasheetId = useAppSelector(Selectors.getActiveDatasheetId)!;
    const fieldMap = useAppSelector((state) => Selectors.getFieldMap(state, datasheetId))!;
    const view = useAppSelector(Selectors.getCurrentView)!;
    const catalogTreeActiveType = useAppSelector((state) => state.catalogTree.activeType);
    const isPrivate = catalogTreeActiveType === ConfigConstant.Modules.PRIVATE;
    const frozenColumnCount = (view as IGridViewProperty)?.frozenColumnCount;
    const dispatch = useAppDispatch();
    const handleHideField = useHideField(view);
    const handleSortField = useSortField();
    const handleFilterField = useFilterField();
    const { groupField: handleGroupField, canGroup } = useGroupField();
    const activeFieldSettings = useActiveFieldSetting();
    const field = fieldMap[fieldId] || null;
    const fieldIndex = React.useMemo(() => {
      return view.columns.findIndex((item) => item.fieldId === fieldId);
    }, [fieldId, view]);
    const isGanttView = view.type === ViewType.Gantt;
    const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const { permissions, fieldRanges, visibleColumns } = useAppSelector((state) => {
      return {
        visibleColumns: Selectors.getVisibleColumns(state),
        permissions: Selectors.getPermissions(state, undefined, field?.id),
        fieldRanges: Selectors.getFieldRanges(state),
      };
    }, shallowEqual);
    const hasChosenMulti = fieldRanges && fieldRanges.length > 1;
    const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
    const isViewLock = Boolean(view.lockInfo);
    const embedId = useAppSelector((state) => state.pageParams.embedId);
    const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
    const isEmbedHiddenFieldPermission = embedId && embedInfo?.permissionType !== PermissionType.PRIVATEEDIT;
    const chosenCount = fieldRanges ? fieldRanges.filter((id) => id !== visibleColumns[0].fieldId).length : 1;

    const {
      fieldPropertyEditable,
      descriptionEditable,
      fieldCreatable,
      fieldRemovable,
      editable,
      fieldSortable,
      fieldPermissionManageable,
      columnWidthEditable,
    } = permissions;

    useMount(() => {
      wrapperRef.current && wrapperRef.current.focus();
    });

    const { fieldError, fieldCanGroup, showFieldName, canFilter, linkedFieldError } = useMemo(() => {
      if (!field) {
        return {
          fieldError: true,
          fieldCanGroup: false,
          showFieldName: '',
          linkedFieldError: true,
        };
      }
      const fieldError = Boolean(Field.bindModel(field).validateProperty().error);
      const fieldModel = Field.bindModel(field);
      return {
        fieldError,
        canFilter: fieldModel.canFilter,
        fieldCanGroup: Field.bindModel(field).canGroup && canGroup,
        showFieldName: getShowFieldName(field.name),
        linkedFieldError: field.type === FieldType.Link && fieldError,
      };
    }, [canGroup, field]);

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
            index: index,
            fieldId,
            offset,
          },
        ],
      });
      if (ExecuteResult.Success === result.result) {
        notifyWithUndo(t(Strings.toast_insert_field_success), NotifyKey.InsertField);
      }
    }

    const copyField = getCopyField(field, fieldMap, view.id);

    const frozenColumn = (fieldId: string) => {
      let columnIndex = view.columns.findIndex((column) => column.fieldId === fieldId);
      if (columnIndex === -1) return;

      const reset = columnIndex + 1 === frozenColumnCount ? true : false;

      if (onFrozenColumn) {
        return onFrozenColumn(fieldId, reset);
      }

      columnIndex = reset ? 0 : columnIndex;

      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetViewFrozenColumnCount,
            viewId: view.id,
            count: columnIndex + 1,
          });
        },
        {
          frozenColumnCount: columnIndex + 1,
        },
      );
    };

    function deleteField() {
      fieldChangeConfirm({
        fieldId: field.id,
        onOk: () => {
          dispatch(StoreActions.clearSelection(datasheetId));
        },
      });
    }

    const { scrollLeft } = useCacheScroll();

    function toOpenFieldDesc() {
      if (_editFieldDesc) {
        return _editFieldDesc(fieldId);
      }
      const currentField = document.querySelector(`.${FIELD_HEAD_CLASS}[data-field-id=${field.id}]`);
      const elementRect = currentField!.getBoundingClientRect();

      dispatch(
        StoreActions.setActiveFieldState(datasheetId, {
          fieldId: field.id,
          fieldRectLeft: elementRect.left,
          fieldRectBottom: elementRect.bottom,
          clickLogOffsetX: scrollLeft,
          fieldIndex,
          operate: FieldOperateType.FieldDesc,
        }),
      );
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

    function groupField() {
      const res = handleGroupField(field.id);
      if (res === ExecuteResult.Success) {
        dispatch(StoreActions.setToolbarMenuCardOpen(ToolBarMenuCardOpenState.Group));
      }
    }

    function hiddenField() {
      // Clear the selection first, and then hide the field. Otherwise a warning will pop up.
      // See here: packages/datasheet/src/pc/components/editors/attach_event_hoc.tsx:L224
      dispatch(StoreActions.clearSelection(datasheetId));
      if (hasChosenMulti) {
        handleHideField(fieldRanges || [], true);
        return;
      }
      handleHideField([field.id], true);
    }

    function editField() {
      if (_editFieldSetting) {
        return _editFieldSetting(fieldId);
      }
      activeFieldSettings(field.id, SetFieldFrom.CONTEXT_MENU);
    }

    function renderSortText(desc: boolean) {
      if (!field) {
        return '';
      }
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

    function onShown() {
      ShortcutContext.bind(ContextName.isMenuOpening, () => true);
      Player.doTrigger(Events.datasheet_field_context_shown);
    }

    function onHidden() {
      ShortcutContext.unbind(ContextName.isMenuOpening);
      Player.doTrigger(Events.datasheet_field_context_hidden);
    }

    const getFieldPermissionText = () => {
      if (!fieldPermissionMap || !fieldPermissionMap[fieldId]) {
        return t(Strings.config_field_permission);
      }
      if (fieldPermissionMap[fieldId].manageable) {
        return t(Strings.config_field_permission);
      }
      return t(Strings.view_field_permission);
    };

    if (mirrorId) {
      return null;
    }

    const menuData = flatContextData([
      [
        {
          icon: <EditOutlined color={colors.thirdLevelText} />,
          text: t(Strings.modify_field),
          hidden: !fieldPropertyEditable || hasChosenMulti,
          onClick: editField,
          id: 'modify_field',
        },
        {
          icon: <InfoCircleOutlined color={colors.thirdLevelText} />,
          text: t(Strings.editing_field_desc),
          hidden: !descriptionEditable || hasChosenMulti,
          onClick: toOpenFieldDesc,
          id: 'edit_field_desc',
        },
        {
          icon: <LockOutlined color={colors.thirdLevelText} />,
          text: getFieldPermissionText(),
          onClick: () => {
            expandFieldPermission(field);
          },
          disabled: !Boolean(fieldPermissionManageable),
          disabledTip: t(Strings.set_field_permission_no_access),
          hidden(arg: any) {
            if (!getEnvVariables().FIELD_PERMISSION_VISIBLE || isEmbedHiddenFieldPermission || isPrivate) {
              return true;
            }
            if (!arg['props']) {
              return true;
            }
            const {
              props: { fieldId },
            } = arg;
            if (!fieldId) {
              return true;
            }
            if (!fieldPermissionManageable || hasChosenMulti || !fieldIndex) {
              return true;
            }

            return Boolean(fieldPermissionMap && !fieldPermissionMap[fieldId] && Object.keys(fieldPermissionMap).length > getMaxFieldCountPerSheet());
          },
          id: 'lock',
        },
      ],
      [
        {
          icon: <ArrowLeftOutlined color={colors.thirdLevelText} />,
          text: t(Strings.insert_field_before),
          hidden: !fieldCreatable || fieldIndex === 0 || hasChosenMulti,
          onClick: () => {
            addField(fieldIndex, fieldId, 0);
          },
          id: 'insert_before',
        },
        {
          icon: <ArrowRightOutlined color={colors.thirdLevelText} />,
          text: t(Strings.insert_field_after),
          hidden: !fieldCreatable || hasChosenMulti,
          onClick: () => {
            addField(fieldIndex + 1, fieldId, 1);
          },
          id: 'insert_after',
        },
        {
          icon: <DuplicateOutlined color={colors.thirdLevelText} />,
          text: t(Strings.duplicate_field),
          disabled: () => {
            if (field?.type === FieldType.Link) {
              const foreignDatasheetEditable = Selectors.getPermissions(store.getState(), field.property.foreignDatasheetId).editable;
              return !foreignDatasheetEditable;
            }
            return false;
          },
          hidden: !fieldCreatable || fieldError || !fieldPropertyEditable || hasChosenMulti || field.type === FieldType.WorkDoc,
          onClick: () => {
            copyField(fieldIndex + 1, fieldId, 1);
          },
          id: 'duplicate_field',
        },
      ],
      [
        {
          icon: <FreezeOutlined color={colors.thirdLevelText} />,
          text: fieldIndex + 1 === frozenColumnCount ? t(Strings.freeze_column_reset) : t(Strings.freeze_current_column),
          hidden: !columnWidthEditable || isGanttView || (fieldIndex === 0 && frozenColumnCount === 1),
          onClick: () => frozenColumn(fieldId),
          id: 'freeze_column',
        },
      ],
      [
        {
          icon: <ArrowUpOutlined color={colors.thirdLevelText} />,
          text: renderSortText(false),
          hidden: !fieldSortable || hasChosenMulti,
          onClick: () => sortField(false),
          disabled: () => isViewLock,
          id: 'sort_down',
        },
        {
          icon: <ArrowDownOutlined color={colors.thirdLevelText} />,
          text: renderSortText(true),
          hidden: !fieldSortable || hasChosenMulti,
          onClick: () => sortField(true),
          disabled: () => isViewLock,
          id: 'sort_up',
        },
      ],
      [
        {
          icon: <EyeOpenOutlined color={colors.thirdLevelText} />,
          text: hasChosenMulti ? t(Strings.hidden_n_fields, { count: chosenCount }) : t(Strings.hide_one_field),
          hidden: !editable || fieldIndex === 0 || Boolean(mirrorId),
          onClick: hiddenField,
          disabled: () => isViewLock,
          id: 'chouse_multi',
        },
        {
          icon: <FilterOutlined color={colors.thirdLevelText} />,
          text: t(Strings.filter_fields, { field_name: showFieldName }),
          hidden: !editable || hasChosenMulti || Boolean(mirrorId) || !canFilter,
          onClick: filterField,
          disabled: () => isViewLock,
          id: 'filter_fields',
        },
        {
          icon: <GroupOutlined color={colors.thirdLevelText} />,
          text: t(Strings.group_fields, { field_name: showFieldName }),
          hidden: !editable || !fieldCanGroup || hasChosenMulti || Boolean(mirrorId),
          onClick: groupField,
          disabled: () => isViewLock,
          id: 'group_fields',
        },
      ],
      [
        {
          icon: <DeleteOutlined color={colors.thirdLevelText} />,
          text: hasChosenMulti ? t(Strings.delete_n_columns, { count: chosenCount }) : t(Strings.delete_field),
          hidden: !((fieldRemovable && fieldIndex !== 0) || linkedFieldError),
          onClick: deleteField,
          id: 'delete_column',
        },
      ],
    ]);

    return <ContextMenu menuId={DATASHEET_ID.FIELD_CONTEXT} onShown={onShown} onClose={onHidden} overlay={menuData} menuSubSpaceHeight={40} />;
  },
);
