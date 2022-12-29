import React, { FC, useEffect, useMemo, useState } from 'react';
import { getPanelData, formatDate, date2Month } from './utils';
import { Button } from '../button';
import { IconButton } from '../icon_button';
import { Tooltip } from '../tooltip';
import { Month } from './month';
import { CalendarDiv, WeekDiv, HeaderDiv, HeaderLeftDiv } from './styled';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@apitable/icons';
import { ICalendar } from './interface';
import differenceInMonths from 'date-fns/differenceInMonths';
import { WEEKS, TODAY, MONTH_TOGGLE, TOUCH_TIP, FORMAT_MONTH } from './constants';
import classNames from 'classnames';
import { configResponsive, useResponsive } from 'ahooks';
import { useTouch, Direction } from '../../hooks/use-touch';
import format from 'date-fns/format';

export const Calendar:FC<ICalendar> = props => {
  const { lang = 'zh', defaultDate, monthPicker, ...rest } = props;
  configResponsive({
    middle: 768,
  });
  const responsive = useResponsive();
  const isMobile = !responsive.middle;
  const [step, setStep] = useState(0);
  const defaultDate2Month = defaultDate && format(defaultDate, FORMAT_MONTH);
  // Update of annual and monthly changes
  useEffect(() => {
    if (defaultDate2Month) {
      const currStep = differenceInMonths(date2Month(defaultDate), date2Month(new Date()));
      setStep(currStep);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate2Month]);
  const { year, month } = useMemo(() =>
    getPanelData(step),
  [step]
  );

  const touch = useTouch();
  const [isChangeMonth, setChangeMonth] = useState(false);

  const PreMonth = () => (
    <div className="btn-pre-month">
      <IconButton icon={ChevronLeftOutlined} onClick={() => setStep(step - 1)} />
    </div>
  );
  const NextMonth = () => (
    <div className="btn-next-month">
      <IconButton icon={ChevronRightOutlined} onClick={() => setStep(step + 1)} />
    </div>
  );

  return (
    <CalendarDiv className={classNames('calendar', { mobile: isMobile })}>
      <HeaderDiv className="calendar-header">
        <HeaderLeftDiv>
          {isMobile ? <PreMonth /> : <Tooltip content={MONTH_TOGGLE[lang].pre}>
            <PreMonth />
          </Tooltip>}
          {monthPicker ? monthPicker(formatDate(year, month, lang)) : <span className="date">{formatDate(year, month, lang)}</span>}
          {isMobile ? <NextMonth /> : <Tooltip content={MONTH_TOGGLE[lang].next}>
            <NextMonth />
          </Tooltip> }
        </HeaderLeftDiv>
        <Button disabled={step === 0} color="primary" size="small" onClick={() => setStep(0)}>
          {TODAY[lang]}
        </Button>
      </HeaderDiv>
      <div className="weeks">
        {WEEKS[lang].map((week, idx) => (
          <WeekDiv key={week} className={classNames({ wk: [5, 6].includes(idx) })}>{week}</WeekDiv>
        ))}
      </div>
      {isMobile ? (
        <div
          className="outer-months"
          onTouchStart={touch.start}
          onTouchMove={(e) => {
            const direction = touch.move(e);
            setChangeMonth(Boolean(direction));
          }}
          onTouchEnd={() => {
            const { direction } = touch;
            isChangeMonth && setChangeMonth(false);
            if (direction === Direction.Left) {
              setStep(step + 1);
            }
            if (direction === Direction.Right) {
              setStep(step - 1);
            }
            touch.end();
          }}
        >
          <Month lang={lang} step={step} isMobile={isMobile} {...rest} />
        </div>
      ) : <Month lang={lang} step={step} isMobile={isMobile} {...rest} />}
      {isChangeMonth && (
        <div className="change-month">
          {TOUCH_TIP[lang]}
        </div>
      )}
    </CalendarDiv>
  );
};
