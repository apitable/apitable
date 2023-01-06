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

import { useThemeColors } from '@apitable/components';
import { DateRange, IRecordAlarmClient, Strings, t, WithOptional } from '@apitable/core';
import { NotificationSmallOutlined } from '@apitable/icons';
import { DatePicker } from 'antd-mobile';
import classNames from 'classnames';
import dayjs from 'dayjs';
import * as React from 'react';
import { FC, useMemo } from 'react';
import IconArrow from 'static/icon/common/common_icon_pulldown_line.svg';
import style from './style.module.less';

interface IPickerContentProps {
  value: Date | undefined;
  mode: 'minute' | 'day' | 'month';
  editable: boolean;
  visible: boolean;
  onChange: (val: Date) => void;
  onBackToNow?: () => void;
  onValueChange?: (val: Date) => void;
  onClear?: () => void;
  dateFormat: string;
  dateTimeFormat: string;
  alarm?: WithOptional<IRecordAlarmClient, 'id'>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
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
    children,
    value,
    arrowIcon,
  } = props;
  const colors = useThemeColors();

  return (
    <div
      className={classNames(
        style.pickerChildrenWrapper,
        'pickerChildrenWrapper',
      )}
      onClick={onClick}
    >
      <span
        style={{
          color: !value ? colors.fourthLevelText : 'inherit',
        }}
      >
        {children}
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
    onChange,
    onBackToNow,
    onValueChange,
    onClear,
    dateFormat,
    dateTimeFormat,
    alarm,
    setVisible,
  } = props;

  const alarmRealTime = useMemo(() => {
    let alarmDate = dayjs(value);
    const subtractMatch = alarm?.subtract?.match(/^([0-9]+)(\w{1,2})$/);

    if (subtractMatch) {
      alarmDate = alarmDate.subtract(Number(subtractMatch[1]), subtractMatch[2] as any);
    }
    return alarm?.time || alarmDate.format('HH:mm');
  }, [alarm?.subtract, alarm?.time, value]);

  const getDefaultValue = ()=>{
    if(value){
      return dayjs(value).format(mode == 'day' ? dateFormat : dateTimeFormat);
    }
    return mode == 'day' ? dateFormat.toLowerCase() : dateTimeFormat.toLocaleLowerCase();
  };

  return (
    <div className={style.mobileDatePicker}>
      <CustomChildren value={value} arrowIcon={null} onClick={() => {setVisible(true);}}>
        {getDefaultValue()}
      </CustomChildren>
      <DatePicker
        className={style.datePicker}
        min={new Date(DateRange.MinTimeStamp)}
        max={new Date(DateRange.MaxTimeStamp)}
        precision={mode}
        value={value}
        visible={editable && visible}
        onClose={() => {
          setVisible(false);
        }}
        confirmText={t(Strings.confirm)}
        cancelText={t(Strings.cancel)}
        title={(
          <>
            {onBackToNow && <div
              className={style.backToNow}
              onClick={() => {
                onBackToNow();
                setVisible(false);
              }}
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
        onConfirm={onChange}
        onSelect={onValueChange}
        forceRender
      />
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
