import { useEffect, useState } from 'react';
import * as React from 'react';
import style from 'pc/components/editors/date_time_editor/mobile/style.module.less';
import zh_CN from 'antd-mobile/lib/date-picker/locale/zh_CN';
import { DateRange, Strings, t } from '@apitable/core';
import DatePicker from 'antd-mobile/lib/date-picker';
import { CustomChildren } from 'pc/components/editors/date_time_editor/mobile/picker_content';
import dayjs, { Dayjs } from 'dayjs';
import styles from '../style.module.less';
import { IFilterDateProps } from 'pc/components/tool_bar/view_filter/interface';
import { Typography, useThemeColors } from '@vikadata/components';

export const DateRangePickerMobile: React.FC<IFilterDateProps & {
  rangePickerChange(date: (Dayjs | null)[] | null);
  dataValue: number | [dayjs.Dayjs, dayjs.Dayjs] | null
}> = (props) => {
  const colors = useThemeColors();
  const { rangePickerChange, dataValue } = props;
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
    rangePickerChange([dayjs(startDate), dayjs(endDate)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate]);

  const startDateChange = (date) => {
    setStartDate(date);
    if (!endDate) {
      setEndVisible(true);
    }
  };

  const endDateChange = (date) => {
    setEndDate(date);
    if (!startDate) {
      setStartVisible(true);
    }
  };

  const onClose = () => {
    if (!startDate || !endDate) {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  return <div className={styles.mobileRangePicker}>
    <div>
      <DatePicker
        className={style.datePicker}
        locale={zh_CN}
        minDate={new Date(DateRange.MinTimeStamp)}
        maxDate={endDate || new Date(DateRange.MaxTimeStamp)}
        mode={'date'}
        value={startDate}
        visible={startVisible}
        onVisibleChange={(visible) => {
          setStartVisible(visible);
        }}
        onChange={startDateChange}
        onDismiss={onClose}
        onOk={() => {
          setStartVisible(false);
        }}
        extra={'YYYY-MM-DD'}
        format={value => {return dayjs(value).format('YYYY-MM-DD');}}
        title={
          <Typography style={{ color: colors.firstLevelText }}>
            {t(Strings.select_start_date)}
          </Typography>
        }
      >
        <CustomChildren value={startDate} arrowIcon={null} />
      </DatePicker>
    </div>
    <div style={{ color: colors.thirdLevelText }}> -</div>
    <div>
      <DatePicker
        className={style.datePicker}
        locale={zh_CN}
        minDate={startDate || new Date(DateRange.MinTimeStamp)}
        maxDate={new Date(DateRange.MaxTimeStamp)}
        mode={'date'}
        value={endDate}
        visible={endVisible}
        onVisibleChange={(visible) => {
          setEndVisible(visible);
        }}
        onChange={endDateChange}
        onDismiss={onClose}
        onOk={() => {
          setEndVisible(false);
        }}
        extra={'YYYY-MM-DD'}
        format={value => {return dayjs(value).format('YYYY-MM-DD');}}
        title={
          <Typography style={{ color: colors.primaryColor }}>
            {t(Strings.select_end_date)}
          </Typography>
        }
      >
        <CustomChildren value={endDate} arrowIcon={null} />
      </DatePicker>
    </div>
  </div>;
};

