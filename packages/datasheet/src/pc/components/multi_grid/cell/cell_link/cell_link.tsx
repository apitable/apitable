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
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { useContext, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useThemeColors } from '@apitable/components';
import { Field, ILinkField, IOneWayLinkField, LinkField, RowHeightLevel, Selectors, StatusCode, Strings, t } from '@apitable/core';
import { AddOutlined, CloseOutlined } from '@apitable/icons';
// eslint-disable-next-line no-restricted-imports
import { ButtonPlus, Message, Tooltip } from 'pc/components/common';
import { ExpandLinkContext } from 'pc/components/expand_record/expand_link/expand_link_context';
import { expandRecord } from 'pc/components/expand_record/expand_record.utils';
import { useGetViewByIdWithDefault } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { getDatasheetOrLoad } from 'pc/utils/get_datasheet_or_load';
import { loadRecords } from 'pc/utils/load_records';
import styles from '../cell_options/style.module.less';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import optionalStyle from '../optional_cell_container/style.module.less';

const NO_DATA = Symbol('NO_DATA');
const ERROR_DATA = Symbol('ERROR_DATA');
const ARCHIVED_DATA = Symbol('ARCHIVED_DATA');
const NO_PERMISSION = Symbol('NO_PERMISSION');

// Tentatively display up to 20 nodes of associated records in a cell
// TODO: Dynamically display the number of nodes and omitted characters in combination with cell size and data
const MAX_SHOW_LINK_IDS_COUNT = 20;

interface ICellLink extends ICellComponentProps {
  field: ILinkField | IOneWayLinkField;
  keyPrefix?: string;
  rowHeightLevel?: RowHeightLevel;
  datasheetId?: string;
}

export const CellLink: React.FC<React.PropsWithChildren<ICellLink>> = (props) => {
  const { onChange, isActive, cellValue, field: propsField, toggleEdit, className, readonly, keyPrefix, rowHeightLevel } = props;
  const colors = useThemeColors();
  // To edit an link field, you need to have edit permission on both datasheets.
  const [showTip, setShowTip] = useState(false);
  const field = Selectors.findRealField(store.getState(), propsField);
  const linkRecordIds = field
    ? Field.bindModel(field).validate(cellValue)
      ? (cellValue as string[]).slice(0, MAX_SHOW_LINK_IDS_COUNT)
      : undefined
    : [];
  const { ignoreMirror, baseDatasheetId } = useContext(ExpandLinkContext) || {};

  const allowShowTip = readonly && isActive;

  const foreignView = useGetViewByIdWithDefault(propsField.property.foreignDatasheetId, propsField.property.limitToView);
  const hasLimitToView = Boolean(propsField.property.limitToView && foreignView?.id === propsField.property.limitToView);
  /**
   * In order for the cell to listen to changes in the foreignDatasheet record value, update the view
   */
  const cellStringList = useAppSelector((state) => {
    const emptyRecords: string[] = [];
    if (linkRecordIds && field) {
      const datasheet = getDatasheetOrLoad(state, field.property.foreignDatasheetId, baseDatasheetId, undefined, undefined, ignoreMirror);
      const isLoading = Selectors.getDatasheetLoading(state, field.property.foreignDatasheetId);
      const datasheetClient = Selectors.getDatasheetClient(state, field.property.foreignDatasheetId);
      const snapshot = datasheet && datasheet.snapshot;
      const archivedRecordIds = snapshot?.meta.archivedRecordIds || [];
      const datasheetErrorCode = Selectors.getDatasheetErrorCode(state, field.property.foreignDatasheetId);
      const strList = linkRecordIds.map((recordId) => {
        const cellString = (Field.bindModel(field) as LinkField).getLinkedRecordCellString(recordId);
        if (cellString === null && datasheetErrorCode === StatusCode.NODE_NOT_EXIST) {
          return NO_PERMISSION;
        }
        if (!snapshot) {
          return ERROR_DATA;
        }

        if (!snapshot.recordMap[recordId]) {
          if (archivedRecordIds.includes(recordId)) {
            return ARCHIVED_DATA;
          }
          if (!isLoading && datasheetClient!.loadingRecord[recordId] === 'error') {
            return ERROR_DATA;
          }
          emptyRecords.push(recordId);
          return NO_DATA;
        }
        return cellString;
      });

      /**
       * Because the front-end only maintains a portion of the data in the link datasheet that has already been link.
       * When the recordId of the current datasheet link does not exist in the link datasheet snapshot,
       * it means that this link record is a new link record.
       * In this case, you need to load the record data of this new link record into the link datasheet snapshot.
       */
      if (emptyRecords.length && datasheet) {
        loadRecords(datasheet.id, emptyRecords);
      }
      return strList;
    }
    return [];
  }, shallowEqual);

  function deleteItem(e: React.MouseEvent, index?: number) {
    stopPropagation(e);
    if (!onChange || !cellValue) {
      return;
    }
    /**
     * linkRecordIds are limited in number and are incomplete data.
     * Here the complete cellValue is used for data processing.
     */
    const value = (cellValue as string[]).filter((_, idx) => {
      return idx !== index;
    });

    onChange && onChange(value.length === 0 ? null : value);
  }

  function showDeleteIcon(index?: number) {
    if (isActive && !readonly) {
      return (
        <div className={styles.iconDelete} onClick={(e) => deleteItem(e, index)}>
          <CloseOutlined size={8} color={colors.secondLevelText} />
        </div>
      );
    }
    return <></>;
  }

  function expand(e: React.MouseEvent<HTMLDivElement>, recordId: string) {
    if (!field) {
      return;
    }
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const state = store.getState();
    const readable = Selectors.getPermissions(state, field.property.foreignDatasheetId).readable;
    if (!readable && field.property.foreignDatasheetId) {
      Message.warning({
        content: t(Strings.disabled_expand_link_record),
      });
      return;
    }
    expandRecord({
      activeRecordId: recordId,
      recordIds: linkRecordIds!.map((recordId) => recordId),
      viewId: hasLimitToView ? foreignView?.id : undefined,
      datasheetId: field.property.foreignDatasheetId,
    });
  }

  const canAddLinkRecord = (field && !field.property.limitSingleRecord) || linkRecordIds == null || !linkRecordIds.length;

  function renderText(linkRecordIds?: string[]) {
    if (isEmpty(linkRecordIds)) {
      return <></>;
    }
    return (
      <>
        {linkRecordIds!.map((id, index) => {
          const text = cellStringList[index];
          const isDisabled = text === ERROR_DATA || text === ARCHIVED_DATA;
          return (
            <div
              className={classNames(styles.tabItem, styles.link, 'link')}
              style={{
                pointerEvents: (isActive && !isDisabled) ? 'initial' : 'none',
              }}
              key={keyPrefix ? `${keyPrefix}-${index}` : id}
              onClick={(e) => !isDisabled && expand(e, id)}
            >
              {text && typeof text === 'string' ? (
                <div className={classNames(styles.optionText)}>{text}</div>
              ) : (
                <div className={classNames(styles.optionText, styles.unnamed)}>
                  {text === NO_DATA && t(Strings.loading)}
                  {text === ERROR_DATA && t(Strings.record_fail_data)}
                  {text === ARCHIVED_DATA && t(Strings.record_archived_data)}
                  {text === NO_PERMISSION && t(Strings.link_record_no_permission)}
                  {!text && t(Strings.record_unnamed)}
                </div>
              )}
              {showDeleteIcon(index)}
            </div>
          );
        })}
      </>
    );
  }

  async function dbClick() {
    if (allowShowTip) {
      // Edit access to this datasheet, but no edit access to related datasheet
      setShowTip(true);
      setTimeout(() => {
        setShowTip(false);
      }, 3000);
      return;
    }
    !readonly && toggleEdit && (await toggleEdit());
  }

  const MainLayout = () => {
    return (
      <OptionalCellContainer
        onDoubleClick={dbClick}
        className={className}
        displayMinWidth={Boolean(isActive && canAddLinkRecord && !readonly)}
        viewRowHeight={rowHeightLevel}
      >
        {isActive && canAddLinkRecord && !readonly && (
          <ButtonPlus.Icon
            className={optionalStyle.iconAdd}
            onClick={toggleEdit}
            size={'x-small'}
            icon={<AddOutlined color={colors.fourthLevelText} />}
          />
        )}
        {renderText(linkRecordIds)}
      </OptionalCellContainer>
    );
  };

  return showTip ? (
    <Tooltip title={t(Strings.no_link_ds_permission)} visible={showTip} placement={'top'}>
      {MainLayout()}
    </Tooltip>
  ) : (
    MainLayout()
  );
};
