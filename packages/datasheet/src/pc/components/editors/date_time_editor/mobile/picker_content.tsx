import { FC, useMemo } from 'react';
import * as React from 'react';
import { DateRange, getLanguage, IRecordAlarmClient, Strings, t, WithOptional } from '@vikadata/core';
import { NotificationSmallOutlined } from '@vikadata/icons';
import { DatePicker } from 'antd-mobile';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import en_US from 'antd-mobile/lib/date-picker/locale/en_US';
import style from './style.module.less';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useThemeColors } from '@vikadata/components';

interface IPickerContentProps {
  value: Date | undefined;
  mode: 'datetime' | 'date' | 'month';
  editable: boolean;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onChange: (val: Date) => void;
  onBackToNow?: () => void;
  onValueChange?: (val: Date) => void;
  onClear?: () => void;
  dateFormat: string;
  dateTimeFormat: string;
  alarm?: WithOptional<IRecordAlarmClient, 'id'>;
}

interface ICustomChildren {
  extra?: any;
  children?: React.ReactNode;
  onClick?(): void;
  value?: Date;
  arrowIcon?: JSX.Element | null;
}

export const CustomChildren: React.FC<ICustomChildren> = props => {
  const {
    onClick,
    extra,
    value,
    arrowIcon
  } = props;
  const colors = useThemeColors();

  return (
    <div
      className={classNames(
        style.pickerChildrenWrapper,
        'pickerChildrenWrapper'
      )}
      onClick={onClick}
    >
      <span
        style={{
          color: !value ? colors.fourthLevelText : 'inherit',
        }}
      >
        {extra}
      </span>
      {
        arrowIcon !== undefined ? arrowIcon : <IconArrow width={16} height={16} fill={colors.fourthLevelText} />
      }
    </div>
  );
};

const PickerContentBase: FC<IPickerContentProps> = (props) => {
  const colors = useThemeColors();
  const {
    value,
    mode,
    editable,
    visible,
    onVisibleChange,
    onChange,
    onBackToNow,
    onValueChange,
    onClear,
    dateFormat,
    dateTimeFormat,
    alarm,
  } = props;

  const alarmRealTime = useMemo(() => {
    let alarmDate = dayjs(value);
    const subtractMatch = alarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);

    if (subtractMatch) {
      alarmDate = alarmDate.subtract(Number(subtractMatch[1]), subtractMatch[2] as any);
    }
    return alarm?.time || alarmDate.format('HH:mm');
  }, [alarm?.subtract, alarm?.time, value]);

  const locale = {
    'zh-CN': zh_CN,
    'en-US': en_US
  }[getLanguage()];

  return (
    <div className={style.mobileDatePicker}>
      <DatePicker
        className={style.datePicker}
        locale={locale}
        minDate={new Date(DateRange.MinTimeStamp)}
        maxDate={new Date(DateRange.MaxTimeStamp)}
        mode={mode}
        value={value}
        visible={editable && visible}
        onVisibleChange={onVisibleChange}
        onValueChange={onValueChange}
        title={(
          <>
            {onBackToNow && <div
              className={style.backToNow}
              onClick={onBackToNow}
            >
              <span>{t(Strings.today)}</span>
            </div>}
            {Boolean(value) && onClear && (
              <div
                className={style.clear}
                onClick={onClear}
              >
                {t(Strings.clear)}
              </div>
            )}
          </>
        )}
        onChange={onChange}
        extra={mode == 'date' ? dateFormat.toLowerCase() : dateTimeFormat.toLocaleLowerCase()}
        format={value => dayjs(value).format(mode == 'date' ? dateFormat : dateTimeFormat)}
      >
        <CustomChildren value={value} arrowIcon={null} />
      </DatePicker>
      {Boolean(alarm) && (
        <div className={style.alarm}>
          <NotificationSmallOutlined color={colors.deepPurple[500]} size={14} />
          <span className={style.alarmTime}>
            {alarmRealTime}
          </span>
        </div>
      )}
    </div>
  );
};

export const PickerContent = React.memo(PickerContentBase);