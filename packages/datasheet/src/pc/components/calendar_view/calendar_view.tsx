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
import dayjs from 'dayjs';
import { FC, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual, useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { Button, Calendar, Tooltip, useThemeColors } from '@apitable/components';
import {
  BasicValueType,
  CacheManager,
  CollaCommandName,
  ConfigConstant,
  DATASHEET_ID,
  defaultCalendarViewStatus as defaultViewStatus,
  Field,
  FieldType,
  ICalendarViewStatus,
  IField,
  ISetRecordOptions,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { ClearOutlined, ListOutlined, WarnCircleFilled } from '@apitable/icons';
import { RecordMenu } from 'pc/components/multi_grid/context_menu/record_menu';
import { setColor } from 'pc/components/multi_grid/format';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage';
import { VikaSplitPanel } from '../common';
import { ScreenSize } from '../common/component_display/enum';
import { AddRecord } from '../mobile_grid/add_record';
import { CalendarContext } from './calendar_context';
import { CalendarMonthPicker } from './calendar_month_picker';
import { CalendarSettingPanel } from './calendar_setting_panel';
import { CALENDAR_RECORD_MENU, DEFAULT_FIELD_HEIGHT, DEFAULT_TITLE_HEIGHT, FieldTypeHeight } from './constants';
import { CreateFieldModal } from './create_field_modal';
import { Drag } from './drag';
import { Drop } from './drop';
import { RecordList } from './record_list';
import styles from './styles.module.less';

interface ICalendarViewProps {
  height: number;
  width: number;
}

export const CalendarView: FC<React.PropsWithChildren<ICalendarViewProps>> = () => {
  const colors = useThemeColors();
  const [keyword, setKeyword] = useState<string>('');
  const {
    calendarViewStatus,
    datasheetId,
    calendarStyle,
    spaceId,
    snapshot,
    view,
    fieldMap,
    visibleRows,
    ignoreSearchRows,
    columns,
    entityFieldMap,
    permissions,
    currentSearchRecordId,
    getCellValue,
    isSearching,
    fieldPermissionMap,
    viewId,
    cacheTheme,
    activeCell,
  } = useAppSelector((state) => {
    const dstId = Selectors.getActiveDatasheetId(state)!;
    const currSnapshot = Selectors.getSnapshot(state, dstId)!;
    const currView = Selectors.getCurrentView(state)!;
    const getCurrCellValue = (rId: string, fId: string) => Selectors.getCellValue(state, snapshot, rId, fId);

    return {
      calendarViewStatus: Selectors.getCalendarViewStatus(state, dstId)!,
      datasheetId: dstId,
      calendarStyle: Selectors.getCalendarStyle(state)!,
      spaceId: state.space.activeId!,
      snapshot: currSnapshot,
      view: currView,
      fieldMap: Selectors.getFieldMap(state, dstId)!,
      visibleRows: Selectors.getVisibleRows(state),
      ignoreSearchRows: Selectors.getVisibleRowsWithoutSearch(state),
      columns: Selectors.getCalendarVisibleColumns(state),
      entityFieldMap: Selectors.getFieldMapIgnorePermission(state)!,
      permissions: Selectors.getPermissions(state),
      currentSearchRecordId: Selectors.getCurrentSearchRecordId(state),
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      getCellValue: getCurrCellValue,
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
      viewId: Selectors.getActiveViewId(state),
      cacheTheme: Selectors.getTheme(state),
      activeCell: Selectors.getActiveCell(state),
    };
  }, shallowEqual);

  const isDateTimeField = (field?: IField) => {
    return field ? [Field.bindModel(field).basicValueType, Field.bindModel(field).innerBasicValueType].includes(BasicValueType.DateTime) : false;
  };
  const dateTypeAccessibleFields = Object.values(entityFieldMap).filter((field) => {
    const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, field.id);
    const isCryptoField = Boolean(fieldRole && fieldRole === ConfigConstant.Role.None);
    return isDateTimeField(field) && !isCryptoField;
  });
  const { cellEditable: editable, rowCreatable, visualizationEditable } = permissions;
  const firstFieldId = snapshot.meta.views[0]!.columns[0]!.fieldId;
  const { gridVisible, gridWidth, settingPanelVisible: _settingPanelVisible, settingPanelWidth } = calendarViewStatus;
  const settingPanelVisible = (visualizationEditable || editable) && _settingPanelVisible;
  const { startFieldId, endFieldId, colorOption, isColNameVisible } = calendarStyle;
  const startFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, startFieldId);
  const endFieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, endFieldId);
  const isReaderStartField = Boolean(startFieldRole && startFieldRole === ConfigConstant.Role.Reader);
  const isReaderEndField = Boolean(endFieldRole && endFieldRole === ConfigConstant.Role.Reader);
  const isCryptoStartField = Boolean(startFieldRole && startFieldRole === ConfigConstant.Role.None);
  const isCryptoEndField = Boolean(endFieldRole && endFieldRole === ConfigConstant.Role.None);
  const { color } = colorOption;
  const listColor = useMemo(() => {
    return color === -1 ? null : setColor(color, cacheTheme);
  }, [cacheTheme, color]);
  const startField = fieldMap[startFieldId];
  const endField = fieldMap[endFieldId];
  const dispatch = useDispatch();
  const mirrorId = useAppSelector((state) => state.pageParams.mirrorId);

  useEffect(() => {
    /**
     * Initialize CalendarStatus related data
     * Read from cache if local cache is available
     * If there is no local cache, the initial data in Redux is stored in the local cache
     */
    const storeCalendarStatus = getStorage(StorageName.CalendarStatusMap);
    const calendarStatus = storeCalendarStatus?.[`${spaceId}_${datasheetId}_${view.id}`] || {};
    const defaultCalendarViewStatus = {
      ...defaultViewStatus,
      ...calendarStatus,
    };
    dispatch(
      batchActions([
        StoreActions.toggleCalendarGuideStatus(defaultCalendarViewStatus.guideStatus, datasheetId),
        StoreActions.toggleCalendarGrid(defaultCalendarViewStatus.gridVisible, datasheetId),
        StoreActions.toggleCalendarSettingPanel(mirrorId ? false : defaultCalendarViewStatus.settingPanelVisible, datasheetId),
        StoreActions.setCalendarGridWidth(defaultCalendarViewStatus.gridWidth, datasheetId),
        StoreActions.setCalendarSettingPanelWidth(defaultCalendarViewStatus.settingPanelWidth, datasheetId),
      ]),
    );
    // eslint-disable-next-line
  }, [view?.id]);

  const onGlobalMouseDown = () => {
    if (!activeCell) return;
    dispatch(StoreActions.clearSelection(datasheetId));
    dispatch(StoreActions.clearActiveRowInfo(datasheetId));
  };

  // Clean up the move column data
  useEffect(() => {
    document.addEventListener('mousedown', onGlobalMouseDown);
    return () => {
      document.removeEventListener('mousedown', onGlobalMouseDown);
    };
  });

  const isStartDateTimeField = isDateTimeField(startField);
  const isEndDateTimeField = isDateTimeField(endField);
  const isStartDisabled = isReaderStartField || (startField ? startField.type !== FieldType.DateTime : true);
  const isEndDisabled = isReaderEndField || (endField ? endField.type !== FieldType.DateTime : true);

  const draggable = ((startField || endField) &&
    !isReaderStartField &&
    !isReaderEndField &&
    (startField ? startField.type === FieldType.DateTime : true) &&
    (endField ? endField.type === FieldType.DateTime : true))!;

  const listRecords = useMemo(() => {
    const records: {
      id: string;
    }[] = [];
    ignoreSearchRows.forEach(({ recordId }) => {
      const startTime = getCellValue(recordId, startFieldId);
      const endTime = getCellValue(recordId, endFieldId);
      const startDate = startTime && isStartDateTimeField ? new Date(startTime) : null;
      const endDate = endTime && isEndDateTimeField ? new Date(endTime) : null;
      if (!startDate && !endDate) {
        records.push({
          id: recordId,
        });
      }
    });
    return records;
  }, [endFieldId, getCellValue, isEndDateTimeField, isStartDateTimeField, ignoreSearchRows, startFieldId]);

  const calendarRecords = useMemo(() => {
    const records: {
      id: string;
      title: string;
      startDate: Date | null;
      endDate: Date | null;
      startDisabled: boolean;
      endDisabled: boolean;
    }[] = [];

    visibleRows.forEach(({ recordId }) => {
      let startTime = getCellValue(recordId, startFieldId);
      let endTime = getCellValue(recordId, endFieldId);
      if (Array.isArray(startTime)) {
        startTime = startTime[0];
      }
      if (Array.isArray(endTime)) {
        endTime = endTime[0];
      }
      const startDate = startTime && isStartDateTimeField ? new Date(startTime) : null;
      const endDate = endTime && isEndDateTimeField ? new Date(endTime) : null;
      const isStartDateValid = startDate ? dayjs.tz(startDate).isValid() : true;
      const isEndDateValid = endTime ? dayjs.tz(endTime).isValid() : true;
      // Start time, end time must be legal and one of them must not be null
      if (isStartDateValid && isEndDateValid && (startDate || endTime)) {
        records.push({
          id: recordId,
          title: firstFieldId,
          startDate,
          endDate,
          startDisabled: isStartDisabled,
          endDisabled: isEndDisabled,
        });
      }
    });
    return records;
  }, [visibleRows, getCellValue, startFieldId, endFieldId, isStartDateTimeField, isEndDateTimeField, firstFieldId, isStartDisabled, isEndDisabled]);

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const recordHeight = useMemo(() => {
    if (isMobile) {
      return 24;
    }
    let height = 12;
    columns.forEach((column, cIdx) => {
      // First column height
      if (cIdx === 0) {
        height += DEFAULT_FIELD_HEIGHT;
      } else {
        height += 8;
        const field = fieldMap[column.fieldId]!;
        if (isColNameVisible) {
          height += DEFAULT_TITLE_HEIGHT + 4;
        }
        switch (field.type) {
          case FieldType.Member:
          case FieldType.Attachment:
          case FieldType.CreatedBy:
          case FieldType.LastModifiedBy:
            height += FieldTypeHeight.Member;
            break;
          case FieldType.Checkbox:
          case FieldType.Rating:
            height += FieldTypeHeight.Checkbox;
            break;
          default:
            height += DEFAULT_FIELD_HEIGHT;
        }
      }
    });
    return height;
  }, [columns, fieldMap, isColNameVisible, isMobile]);

  const onPanelSizeChange = (visible: boolean) => {
    const calendarStatusMap = getStorage(StorageName.CalendarStatusMap);
    let status: Partial<ICalendarViewStatus> = {};
    if (calendarStatusMap) {
      status = calendarStatusMap[`${spaceId}_${datasheetId}_${view.id}`] || {};
      if (settingPanelVisible) {
        dispatch(batchActions([StoreActions.toggleCalendarGrid(visible, datasheetId), StoreActions.toggleCalendarSettingPanel(false, datasheetId)]));
      } else {
        dispatch(StoreActions.toggleCalendarGrid(visible, datasheetId));
      }
    }
    setStorage(StorageName.CalendarStatusMap, {
      [`${spaceId}_${datasheetId}_${view.id}`]: {
        ...status,
        gridVisible: settingPanelVisible ? true : visible,
        settingPanelVisible: false,
      },
    });
    window.dispatchEvent(new Event('resize'));
  };

  const setRecord = (recordId: any, startTime: Date | null, endTime: Date | null) => {
    const data: ISetRecordOptions[] = [];
    if (startFieldId && startField && isStartDateTimeField) {
      CacheManager.removeCellCache(datasheetId, startFieldId, recordId);
      data.push({
        recordId,
        fieldId: startFieldId,
        value: startTime ? dayjs.tz(startTime).valueOf() : null,
      });
    }
    if (endFieldId && endField && isEndDateTimeField) {
      CacheManager.removeCellCache(datasheetId, endFieldId, recordId);
      data.push({
        recordId,
        fieldId: endFieldId,
        value: endTime ? dayjs.tz(endTime).valueOf() : null,
      });
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data,
    });
  };

  const defaultDate = useMemo(() => {
    const searchStartDatetime = currentSearchRecordId && getCellValue(currentSearchRecordId, startFieldId);
    const searchEndDatetime = currentSearchRecordId && getCellValue(currentSearchRecordId, endFieldId);
    const searchDatetime = searchStartDatetime || searchEndDatetime;
    return searchDatetime ? new Date(searchDatetime) : undefined;
  }, [currentSearchRecordId, endFieldId, getCellValue, startFieldId]);

  useEffect(() => {
    setTimeout(() => {
      const taskElm = document.querySelector(`#calendar_task_${currentSearchRecordId}`);
      taskElm?.scrollIntoView({ block: 'nearest' });
    }, 0);
  }, [currentSearchRecordId]);

  const [date, setDate] = useState<dayjs.Dayjs | null>(() => {
    return dayjs.tz(new Date());
  });

  let panelRight = <React.Fragment />;
  let size = 0;
  if (!isMobile) {
    if (settingPanelVisible) {
      panelRight = <CalendarSettingPanel calendarStyle={calendarStyle} />;
      size = settingPanelWidth;
    } else if (gridVisible) {
      panelRight = <RecordList setRecord={setRecord} records={listRecords} disabled={!editable} />;
      size = gridWidth;
    }
  }

  return (
    <CalendarContext.Provider
      value={{
        currentSearchRecordId,
        fieldMap,
        columns,
        snapshot,
        calendarStyle,
        view,
        calendarViewStatus,
        firstFieldId,
        isStartDateTimeField,
        isEndDateTimeField,
        isSearching,
        datasheetId,
        permissions,
        getCellValue,
        draggable,
        isCryptoStartField,
        isCryptoEndField,
        isMobile,
        onCloseGrid: () => onPanelSizeChange(false),
        keyword,
        setKeyword,
        tasks: calendarRecords as any,
        activeCell,
      }}
    >
      <div className={styles.calendarView}>
        <RecordMenu
          hideInsert
          menuId={CALENDAR_RECORD_MENU}
          extraData={
            editable && !(isStartDisabled || isEndDisabled)
              ? [
                {
                  icon: <ClearOutlined color={colors.thirdLevelText} />,
                  text: t(Strings.clear_date),
                  onClick: (props: { recordId: string }) => setRecord(props.recordId, null, null),
                },
              ]
              : undefined
          }
        />
        <VikaSplitPanel
          primary="second"
          split="vertical"
          style={{ overflow: 'none' }}
          size={size}
          allowResize={false}
          panelLeft={
            <div className={styles.left}>
              {!isMobile && (
                <div
                  className={classNames(styles.toggleBtn, {
                    [styles.active!]: gridVisible,
                  })}
                  onClick={() => onPanelSizeChange(!gridVisible)}
                >
                  <Button size="small" prefixIcon={<ListOutlined size={16} color={colors.fc3} />}>
                    {t(Strings.calendar_list_toggle_btn)}
                  </Button>
                </div>
              )}
              <Calendar
                key={viewId}
                resizable={startFieldId !== endFieldId && !isMobile}
                defaultDate={defaultDate || date?.toDate()}
                disabled={!editable || (isStartDisabled && isEndDisabled)}
                monthPicker={(showValue: string) => <CalendarMonthPicker showValue={showValue} setDate={setDate} />}
                listStyle={{
                  // color: listColor || undefined,
                  height: recordHeight + 'px',
                }}
                rowMixCount={columns.length ? Math.max(Math.floor(3 / columns.length), 1) : 3}
                startListStyle={
                  listColor
                    ? {
                      borderLeft: `2px solid ${listColor}`,
                    }
                    : undefined
                }
                tasks={calendarRecords as any}
                dnd={[Drag, Drop]}
                update={setRecord}
                moreText={isMobile ? t(Strings.calendar_view_all_records_mobile) : t(Strings.calendar_view_all_records)}
                warnText={
                  <Tooltip content={t(Strings.calendar_error_record)}>
                    <span className="warning">
                      <WarnCircleFilled size={16} color={colors.warningColor} />
                    </span>
                  </Tooltip>
                }
                moveTaskId={activeCell?.recordId}
              />
            </div>
          }
          panelRight={panelRight}
        />
        {dateTypeAccessibleFields.length === 0 && <CreateFieldModal />}
        {isMobile && rowCreatable && ReactDOM.createPortal(<AddRecord size="large" />, document.getElementById(DATASHEET_ID.ADD_RECORD_BTN)!)}
      </div>
    </CalendarContext.Provider>
  );
};
