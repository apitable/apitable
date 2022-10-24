import {
  CollaCommandName,
  Field,
  getFieldResultByStatType, getStatTypeList,
  Group,
  IGridViewColumn,
  IGridViewProperty,
  ILinearRowGroupTab, IRange, IReduxState, Selectors, StatType,
  Strings, t,
} from '@apitable/core';
import classNames from 'classnames';
import { intersection } from 'lodash';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useThemeColors } from '@vikadata/components';
import { stopPropagation } from 'pc/utils';
import Trigger from 'rc-trigger';
import { useCallback, useMemo, useRef } from 'react';
import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IconArrow from 'static/icon/common/common_icon_pulldown.svg';
import styles from './styles.module.less';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';

interface IStatOption {
  fieldId: string;
  row?: ILinearRowGroupTab; // 分组上的统计栏会传入此信息
  className?: string;
  style?: React.CSSProperties;
}

// 超过 1 个格子被选中，就需要显示选区内记录的统计。
export function hasLargeSelection(range?: IRange, selectRecordRanges?: string[]) {
  if (range) {
    if (range.start.recordId !== range.end.recordId || range.start.fieldId !== range.end.fieldId) {
      return true;
    }
  }
  if (selectRecordRanges && selectRecordRanges.length > 1) {
    return true;
  }
  return false;
}

// 横向显示什么
export const getFieldStatType = (state: IReduxState, fieldId: string) => {
  const selections = Selectors.getSelectRanges(state);
  const selectRecordRanges = Selectors.getSelectionRecordRanges(state);
  const column = Selectors.getColumnByFieldId(state, fieldId) as IGridViewColumn;
  const range = selections && selections[0];
  if (!column) {
    return null;
  }
  const field = Selectors.getField(state, column.fieldId);
  const fieldStatTypeList = getStatTypeList(field, state);
  // 不展示错误的 statType
  if (column.statType && !fieldStatTypeList.includes(column.statType)) {
    return null;
  }
  // 超过一个格子被选中时，且 field 在不在选区内则不展示。
  if (hasLargeSelection(range, selectRecordRanges)) {
    if (range) {
      const rangeFields = Selectors.getRangeFields(state, range, state.pageParams.datasheetId!);
      const fieldInRange = Boolean(rangeFields && rangeFields.some(f => f.id === fieldId));
      if (!fieldInRange) {
        return null;
      }
    }
  }
  return column.statType;
};

const StatOptionBase: React.FC<IStatOption> = props => {
  const colors = useThemeColors();
  const { className, row, fieldId } = props;
  const triggerRef = useRef<any>(null);
  const state = store.getState();
  const {
    field,
    shouldUseSelectRecordAggregate,
    viewId,
    groupInfo,
    statType,
    selectRecordIds,
    fieldIndex,
    permission,
    recordIds,
    groupBreakpoint,
  } = useSelector(state => {
    const field = Selectors.getField(state, fieldId);
    const view = Selectors.getCurrentView(state) as IGridViewProperty;
    const selection = Selectors.getSelectRanges(state);
    const selectRecordRanges = Selectors.getSelectionRecordRanges(state);
    const statType = getFieldStatType(state, fieldId);
    const fieldIndex = Selectors.getVisibleColumns(state)!.findIndex(f => f.fieldId === fieldId);
    const groupInfo = Selectors.getActiveViewGroupInfo(state);
    const shouldUseSelectRecordAggregate = hasLargeSelection(selection && selection[0], selectRecordRanges);
    const selectRecordIds = Selectors.getSelectRecordIds(state);
    const recordIds: string[] = Selectors.getVisibleRowIds(state);
    const groupBreakpoint = Selectors.getGroupBreakpoint(state);

    return {
      recordIds,
      field,
      selectRecordIds,
      shouldUseSelectRecordAggregate,
      groupInfo,
      fieldIndex,
      statType,
      viewId: view.id,
      permission: Selectors.getPermissions(state),
      groupBreakpoint
    };
  }, shallowEqual);
  const fieldStatTypeList = getStatTypeList(field, state);

  // 纵向显示什么
  // TODO: 优化下性能问题，加缓存和执行条件。
  const getStatRecordIds = useCallback(() => {
    const isGroupStat = Boolean(row);
    let res = recordIds;
    // 默认是全部记录
    if (isGroupStat) {
      const groupSketch = new Group(groupInfo, groupBreakpoint);
      // 分组的统计栏，展示分组下的记录
      res = groupSketch.getRecordsInGroupByDepth(state, row!.recordId, row!.depth).map(row => row.recordId);
    }
    // 存在选区
    if (shouldUseSelectRecordAggregate) {
      if (isGroupStat) {
        return intersection(recordIds, selectRecordIds);
      }
      return selectRecordIds;
    }
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupInfo, row, shouldUseSelectRecordAggregate, selectRecordIds, recordIds, groupBreakpoint]);

  const statText = useMemo(() => {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state)!;
    if (!statType) {
      return t(Strings.statistics);
    }
    const count = getFieldResultByStatType(
      statType!,
      getStatRecordIds(),
      field,
      snapshot,
      state,
    );
    if (statType === StatType.CountAll) {
      return t(Strings.records_of_count, {
        count,
      });
    }
    const statText = Field.bindModel(field).statType2text(statType!);
    return statText + ' ' + count;
  }, [statType, getStatRecordIds, field]);

  function commandForStat(e: React.MouseEvent, newStatType: StatType) {
    const commandManager = resourceService.instance!.commandManager;
    if (!statType && newStatType === StatType.None) {
      return triggerRef.current!.close(e);
    }
    executeCommandWithMirror(() => {
      commandManager.execute({
        cmd: CollaCommandName.SetColumnsProperty,
        viewId,
        fieldId: field.id,
        data: {
          statType: newStatType,
        },
      });
    }, {
      columns: Selectors.getVisibleColumns(state).map(column => column.fieldId === field.id ? { ...column, statType: newStatType } : column)
    });

    triggerRef.current!.close(e);
  }

  function statOptionList() {
    return (
      <div
        className={styles.statList}
        onWheel={stopPropagation}
        onMouseDown={stopPropagation}
      >
        {
          fieldStatTypeList && fieldStatTypeList.map((item: StatType | never) => {
            return (
              <div key={item} className={styles.statItem} onClick={e => { commandForStat(e, item); }}>
                {Field.bindModel(field).statType2text(item)}
              </div>
            );
          })
        }
      </div>
    );
  }

  return (
    <Trigger
      action={permission.columnCountEditable ? ['click'] : ['']}
      popup={statOptionList()}
      destroyPopupOnHide
      popupAlign={
        { points: ['tr', 'br'], offset: [0, 0], overflow: { adjustX: true, adjustY: true }}
      }
      popupStyle={{
        width: '150px',
        zIndex: 2,
        position: 'absolute',
      }}
      ref={triggerRef}
    >
      <div
        className={classNames(styles.statistics, className)}
        style={{
          ...(props.style ? props.style : {}),
          flex: fieldIndex !== 0 ? 1 : '',
          color: statType ? colors.thirdLevelText : '',
        }}
      >
        <div style={{ marginRight: '4px' }}>
          {statText}
        </div>
        <div style={{ width: '8px' }}>
          <IconArrow
            fill={colors.fourthLevelText} width={8} height={6}
            style={{ display: statType ? 'inline-block' : '' }}
          />
        </div>
      </div>
    </Trigger>
  );
};

export const StatOption = React.memo(StatOptionBase);
