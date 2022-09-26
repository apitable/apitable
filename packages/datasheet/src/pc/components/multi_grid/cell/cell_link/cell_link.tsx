import { useThemeColors } from '@vikadata/components';
import { Field, ILinkField, LinkField, RowHeightLevel, Selectors, StatusCode, Strings, t } from '@vikadata/core';
import { AddOutlined } from '@vikadata/icons';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { ButtonPlus, Message, Tooltip } from 'pc/components/common';
import { expandRecord } from 'pc/components/expand_record';
import { useGetViewByIdWithDefault } from 'pc/hooks';
import { store } from 'pc/store';
import { stopPropagation } from 'pc/utils';
import { getDatasheetOrLoad } from 'pc/utils/get_datasheet_or_load';
import { loadRecords } from 'pc/utils/load_records';
import * as React from 'react';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IconClose from 'static/icon/datasheet/datasheet_icon_exit.svg';
import styles from '../cell_options/style.module.less';
import { ICellComponentProps } from '../cell_value/interface';
import { OptionalCellContainer } from '../optional_cell_container/optional_cell_container';
import optionalStyle from '../optional_cell_container/style.module.less';

const NO_DATA = Symbol('NO_DATA');
const ERROR_DATA = Symbol('ERROR_DATA');
const NO_PERMISSION = Symbol('NO_PERMISSION');

// 暂定单元格内最多显示20个关联记录的节点
// TODO: 结合单元格大小和数据动态展示节点数及省略符
const MAX_SHOW_LINK_IDS_COUNT = 20;

interface ICellLink extends ICellComponentProps {
  field: ILinkField;
  keyPrefix?: string;
  rowHeightLevel?: RowHeightLevel;
  datasheetId?: string;
}

export const CellLink: React.FC<ICellLink> = props => {
  const {
    onChange, isActive, cellValue, field: propsField, toggleEdit, className, readonly, keyPrefix, rowHeightLevel,
  } = props;
  const colors = useThemeColors();
  // 编辑关联字段，需要两张表都有编辑权限。
  const [showTip, setShowTip] = useState(false);
  const field = Selectors.findRealField(store.getState(), propsField);
  const linkRecordIds = field ? (Field.bindModel(field).validate(cellValue) ? (cellValue as string[]).slice(0, MAX_SHOW_LINK_IDS_COUNT) : undefined) :
    [];

  const allowShowTip = readonly && isActive;

  const foreignView = useGetViewByIdWithDefault(propsField.property.foreignDatasheetId, propsField.property.limitToView);
  const hasLimitToView = Boolean(propsField.property.limitToView && foreignView?.id === propsField.property.limitToView);

  /**
   * 为了单元格能够监听到 foreignDatasheet record 值的变化，更新视图
   */
  const cellStringList = useSelector(state => {

    const emptyRecords: string[] = [];
    if (linkRecordIds && field) {
      const datasheet = getDatasheetOrLoad(state, field.property.foreignDatasheetId);
      const isLoading = Selectors.getDatasheetLoading(state, field.property.foreignDatasheetId);
      const datasheetClient = Selectors.getDatasheetClient(state, field.property.foreignDatasheetId);
      const snapshot = datasheet && datasheet.snapshot;
      const datasheetErrorCode = Selectors.getDatasheetErrorCode(state, field.property.foreignDatasheetId);
      const strList = linkRecordIds.map(recordId => {
        if (datasheetErrorCode === StatusCode.NODE_NOT_EXIST) {
          return NO_PERMISSION;
        }
        if (!snapshot) {
          return ERROR_DATA;
        }

        if (!snapshot.recordMap[recordId]) {
          if (!isLoading && datasheetClient!.loadingRecord[recordId] === 'error') {
            return ERROR_DATA;
          }
          emptyRecords.push(recordId);
          return NO_DATA;
        }
        return (Field.bindModel(field) as LinkField).getLinkedRecordCellString(recordId);
      });

      /**
       * 因为前端只维护了关联表中一部分已经进行关联的数据，
       * 当检查到当前表关联的 recordId 不存在于关联表 snapshot 中的时候，说明本条关联记录是一条新增的关联记录。
       * 此时需要将这条新增关联记录的 record 数据加载到关联表 snapshot 中。
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
     * linkRecordIds 限制了个数，是不完整的数据
     * 这里使用完整的 cellValue 来进行数据处理
     */
    const value = (cellValue as string[]).filter((_, idx) => {
      return idx !== index;
    });

    onChange && onChange(value.length === 0 ? null : value);
  }

  function showDeleteIcon(index?: number) {
    if (isActive && !readonly) {
      return (
        <div className={styles.iconDelete} onClick={e => deleteItem(e, index)}>
          <IconClose width={8} height={8} fill={colors.secondLevelText} />
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
    // 判断关联表权限
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
      recordIds: linkRecordIds!.map(recordId => recordId),
      viewId: hasLimitToView ? foreignView?.id : undefined,
      datasheetId: field.property.foreignDatasheetId,
    });
  }

  const canAddLinkRecord = (field && !field.property.limitSingleRecord) ||
    linkRecordIds == null || !linkRecordIds.length;

  function renderText(linkRecordIds?: string[]) {
    if (isEmpty(linkRecordIds)) {
      return <></>;
    }
    return (
      <>
        {
          linkRecordIds!.map((id, index) => {
            const text = cellStringList[index];
            console.log({ text });
            return (
              <div
                className={classNames(styles.tabItem, styles.link, 'link')}
                style={{
                  pointerEvents: isActive ? 'initial' : 'none',
                }}
                key={keyPrefix ? `${keyPrefix}-${index}` : id}
                onClick={e => expand(e, id)}
              >
                {
                  text && (typeof text === 'string') ? (
                    <div className={classNames(styles.optionText)}>
                      {text}
                    </div>
                  ) : (
                    <div className={classNames(styles.optionText, styles.unnamed)}>
                      {text === NO_DATA && t(Strings.loading)}
                      {text === ERROR_DATA && t(Strings.record_fail_data)}
                      {text === NO_PERMISSION && t(Strings.link_record_no_permission)}
                      {!text && t(Strings.record_unnamed)}
                    </div>
                  )
                }
                {
                  showDeleteIcon(index)
                }
              </div>
            );
          })
        }
      </>
    );
  }

  function dbClick() {
    if (allowShowTip) {
      // 有本表的编辑权限，但是没有关联表的编辑权限
      setShowTip(true);
      setTimeout(() => {
        setShowTip(false);
      }, 3000);
      return;
    }
    !readonly && toggleEdit && toggleEdit();
  }

  const MainLayout = () => {
    return (
      <OptionalCellContainer
        onDoubleClick={dbClick}
        className={className}
        displayMinWidth={Boolean(isActive && canAddLinkRecord && !readonly)}
        viewRowHeight={rowHeightLevel}
      >
        {(isActive && canAddLinkRecord) && !readonly &&
          <ButtonPlus.Icon
            className={optionalStyle.iconAdd}
            onClick={toggleEdit}
            size={'x-small'}
            icon={<AddOutlined color={colors.fourthLevelText} />}
          />
        }
        {renderText(linkRecordIds)}

      </OptionalCellContainer>
    );
  };

  // Tooltip 只在必要的时候 render 以提升性能
  return showTip ? (
    <Tooltip title={t(Strings.no_link_ds_permission)} visible={showTip} placement={'top'}>
      {MainLayout()}
    </Tooltip>
  ) : MainLayout();
};
