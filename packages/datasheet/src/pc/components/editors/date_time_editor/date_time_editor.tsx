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

import { Loading, lightColors } from '@apitable/components';
import {
  DATASHEET_ID,
  DateFormat, diffTimeZone,
  Field,
  getDay,
  getLanguage, getTimeZoneAbbrByUtc,
  getToday,
  IDateTimeField,
  IRecordAlarmClient,
  ITimestamp,
  notInTimestampRange,
  Selectors,
  str2time,
  str2timestamp,
  Strings,
  t,
  WithOptional,
} from '@apitable/core';
import { NotificationOutlined } from '@apitable/icons';
import { usePrevious } from 'ahooks';
import enUS from 'antd/es/date-picker/locale/en_US';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import classNames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { isEqual } from 'lodash';
import { Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display';
import { printableKey, stopPropagation } from 'pc/utils';
import { getEnvVariables } from 'pc/utils/env';
import { forwardRef, useEffect, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { isLegalDateKey } from '../../../utils/keycode';
import { IBaseEditorProps, IEditor } from '../interface';
import { DatePickerMobile } from './mobile';
import style from './style.module.less';
import { TimePicker } from './time_picker_only';
// @ts-ignore
import { DateTimeAlarm } from 'enterprise';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_FORMAT = 'YYYY-MM-DD';

const DatePicker = React.lazy(() => import('./date_picker'));

export interface IDateTimeEditorState {
  dateValue: string;
  displayDateStr: string;
  timeValue: string;
  dateOpen: boolean;
  timeOpen: boolean;
  point: string;
  isIllegal: boolean;
}

export interface IDateTimeEditorProps extends IBaseEditorProps {
  field: IDateTimeField;
  placeholder?: string;
  style: React.CSSProperties;
  editable: boolean;
  editing: boolean;
  commandFn?: (data: ITimestamp | null) => void;
  dataValue?: any;
  onClose?: (...val: any) => void;
  showAlarm?: boolean;
  recordId?: string;
  curAlarm?: WithOptional<IRecordAlarmClient, 'id'>;
  setCurAlarm?: (val?: WithOptional<IRecordAlarmClient, 'id'>) => void;
}

const DATE_COMPONENT_HEIGHT = 264;

export class DateTimeEditorBase extends React.PureComponent<IDateTimeEditorProps, IDateTimeEditorState> implements IEditor {
  editorDateRef: HTMLInputElement | null = null;
  dateDivRef!: HTMLElement;
  timestamp: number | null = null;
  shouldUseOriginTime = false;
  points = {
    top: ['bl', 'tl'],
    bottom: ['tl', 'bl'],
  };

  override state: IDateTimeEditorState = {
    dateValue: '',
    displayDateStr: this.props.dataValue ? dayjs(this.props.dataValue).format(Field.bindModel(this.props.field).dateFormat) : '',
    timeValue: '',
    dateOpen: false,
    timeOpen: false,
    point: 'bottom',
    isIllegal: false,
  };

  setValue(value?: ITimestamp | null) {
    if (value === undefined) {
      return;
    }
    this.setEditorValue(value);
  }

  saveValue() {
    this.setState({
      isIllegal: false,
    });
    this.onEndEdit(false, false);
  }

  setEditorValue(timestamp: ITimestamp | null) {
    if (timestamp == null) {
      this.setState({
        dateValue: '',
        displayDateStr: '',
        timeValue: '',
      });
      return;
    }
    const { dateFormat, timeZone } = Field.bindModel(this.props.field);
    const timeFormat = 'HH:mm';
    this.timestamp = timestamp;
    const dateTime = dayjs(timestamp);
    this.setState({
      dateValue: dateTime.format(DEFAULT_FORMAT),
      displayDateStr: dateTime.format(dateFormat),
      timeValue: timeZone ? dateTime.tz(timeZone).format(timeFormat) : dateTime.format(timeFormat),
    });
  }

  focus() {
    this.editorDateRef?.focus();
  }

  onDateValueChange = (date: dayjs.Dayjs | null, dateValue: string, displayDateStr: string, isSetTime?: boolean) => {
    const { timeValue, timeOpen } = this.state;
    const { timeZone } = Field.bindModel(this.props.field);
    if (date) {
      this.timestamp = date.valueOf();
    } else {
      this.shouldUseOriginTime = true;
    }
    const ignoreSetTime = isSetTime ? false : !timeOpen && !timeValue;

    let curTimeValue = timeValue;
    if (date && !ignoreSetTime) {
      if (timeZone) {
        curTimeValue = dayjs(date?.format('YYYY-MM-DD HH:mm')).tz(timeZone).format('HH:mm');
      } else {
        curTimeValue = date.format('HH:mm');
      }
    } else if (date === null) {
      curTimeValue = '';
    }

    if (timeZone && !curTimeValue) {
      curTimeValue = dayjs.tz(dayjs(), timeZone).format('HH:mm');
    }

    return this.setState({
      dateValue,
      displayDateStr,
      timeValue: curTimeValue,
    });
  };

  onPanelValueChange = () => {
    if (!this.state.timeValue) {
      this.setState({
        dateOpen: false,
        timeOpen: true,
      });
    }
    if (!this.props.showAlarm || !getEnvVariables().RECORD_TASK_REMINDER_VISIBLE) {
      this.setState({
        dateOpen: false,
      });
    }
  };

  override componentDidUpdate(cur: IDateTimeEditorProps) {
    if (this.props.editing !== cur.editing) {
      this.setState({
        isIllegal: false,
      });
      return;
    }
    if (cur.dataValue && dayjs(cur.dataValue).format(Field.bindModel(this.props.field).dateFormat) === this.state.displayDateStr) {
      return;
    }
    if (!cur.dataValue && !this.state.displayDateStr) {
      return;
    }
    this.props.commandFn?.(this.getValue() !== null ? getDay(new Date(this.getValue()!)).getTime() : null);
  }

  onTimeValueChange = (timeValue: string) => {
    this.setState(() => {
      const nextState = { timeValue } as IDateTimeEditorState;
      if (!this.state.dateValue) {
        const { dateFormat } = Field.bindModel(this.props.field);
        const dateTime = dayjs();
        this.timestamp = dateTime.valueOf();
        nextState.dateValue = dateTime.format(DEFAULT_FORMAT);
        nextState.displayDateStr = dateTime.format(dateFormat);
      }
      return nextState;
    });
  };

  format2StandardDate = (dateStr: string): ITimestamp | null => str2timestamp(dateStr);

  getInputValue() {
    const { field } = this.props;
    const { property } = field;
    const { dateValue } = this.state;
    let { timeValue } = this.state;
    const { timeFormat, timeZone } = Field.bindModel(this.props.field);
    if (!dateValue && !timeValue) {
      return null;
    }
    const { autoFill } = property;
    let dateTimestamp = new Date(getToday()).getTime();
    if (dateValue) {

      const timestamp = this.format2StandardDate(dateValue);
      if (timestamp == null || notInTimestampRange(timestamp)) {
        return null;
      }
      const datetime = dayjs(timestamp);
      /**
       * @description Automatic filling of dates with years
       * @type {boolean}
       */
      const isIncludesYear = dayjs(dateValue, ['Y-M-D', 'D/M/Y', 'YYYY']).isValid();

      if (datetime.year() === 2001 && !isIncludesYear) {
        dateTimestamp = datetime.year(dayjs().year()).valueOf();
      } else {
        dateTimestamp = timestamp;
      }

      if (autoFill && !timeValue) {
        timeValue = dayjs().format(timeFormat);
      }
    }
    const time = str2time(timeValue, field) || 0;
    return dateTimestamp + time + diffTimeZone(timeZone);
  }

  onEndEdit(cancel: boolean, clear = true) {
    this.timestamp = null;
    const { dateOpen, timeOpen } = this.state;
    if (dateOpen) {
      this.setState({
        dateOpen: false,
      });
    }
    if (timeOpen) {
      this.setState({
        timeOpen: false,
      });
    }
    if (!cancel) {
      this.setValueToRecord();
    }
    clear && this.setEditorValue(null);
    this.shouldUseOriginTime = false;
  }

  getValue(): ITimestamp | null {
    const { property } = this.props.field;
    if (!this.shouldUseOriginTime && this.timestamp && !property.includeTime && property.autoFill) {
      return this.timestamp;
    }
    return this.getInputValue();
  }

  setValueToRecord() {
    const value = this.getValue();
    if (!value) {
      this.setEditorValue(null);
    }
    this.props.onSave && this.props.onSave(value, this.props.curAlarm);
  }

  setPopupPosition() {
    if (this.dateDivRef.parentElement) {
      const parentElement = this.dateDivRef.parentElement;
      const parentRect = parentElement.getBoundingClientRect();
      const bottomHeight = window.innerHeight - parentRect.bottom;
      const topHeight = parentRect.top;
      if (bottomHeight > topHeight || bottomHeight > DATE_COMPONENT_HEIGHT || topHeight < DATE_COMPONENT_HEIGHT) {
        this.setState({
          point: 'bottom',
        });
      } else {
        this.setState({
          point: 'top',
        });
      }
    }
  }

  onStartEdit(value: ITimestamp | null) {
    if (!this.state.dateOpen) {
      this.setPopupPosition();
      this.setState({
        dateOpen: true,
      });
    }
    this.setValue(value);
  }

  setDateEditorRef = (ref: any) => {
    this.editorDateRef = ref;
  };

  getCalendarContainer = () => {
    return this.dateDivRef;
  };

  setDivRef = (ref: HTMLDivElement) => {
    this.dateDivRef = ref;
  };

  onDateOpenChange = (open: boolean) => {
    if (!this.props.editing) {
      return;
    }

    open && this.setPopupPosition();
    this.setState({
      dateOpen: open,
      timeOpen: false,
    });
  };

  onTimeOpenChange = (open: boolean) => {
    if (this.state.timeOpen !== open) {
      open && this.setPopupPosition();
      this.setState(pre => ({
        timeOpen: open,
        dateOpen: open ? false : pre.dateOpen,
      }));
    }
  };

  disabledDate = (select: dayjs.Dayjs) => {
    if (!select) {
      return false;
    }
    return notInTimestampRange(select.valueOf());
  };

  keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isPrintKey = printableKey(event.nativeEvent);
    const isLegalKey = isLegalDateKey(event.nativeEvent);
    if (isPrintKey && !isLegalKey) {
      event.preventDefault();
      this.setState({
        isIllegal: true,
      });
      return;
    }
    this.setState({
      isIllegal: false,
    });
  };

  override render() {
    const lang = {
      'zh-CN': zhCN,
      'en-US': enUS,
    }[getLanguage()];

    const locale = {
      ...lang.lang,
      previousYear: '',
      nextYear: '',
      previousMonth: '',
      nextMonth: '',
    };
    const { field, recordId, datasheetId } = this.props;
    const { dateFormat, timeFormat, includeTimeZone, timeZone } = Field.bindModel(field);

    const { timeValue, dateValue, displayDateStr, dateOpen, timeOpen, point, isIllegal } = this.state;
    const { editable, showAlarm } = this.props;

    let value;

    if (!this.shouldUseOriginTime && this.timestamp != null) {
      value = dayjs(this.timestamp);
    } else if (dateFormat) {
      const val = str2timestamp(dateValue);
      value = val ? dayjs(val) : dayjs();
    }
    // 'YYYY/MM/DD', dateInputSplitBySlash
    //   'YYYY-MM-DD',dateInputSplitByDash
    //   'DD/MM/YYYY', dateInputSplitBySlash
    //   'YYYY-MM', dateInputNoDayByDash
    //   'MM-DD', dateInputNoYearByDash
    //   'YYYY', dateInputYear
    //   'MM', dateInputMonth
    //   'DD', dateInputDay
    const dateInputFormatClassNameMap = {
      0: style.dateInputSplitBySlash,
      1: style.dateInputSplitByDash,
      2: style.dateInputSplitBySlash,
      3: style.dateInputNoDayByDash,

      4: style.dateInputNoYearByDash,
      5: style.dateInputYear,
      6: style.dateInputMonth,
      7: style.dateInputDay,
    };

    const dateInputClassName = classNames(dateInputFormatClassNameMap[field.property.dateFormat], {
      [style.only]: !field.property.includeTime,
    });

    let abbr = '';
    if (includeTimeZone) {
      const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      abbr = getTimeZoneAbbrByUtc(tz)!;
    }

    return (
      <div
        className={style.dateEditor}
        style={{
          ...this.props.style,
          maxWidth: this.props.editing ? '100%' : 0,
        }}
        ref={this.setDivRef}
        onMouseMove={stopPropagation}
        onClick={e => e.stopPropagation}
        onWheel={stopPropagation}
      >
        <Tooltip visible={isIllegal} getTooltipContainer={this.getCalendarContainer} title={t(Strings.date_cell_input_tips)} placement='top'>
          <div className={style.dateWrapper}>
            <div
              className={classNames(style.dateContent, {
                [style.limitDateWidth]: field.property.includeTime,
              })}
            >
              <React.Suspense fallback={<Loading />}>
                <DatePicker
                  ref={this.setDateEditorRef}
                  format={dateFormat}
                  locale={locale}
                  prefixCls='cp-calendar'
                  className={dateInputClassName}
                  placeholder={editable ? dateFormat.toLowerCase() : ''}
                  showDateInput={false}
                  readOnly={!editable}
                  open={editable && dateOpen}
                  getCalendarContainer={this.getCalendarContainer}
                  onOpenChange={this.onDateOpenChange}
                  align={{
                    offset: [-8, 31],
                  }}
                  inputDateValue={displayDateStr || ''}
                  onChange={this.onDateValueChange}
                  onPanelValueChange={this.onPanelValueChange}
                  value={value}
                  disabledDate={this.disabledDate}
                  disabled={Boolean(this.props.disabled)}
                  onKeyDown={this.keyDown}
                  renderFooter={() =>
                    showAlarm && getEnvVariables().RECORD_TASK_REMINDER_VISIBLE && DateTimeAlarm && (
                      <DateTimeAlarm
                        datasheetId={datasheetId}
                        recordId={recordId || ''}
                        fieldId={field.id}
                        includeTime={field.property.includeTime}
                        dateValue={dateValue}
                        timeValue={timeValue}
                        curAlarm={this.props.curAlarm}
                        handleDateTimeChange={(value: dayjs.Dayjs, isSetTime?: boolean) =>
                          this.onDateValueChange(value, value && value.format(DateFormat[1]), value && value.format(dateFormat), isSetTime)
                        }
                        handleDateAlarm={(curAlarm?: WithOptional<IRecordAlarmClient, 'id'>) => {
                          this.props.setCurAlarm?.(curAlarm);
                        }}
                      />
                    )
                  }
                />
              </React.Suspense>
              {field.property.includeTime && (
                <TimePicker
                  prefixCls='cp-time-picker'
                  className={style.timeInput}
                  placeholder={editable ? timeFormat.toLowerCase() : ''}
                  getPopupContainer={this.getCalendarContainer}
                  open={timeOpen}
                  align={{
                    points: this.points[point],
                    offset: [0, 0],
                  }}
                  inputReadOnly={!editable}
                  minuteStep={30}
                  onChange={this.onTimeValueChange}
                  onOpenChange={this.onTimeOpenChange}
                  value={timeValue}
                  timeZone={timeZone}
                />
              )}
              {abbr && (
                <span className={style.abbr}>({abbr})</span>
              )}
            </div>
            {showAlarm && getEnvVariables().RECORD_TASK_REMINDER_VISIBLE && Boolean(this.props.curAlarm) && (
              <span className={style.alarm}>
                <NotificationOutlined color={lightColors.deepPurple[500]} size={16} />
              </span>
            )}
          </div>
        </Tooltip>
      </div>
    );
  }
}

const DateTimeEditorHoc: React.ForwardRefRenderFunction<DateTimeEditorBase, IDateTimeEditorProps> = (props, ref) => {
  const snapshot = useSelector(Selectors.getSnapshot);
  const alarm = props.recordId ? Selectors.getDateTimeCellAlarmForClient(snapshot!, props.recordId, props.field.id) : undefined;
  const previousAlarm = usePrevious(alarm);
  const [curAlarm, setCurAlarm] = useState<WithOptional<IRecordAlarmClient, 'id'> | undefined>();

  useEffect(() => {
    if (isEqual(previousAlarm, alarm)) {
      return;
    }
    setCurAlarm(alarm);
  }, [alarm, previousAlarm]);

  useEffect(() => {
    const viewTabBar = document.getElementById(DATASHEET_ID.VIEW_TAB_BAR);
    if (viewTabBar) {
      viewTabBar.style.zIndex = '0';
    }
    return () => {
      if (viewTabBar) {
        viewTabBar.style.zIndex = '';
      }
    };
  }, []);

  return (
    <div style={{ flex: 1, width: '100%' }}>
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <DateTimeEditorBase {...props} ref={ref} curAlarm={curAlarm} setCurAlarm={setCurAlarm} />
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <DatePickerMobile {...props} curAlarm={curAlarm} ref={ref} />
      </ComponentDisplay>
    </div>
  );
};

export const DateTimeEditor = forwardRef(DateTimeEditorHoc);
