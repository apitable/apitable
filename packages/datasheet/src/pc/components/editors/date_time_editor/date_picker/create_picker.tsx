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

import getDataOrAriaProps from 'antd/es/_util/getDataOrAriaProps';
import classNames from 'classnames';
import dayjs from 'dayjs';
import omit from 'lodash/omit';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-hk';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/en-ca';

// @ts-ignore
import MonthCalendar from 'rc-calendar/es/MonthCalendar';
// @ts-ignore
import RcDatePicker from 'rc-calendar/es/Picker';
import * as React from 'react';
import { ChangeEvent } from 'react';
// @ts-ignore
import { polyfill } from 'react-lifecycles-compat';
import { DateFormat, getLanguage } from '@apitable/core';
import { stopPropagation } from 'pc/utils';
import styles from './style.module.less';

const lang = {
  'zh-CN': 'zh-cn',
  'zh-HK': 'zh-hk',
  'fr-FR': 'fr',
  'de-DE': 'de',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'ru-RU': 'ru',
  'es-ES': 'es',
  'en-US': 'en-ca',
}[getLanguage()];
moment.locale(lang);

export interface IPickerProps {
  value?: dayjs.Dayjs;
  open?: boolean;
  prefixCls: string;
}

export interface IPickerState {
  open: boolean;
  value: dayjs.Dayjs | null;
  showDate: dayjs.Dayjs | null;
}

export default function createPicker(TheCalendar: React.ComponentClass): any {
  class CalenderWrapper extends React.Component<any, IPickerState> {
    static defaultProps = {
      showToday: true,
    };

    static getDerivedStateFromProps(nextProps: IPickerProps, prevState: IPickerState) {
      const state: Partial<IPickerState> = {};
      let open: boolean = prevState.open;
      if (nextProps.hasOwnProperty('open')) {
        state.open = nextProps.open;
        open = nextProps.open || false;
      }
      if (nextProps.hasOwnProperty('value')) {
        state.value = nextProps.value;

        if (nextProps.value !== prevState.value || (!open && nextProps.value !== prevState.showDate)) {
          state.showDate = nextProps.value;
        }
      }
      return state;
    }

    private input: any;

    constructor(props: any) {
      super(props);
      const value = props.value;
      if (value && !dayjs.isDayjs(value)) {
        throw new Error(
          'The value/defaultValue of DatePicker or MonthPicker must be ' +
            'a dayjs object after `antd@2.0`, see: https://u.ant.design/date-picker-value',
        );
      }
      this.state = {
        value,
        showDate: value,
        open: false,
      };
    }

    handleChange = (value: dayjs.Dayjs | null) => {
      const props = this.props;
      if (!props.hasOwnProperty('value')) {
        this.setState({
          value,
          showDate: value,
        });
      }
      props.onChange(value, value && value.format(DateFormat[1]), value && value.format(props.format));
      props.onPanelValueChange?.();
    };

    handleCalendarChange = (value: dayjs.Dayjs) => {
      this.setState({ showDate: value });
    };

    handleOpenChange = () => {
      const { onOpenChange, open } = this.props;
      if (onOpenChange) {
        onOpenChange(!open);
      }
    };

    focus() {
      this.input.focus();
    }

    blur() {
      this.input.blur();
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
      this.props.onChange(null, event.target.value, event.target.value);
    };

    saveInput = (node: any) => {
      this.input = node;
    };

    noop = () => {
      return;
    };

    override render() {
      const { value, showDate, open } = this.state;
      const props = omit(this.props, ['onChange']);
      const { prefixCls, suffixIcon, locale, localeCode } = props;

      const placeholder = props.hasOwnProperty('placeholder') ? props.placeholder : locale.lang.placeholder;

      const disabledTime = props.showTime ? props.disabledTime : null;

      const calendarClassName = classNames({
        [`${prefixCls}-time`]: props.showTime,
        [`${prefixCls}-month`]: MonthCalendar === TheCalendar,
      });

      if (value && localeCode) {
        value.locale(localeCode);
      }

      let pickerProps: object = {};
      let calendarProps: any = {};
      if (props.showTime) {
        calendarProps = {
          // fix https://github.com/ant-design/ant-design/issues/1902
          onSelect: this.handleChange,
        };
      } else {
        pickerProps = {
          onChange: this.handleChange,
        };
      }
      if (props.hasOwnProperty('mode')) {
        calendarProps.mode = props.mode;
      }
      const hasFooter = props.hasOwnProperty('renderFooter');
      if (hasFooter) {
        calendarProps.renderFooter = props.renderFooter;
      }

      const inputIcon =
        suffixIcon &&
        (React.isValidElement<{ className?: string }>(suffixIcon) ? (
          React.cloneElement(suffixIcon, {
            className: classNames({
              [suffixIcon.props.className!]: suffixIcon.props.className,
              [`${prefixCls}-picker-icon`]: true,
            }),
          })
        ) : (
          <span className={`${prefixCls}-picker-icon`}>{suffixIcon}</span>
        ));

      // warning(
      //   !('onOK' in props),
      //   'DatePicker',
      //   'It should be `DatePicker[onOk]` or `MonthPicker[onOk]`, instead of `onOK`!',
      // );

      const calendar = (
        <TheCalendar
          {...calendarProps}
          disabledDate={props.disabledDate}
          disabledTime={disabledTime}
          locale={locale}
          defaultValue={dayjs.tz(value ? value : undefined)}
          dateInputPlaceholder={placeholder}
          prefixCls={prefixCls}
          className={classNames(calendarClassName, {
            [styles.withFooter]: hasFooter,
          })}
          format={props.format}
          showToday={props.showToday}
          onPanelChange={props.onPanelChange}
          onChange={this.handleCalendarChange}
          value={moment(showDate?.valueOf())}
          showDateInput={props.showDateInput}
        />
      );

      const dataOrAriaProps = getDataOrAriaProps(props);
      const input = () => (
        <div>
          <input
            type="text"
            ref={this.saveInput}
            readOnly={!!props.readOnly}
            value={props.inputDateValue}
            placeholder={placeholder}
            className={props.pickerInputClass}
            onChange={this.onChange}
            onClick={this.handleOpenChange}
            disabled={this.props.disabled}
            onKeyDown={this.props.onKeyDown}
            {...dataOrAriaProps}
          />
          {inputIcon}
        </div>
      );

      return (
        <span id={props.id} onFocus={() => this.focus()} className={classNames(props.className, props.pickerClass)} onMouseDown={stopPropagation}>
          <RcDatePicker
            {...props}
            {...pickerProps}
            locale={props.locale}
            calendar={calendar}
            value={value && value.isValid() && moment(value.toISOString())}
            prefixCls={`${prefixCls}-picker-container`}
            open={open}
            onOpenChange={this.noop}
          >
            {input}
          </RcDatePicker>
        </span>
      );
    }
  }

  polyfill(CalenderWrapper);
  return CalenderWrapper;
}
