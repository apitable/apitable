import classnames from 'classnames';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DropdownSelect, IOption, Typography, useThemeColors } from '@apitable/components';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import urlcat from 'urlcat';
import { TextLabel } from 'pc/components/space_manage/space_info/components/credit_cost_card/components/text_label';
import { CardTitle } from 'pc/components/space_manage/space_info/ui';
import { GET_CREDIT_STATISTICS, SELECT_LIST, TimeDimension } from 'pc/components/space_manage/space_info/components/credit_cost_card/enum';
import { getCreditStatisticsFetcher } from 'pc/components/space_manage/space_info/components/credit_cost_card/utils/fetcher';
import { convertDate } from 'pc/components/space_manage/space_info/components/credit_cost_card/utils/convert_date';
import styles from './style.module.less';

interface ICreditCostCardProps {
  minHeight?: string | number;
  className?: string;
  title: string;
  titleTip: string;
}

export const CreditCostCard: React.FC<ICreditCostCardProps> = ({ minHeight, className, ...props }) => {
  const color = useThemeColors();
  const spaceId = useSelector((state) => state.space.activeId);
  const [timeDimension, setTimeDimension] = useState(TimeDimension.WEEKDAY);

  const { data } = useSWR(urlcat(GET_CREDIT_STATISTICS, { spaceId }) + `?timeDimension=${timeDimension}`, getCreditStatisticsFetcher);
  const onSelected = (option: IOption) => {
    setTimeDimension(option.value as TimeDimension);
  };

  const _data = convertDate(timeDimension, data);
  return (
    <div className={classnames(styles.card, 'vk-flex vk-flex-col vk-space-y-4 vk-p-4', className)} style={{ minHeight }}>
      <CardTitle
        {...props}
        rightSlot={
          <div className={'vk-flex vk-items-center vk-space-x-1'}>
            <Typography variant={'body3'} color={color.textCommonTertiary}>
              Time
            </Typography>
            <DropdownSelect triggerStyle={{ height: '24px' }} options={SELECT_LIST} onSelected={onSelected} value={timeDimension} />
          </div>
        }
      />
      <div style={{ height: 'calc(100% - 38px)' }}>
        {/*{!_data.length && (*/}
        {/*  <div className={'vk-absolute vk-end-0 vk-top-0 vk-flex vk-w-full vk-items-center vk-justify-center'}>*/}
        {/*    <Typography variant={'h7'}>暂无数据</Typography>*/}
        {/*  </div>*/}
        {/*)}*/}
        <ResponsiveContainer width="100%" height="100%" debounce={1000}>
          <LineChart
            width={500}
            height={300}
            data={_data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/*<XAxis dataKey="name" />*/}
            <XAxis
              dataKey="dateline"
              // tickFormatter={(timeStr) => {
              //   return dayjs(timeStr).format('YYYY-MM-DD');
              // }}
            />
            <YAxis domain={[0, 'dataMax + 5']} />
            <Tooltip
              labelStyle={{ color: color.textReverseDefault }}
              itemStyle={{ color: color.textReverseDefault }}
              contentStyle={{ background: color.bgReverseDefault }}
              // cursor={<CustomCursor/>}
              // viewBox={{ x:110, y: 111, width: 400, height: 400 }}
              labelFormatter={(str) => dayjs(str).format('YYYY-MM-DD')}
            />
            {/*<Legend />*/}
            <Line
              type="linear"
              dataKey="count"
              stroke={color.rainbowIndigo4}
              strokeWidth={3}
              // activeDot={{ r: 8 }}
              label={<TextLabel />}
              dot={{ stroke: color.rainbowIndigo4, strokeWidth: 1 }}
              activeDot={false}
            />
            {/*<Line type="linear" dataKey="uv" stroke="#82ca9d"/>*/}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
