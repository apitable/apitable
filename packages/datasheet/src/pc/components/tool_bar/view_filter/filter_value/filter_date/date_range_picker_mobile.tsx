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

import { DatePicker } from 'antd-mobile';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, useThemeColors } from '@apitable/components';
import { DateRange, Strings, t } from '@apitable/core';
import { CustomChildren } from 'pc/components/editors/date_time_editor/mobile/picker_content';
import style from 'pc/components/editors/date_time_editor/mobile/style.module.less';
import { IFilterDateProps } from 'pc/components/tool_bar/view_filter/interface';
import styles from '../style.module.less';

export const DateRangePickerMobile: React.FC<
  React.PropsWithChildren<
    IFilterDateProps & {
      rangePickerChange: (date: (Dayjs | null)[] | null) => void;
      dataValue: number | [dayjs.Dayjs, dayjs.Dayjs] | null;
      disabled?: boolean;
    }
  >
> = (props) => {
  const colors = useThemeColors();
  const { rangePickerChange, dataValue, disabled } = props;
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const startDate = dataValue?.[0];
    if (!startDate) {
      return;
    }
    return new Date(startDate);
  });
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const endDate = dataValue?.[1];
    if (!endDate) {
      return;
    }
    return new Date(endDate);
  });

  useEffect(() => {
    if (!endDate || !startDate) {
      return;
    }
    rangePickerChange([dayjs.tz(startDate), dayjs.tz(endDate)]);
    // eslint-disable-next-line
  }, [endDate, startDate]);

  const startDateChange = (date: React.SetStateAction<Date | undefined>) => {
    setStartDate(date);
    if (!endDate) {
      setEndVisible(true);
    }
  };

  const endDateChange = (date: React.SetStateAction<Date | undefined>) => {
    setEndDate(date);
    if (!startDate) {
      setStartVisible(true);
    }
  };

  const onClose = () => {
    setStartVisible(false);
    setEndVisible(false);
    if (!startDate || !endDate) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  return (
    <div className={styles.mobileRangePicker}>
      <div>
        <CustomChildren value={startDate} arrowIcon={null} disabled={disabled} onClick={() => !disabled && setStartVisible(true)}>
          {startDate ? dayjs.tz(startDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'}
        </CustomChildren>
        <DatePicker
          className={style.datePicker}
          min={new Date(DateRange.MinTimeStamp)}
          max={endDate || new Date(DateRange.MaxTimeStamp)}
          precision={'day'}
          value={startDate}
          visible={startVisible}
          onCancel={onClose}
          onConfirm={(value: Date) => {
            setStartVisible(false);
            startDateChange(value);
          }}
          title={<Typography style={{ color: colors.firstLevelText }}>{t(Strings.select_start_date)}</Typography>}
        />
      </div>
      <div style={{ color: colors.thirdLevelText }}> -</div>
      <div>
        <CustomChildren value={endDate} arrowIcon={null} disabled={disabled} onClick={() => !disabled && setEndVisible(true)}>
          {endDate ? dayjs.tz(endDate).format('YYYY-MM-DD') : 'YYYY-MM-DD'}
        </CustomChildren>
        <DatePicker
          className={style.datePicker}
          min={startDate || new Date(DateRange.MinTimeStamp)}
          max={new Date(DateRange.MaxTimeStamp)}
          precision={'day'}
          value={endDate}
          visible={endVisible}
          onCancel={onClose}
          onConfirm={(value: Date) => {
            setEndVisible(false);
            endDateChange(value);
          }}
          title={<Typography style={{ color: colors.primaryColor }}>{t(Strings.select_end_date)}</Typography>}
        />
      </div>
    </div>
  );
};
