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

import classNames from 'classnames';
import * as React from 'react';
import { useContext, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, LinkButton, useContextMenu, useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  Field,
  FieldType,
  IAttachmentValue,
  ICellValue,
  IFieldMap,
  IGridViewProperty,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@apitable/core';
import { AddOutlined, InfoCircleOutlined, MoreOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { useAppendField } from 'pc/components/expand_record/hooks/use_append_field';
import { useEditDesc } from 'pc/components/expand_record/hooks/use_edit_desc';
import { useEditField } from 'pc/components/expand_record/hooks/use_edit_field';
import { FieldPermissionLockEnhance } from 'pc/components/field_permission';
import { getCopyField } from 'pc/components/multi_grid/context_menu/utils';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { renderComputeFieldError } from 'pc/components/multi_grid/header';
import { useDeleteField, useHideField } from 'pc/components/multi_grid/hooks';
import { BulkDownload } from 'pc/components/preview_file/preview_main/bulk_download';
import { useAllowDownloadAttachment } from 'pc/components/upload_modal/preview_item';
import { useResponsive } from 'pc/hooks';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import EditorTitleContext from '../editor_title_context';
import { FieldDescWithTitle } from './field_desc_with_title';
// @ts-ignore
import { MobileAlarm } from 'enterprise/alarm/mobile_alarm/mobile_alarm';
import styles from './style.module.less';

interface IFieldTitleProps {
  isFocus?: boolean;
  recordId?: string;
  fieldId: string;
  datasheetId: string;
  onMouseDown?(e: React.MouseEvent): void;
  hideDesc?: boolean;
  cellValue?: ICellValue;
  hideLock?: boolean;
  marker?: boolean;
  iconColor?: string;
  hover?: boolean;
  hideRequired?: boolean;
  editable?: boolean;
  showAlarm?: boolean;
  allowToInsertField?: boolean;
  colIndex?: number;
  fieldMap?: IFieldMap;
  showFieldSetting?: boolean;
}

export interface IFieldDescCollapseStatus {
  [dstId: string]: {
    collapseAll: boolean;
    fieldDescCollapseMap: { [fieldId: string]: boolean };
  };
}

export const FieldTitle: React.FC<React.PropsWithChildren<IFieldTitleProps>> = (props) => {
  const {
    isFocus,
    recordId,
    fieldId,
    datasheetId,
    onMouseDown,
    hideDesc,
    cellValue,
    hideLock,
    marker,
    iconColor,
    hover,
    hideRequired,
    showAlarm,
    allowToInsertField,
    colIndex,
    fieldMap,
    showFieldSetting,
  } = props;
  const [openAlarm, setOpenAlarm] = useState(false);

  const field = useAppSelector((state) => Selectors.getField(state, fieldId, datasheetId));
  const view = useAppSelector((state) => Selectors.getCurrentView(state, datasheetId))!;
  const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);
  const permission = useAppSelector((state) => Selectors.getPermissions(state, datasheetId, fieldId));
  const nodeId = useAppSelector((state) => state.pageParams.nodeId);
  const userTimeZone = useAppSelector(Selectors.getUserTimeZone)!;

  const allowDownload = useAllowDownloadAttachment(fieldId);
  const dispatch = useDispatch();
  const { screenIsAtMost } = useResponsive();
  const handleHideField = useHideField(view, 'hidden', datasheetId);
  const titleRef = useRef<HTMLDivElement>(null);
  const { show: showMenu } = useContextMenu({ id: ConfigConstant.ContextMenuType.EXPAND_RECORD_FIELD });
  const { fieldDescCollapseStatusMap = {}, setFieldDescCollapseStatusMap } = useContext(EditorTitleContext);
  const deleteField = useDeleteField(fieldId, datasheetId);
  const onAppendField = useAppendField(datasheetId);
  const onEditField = useEditField({ datasheetId, fieldId, colIndex });
  const onEditDesc = useEditDesc({ datasheetId, fieldId, colIndex });
  const fieldPermissionMap = useAppSelector((state) => Selectors.getFieldPermissionMap(state, datasheetId));

  const { type: viewType, autoHeadHeight } = (view || {}) as IGridViewProperty;
  const isTitleWrap = [ViewType.Grid, ViewType.Gantt].includes(viewType) && autoHeadHeight;
  const { descriptionEditable, fieldCreatable, fieldPropertyEditable, editable, fieldRemovable, manageable } = permission;

  const colors = useThemeColors();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const copyField = fieldMap ? getCopyField(field, fieldMap, view.id, datasheetId) : () => {};
  const firstColumnId = view.columns[0].fieldId;
  const columnIndexOfView = view.columns.findIndex((col) => col.fieldId === fieldId);

  const hiddenField = () => {
    dispatch(StoreActions.clearSelection(datasheetId));
    handleHideField([field.id], true);
  };

  const fieldError = useMemo(() => {
    return Boolean(Field.bindModel(field).validateProperty().error);
  }, [field]);

  const fieldDescCollapseStatus = fieldDescCollapseStatusMap[datasheetId];
  const collapseAllFiledDesc = Boolean(fieldDescCollapseStatus?.collapseAll);
  const fieldDescCollapseMap = fieldDescCollapseStatus?.fieldDescCollapseMap || {};
  const fieldDescCollapse = fieldDescCollapseMap[fieldId];
  const showDesc = useMemo(() => {
    if (!hideDesc) {
      if (fieldDescCollapse == null) {
        return !collapseAllFiledDesc;
      }
      return !fieldDescCollapse;
    }
    return false;
  }, [fieldDescCollapse, collapseAllFiledDesc, hideDesc]);

  const toggleCollapseDesc = () => {
    setFieldDescCollapseStatusMap({
      ...fieldDescCollapseStatusMap,
      [datasheetId]: {
        ...fieldDescCollapseStatus,
        fieldDescCollapseMap: {
          ...fieldDescCollapseMap,
          [fieldId]: !fieldDescCollapse,
        },
      },
    });
  };
  const columnHidden = view.columns[columnIndexOfView]?.hidden;
  const onShowMenu = (e: MouseEvent) => {
    showMenu(e as any, {
      props: {
        onInsertAbove: firstColumnId !== fieldId ? () => onAppendField(e, Number(columnIndexOfView) - 1, columnHidden) : null,
        onInsertBelow: () => onAppendField(e, Number(columnIndexOfView), columnHidden),
        onEdit: () => onEditField(e),
        onEditDesc: () => onEditDesc(e),
        onCopyField:
          !fieldCreatable || fieldError || !fieldPropertyEditable ? null : () => copyField(Number(columnIndexOfView) + 1, field.id, 1, columnHidden),
        onHiddenField: !editable || firstColumnId === fieldId || columnHidden ? null : () => hiddenField(),
        onDeleteField: !((fieldRemovable && firstColumnId !== fieldId) || (fieldError && field.type === FieldType.Link)) ? null : () => deleteField(),
      },
    });
  };

  return (
    <>
      <div className={classNames('fieldTitleWrap', styles.fieldTitleWrap)} data-required={!hideRequired && field.required}>
        <div
          {...(marker ? { id: field.id } : {})}
          ref={titleRef}
          onMouseDown={onMouseDown}
          className={classNames(styles.fieldTitle, 'fieldTitle', {
            [styles.hover]: hover,
            [styles.wrap]: isTitleWrap,
          })}
        >
          <div className={styles.iconType}>
            {getFieldTypeIcon(field.type, iconColor ? iconColor : isFocus ? colors.primaryColor : colors.thirdLevelText)}
          </div>
          <div style={{ color: isFocus ? colors.primaryColor : '' }} className={classNames(isTitleWrap ? styles.wrapName : styles.text)}>
            {field.name}
          </div>

          {!hideDesc &&
            (Field.bindModel(field).isComputed || field.type === FieldType.Cascader) &&
            renderComputeFieldError(field, t(Strings.field_configuration_err), isMobile)}

          {field.desc && !hideDesc && (
            <div className={styles.iconDisplayIcon} onMouseDown={stopPropagation}>
              <span onClick={toggleCollapseDesc}>{showDesc ? <InfoCircleOutlined /> : <InfoCircleOutlined />}</span>
            </div>
          )}
        </div>
        <div className={classNames('right', styles.right)}>
          {field.type === FieldType.Attachment && (cellValue as IAttachmentValue[])?.length && !isMobile && allowDownload && (
            <BulkDownload files={cellValue as IAttachmentValue[]} className="more" datasheetId={datasheetId} />
          )}

          {!hideLock && <FieldPermissionLockEnhance fieldId={fieldId} className="more" />}

          {allowToInsertField &&
            manageable &&
            (!fieldPermissionMap || !fieldPermissionMap[fieldId] || fieldPermissionMap[fieldId].manageable) &&
            !mirrorId &&
            nodeId && (
            <div className={styles.buttonsGroup} style={{ display: showFieldSetting ? 'flex' : '' }}>
              <Tooltip title={t(Strings.insert_new_field_below)}>
                <IconButton
                  component="button"
                  shape="square"
                  icon={() => <AddOutlined size={16} color={colors.fc3} />}
                  onClick={(e) => onAppendField(e, Number(columnIndexOfView), columnHidden)}
                />
              </Tooltip>
              <Tooltip title={t(Strings.config)}>
                <IconButton
                  component="button"
                  shape="square"
                  icon={() => <MoreOutlined size={16} color={colors.fc3} />}
                  onClick={(e) => onShowMenu(e)}
                />
              </Tooltip>
            </div>
          )}

          {showAlarm && field.type === FieldType.DateTime && isMobile && Boolean(cellValue) && (
            <LinkButton underline={false} onClick={() => setOpenAlarm(true)}>
              {t(Strings.task_reminder_entry)}
            </LinkButton>
          )}
        </div>

        {Boolean(recordId) && openAlarm && (
          <MobileAlarm
            datasheetId={datasheetId}
            recordId={recordId!}
            fieldId={fieldId}
            setOpenAlarm={setOpenAlarm}
            includeTime={field.property.includeTime}
            timeZone={field.property.timeZone || userTimeZone}
            cellValue={cellValue}
          />
        )}
      </div>
      {field.desc && Boolean(recordId) && showDesc && <FieldDescWithTitle field={field} datasheetId={datasheetId} readOnly={!descriptionEditable} />}
    </>
  );
};
