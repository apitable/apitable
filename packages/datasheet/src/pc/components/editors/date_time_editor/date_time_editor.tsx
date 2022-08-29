import { Loading, lightColors } from '@vikadata/components';
import {
  DATASHEET_ID, DateFormat, Field, getDay, getLanguage, getToday, IDateTimeField, IRecordAlarmClient, ITimestamp, notInTimestampRange, Selectors,
  str2time, str2timestamp, Strings, t, WithOptional
} from '@vikadata/core';
import { NotificationSmallOutlined } from '@vikadata/icons';
import { usePrevious } from 'ahooks';
import enUS from 'antd/es/date-picker/locale/en_US';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import classNames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isEqual } from 'lodash';
import { Tooltip } from 'pc/components/common';
import { ComponentDisplay, ScreenSize } from 'pc/components/common/component_display/component_display';
import { printableKey, stopPropagation } from 'pc/utils';
import { forwardRef, useEffect, useState } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { isLegalDateKey } from '../../../utils/keycode';
import { IBaseEditorProps, IEditor } from '../interface';
import { DateTimeAlarm } from './date_time_alarm';
import { DatePickerMobile } from './mobile';
import style from './style.module.less';
import { TimePicker } from './time_picker_only';

dayjs.extend(customParseFormat);

const DEFAULT_FORMAT = 'YYYY-MM-DD';

const DatePicker = React.lazy(() => import('./date_picker'));

export interface IDateTimeEditorState {
  // 永远存储包含年月日的字符串信息
  dateValue: string;
  // 永远存储格式化后的日期信息
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

// 日期组件高度
const DATE_COMPONENT_HEIGHT = 264;

export class DateTimeEditorBase extends React.PureComponent<IDateTimeEditorProps, IDateTimeEditorState> implements IEditor {
  editorDateRef: HTMLInputElement | null = null;
  dateDivRef!: HTMLElement;
  timestamp: number | null = null;
  // 由于日期格式(12/01)的单元格中其实是储存了设置格式时的年份信息的，
  // 在第一次激活编辑的时候，需要读取原始 timestamp 来展示年份
  // 当用户编辑过日期之后，则年份更新为当前年份
  shouldUseOriginTime = false;
  points = {
    top: ['bl', 'tl'],
    bottom: ['tl', 'bl'],
  };

  state: IDateTimeEditorState = {
    dateValue: '',
    displayDateStr: '',
    timeValue: '',
    dateOpen: false,
    timeOpen: false,
    point: 'bottom',
    isIllegal: false,
  };

  // 给 parent 组件调用的回调
  setValue(value?: ITimestamp | null) {
    if (value === undefined) {
      return;
    }
    this.setEditorValue(value);
  }

  // 给 parent 组件调用的回调
  saveValue() {
    // fix isIllegal 为 true 时，展开卡片中的失焦操作不会自动将其重置为 false
    this.setState({
      isIllegal: false,
    });
    this.onEndEdit(false, false);
  }

  // 给 parent 组件调用的回调
  setEditorValue(timestamp: ITimestamp | null) {

    if (timestamp == null) {
      this.setState({
        dateValue: '',
        displayDateStr: '',
        timeValue: '',
      });
      return;
    }
    const { dateFormat } = Field.bindModel(this.props.field);
    const timeFormat = 'HH:mm';
    // 设定显示的初始值
    this.timestamp = timestamp;
    const dateTime = dayjs(timestamp);
    this.setState({
      dateValue: dateTime.format(DEFAULT_FORMAT),
      displayDateStr: dateTime.format(dateFormat),
      timeValue: dateTime.format(timeFormat),
    });
  }

  // 给 parent 组件调用的回调
  focus() {
    this.editorDateRef?.focus();
  }

  onDateValueChange = (date: dayjs.Dayjs | null, dateValue: string, displayDateStr: string, isSetTime?: boolean) => {
    const { timeValue, timeOpen } = this.state;
    if (date) {
      this.timestamp = date.valueOf();
    } else {
      this.shouldUseOriginTime = true;
    }
    // 不显示时间，且时间还未赋值时 ignoreSetTime 为 true
    const ignoreSetTime = isSetTime ? false : (!timeOpen && !timeValue);

    return this.setState({
      dateValue,
      displayDateStr,
      timeValue: date && !ignoreSetTime ? date.format('HH:mm') : (date === null ? '' : timeValue)
    });
  };

  onPanelValueChange = () => {
    if (!this.state.timeValue) {
      this.setState({
        dateOpen: false,
        timeOpen: true,
      });
    }
    if (!this.props.showAlarm) {
      this.setState({
        dateOpen: false,
      });
    }
  };

  componentDidUpdate(cur: IDateTimeEditorProps) {
    if (
      this.props.editing !== cur.editing
    ) {
      this.setState({
        isIllegal: false,
      });
      return;
    }
    if (
      cur.dataValue &&
      dayjs(cur.dataValue).format(Field.bindModel(this.props.field).dateFormat) === this.state.displayDateStr
    ) {
      return;
    }
    if (!cur.dataValue && !this.state.displayDateStr) {
      return;
    }
    // 筛选仅用精确到天
    this.props.commandFn?.(
      this.getValue() !== null ?
        getDay(new Date(this.getValue()!)).getTime()
        : null
    );
  }

  onTimeValueChange = (timeValue: string) => {
    this.setState(() => {
      const nextState = { timeValue } as IDateTimeEditorState;
      if (!this.state.dateValue) {
        const { dateFormat } = Field.bindModel(this.props.field);
        // 设定显示的初始值
        const dateTime = dayjs();
        this.timestamp = dateTime.valueOf();
        nextState.dateValue = dateTime.format(DEFAULT_FORMAT);
        nextState.displayDateStr = dateTime.format(dateFormat);
      }
      return nextState;
    });
  };

  format2StandardDate = (dateStr: string): ITimestamp | null => str2timestamp(dateStr);

  // 完成 2 件事情，一是对输入的日期字符串格式化处理，二是将时间与日期合并后返回
  getInputValue() {
    const { field } = this.props;
    const { property } = field;
    const { dateValue } = this.state;
    let { timeValue } = this.state;
    const { timeFormat } = Field.bindModel(this.props.field);
    if (!dateValue && !timeValue) {
      return null;
    }
    const { autoFill } = property;
    let dateTimestamp = new Date(getToday()).getTime();
    if (dateValue) {
      // 需要判断日期是否合法，如果合法的话自动补充timeValue的值，不合法置空

      const timestamp = this.format2StandardDate(dateValue);
      if (timestamp == null || notInTimestampRange(timestamp)) {
        return null;
      }
      const datetime = dayjs(timestamp);
      /**
       * @description 自动给日期填充年份
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
    return dateTimestamp + time;
  }

  // 给 parent 组件调用的回调
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
    // 确定组件弹出位置
    if (this.dateDivRef.parentElement) {
      const parentElement = this.dateDivRef.parentElement;
      const parentRect = parentElement.getBoundingClientRect();
      const bottomHeight = window.innerHeight - parentRect.bottom;
      const topHeight = parentRect.top;
      if (bottomHeight > topHeight || bottomHeight > DATE_COMPONENT_HEIGHT
        || topHeight < DATE_COMPONENT_HEIGHT) {
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

  // 给 parent 组件调用的回调
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

  render() {
    const lang = {
      'zh-CN': zhCN,
      'en-US': enUS
    }[getLanguage()];

    const locale = {
      ...lang.lang,
      previousYear: '',
      nextYear: '',
      previousMonth: '',
      nextMonth: '',
    };
    const { field, recordId, datasheetId } = this.props;
    const { dateFormat, timeFormat } = Field.bindModel(field);
    const { timeValue, dateValue, displayDateStr, dateOpen, timeOpen, point, isIllegal } = this.state;
    const { editable, showAlarm } = this.props;

    let value;

    // 首次展示时展示原有的值
    if (!this.shouldUseOriginTime && this.timestamp != null) {
      value = dayjs(this.timestamp);
    } else if (dateFormat) {
      // 输入的值则通过时间转换方式来得到
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

    return (
      <div
        className={style.dateEditor}
        style={{
          ...this.props.style,
          maxWidth: this.props.editing ? '100%' : 0
        }}
        ref={this.setDivRef}
        onMouseMove={stopPropagation}
        onClick={e => e.stopPropagation}
        onWheel={stopPropagation}
      >
        <Tooltip
          visible={isIllegal}
          getTooltipContainer={this.getCalendarContainer}
          title={t(Strings.date_cell_input_tips)}
          placement="top"
        >
          <div className={style.dateWrapper}>
            <div className={classNames(style.dateContent, {
              [style.limitDateWidth]: field.property.includeTime
            })}>
              <React.Suspense fallback={<Loading />}>
                <DatePicker
                  ref={this.setDateEditorRef}
                  format={dateFormat}
                  locale={locale}
                  prefixCls="cp-calendar"
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
                  // input 框的初始值
                  inputDateValue={displayDateStr || ''}
                  onChange={this.onDateValueChange}
                  onPanelValueChange={this.onPanelValueChange}
                  value={value}
                  disabledDate={this.disabledDate}
                  disabled={Boolean(this.props.disabled)}
                  onKeyDown={this.keyDown}
                  renderFooter={() => showAlarm && (
                    <DateTimeAlarm
                      datasheetId={datasheetId}
                      recordId={recordId || ''}
                      fieldId={field.id}
                      includeTime={field.property.includeTime}
                      dateValue={dateValue}
                      timeValue={timeValue}
                      curAlarm={this.props.curAlarm}
                      handleDateTimeChange={(value: dayjs.Dayjs, isSetTime?: boolean) =>
                        this.onDateValueChange(value, value && value.format(DateFormat[1]), (value && value.format(dateFormat)), isSetTime)
                      }
                      handleDateAlarm={(curAlarm?: WithOptional<IRecordAlarmClient, 'id'>) => {
                        this.props.setCurAlarm?.(curAlarm);
                      }}
                    />
                  )}
                />
              </React.Suspense>
              {field.property.includeTime &&
                <TimePicker
                  prefixCls="cp-time-picker"
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
                />
              }
            </div>
            {showAlarm && Boolean(this.props.curAlarm) && (
              <span className={style.alarm}>
                <NotificationSmallOutlined color={lightColors.deepPurple[500]} size={14} />
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
