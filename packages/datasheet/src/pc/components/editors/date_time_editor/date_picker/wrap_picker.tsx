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

import deDE from 'antd/es/date-picker/locale/de_DE';
import enUS from 'antd/es/date-picker/locale/en_US';
import esES from 'antd/es/date-picker/locale/es_ES';
import frFR from 'antd/es/date-picker/locale/fr_FR';
import itIT from 'antd/es/date-picker/locale/it_IT';
import jaJP from 'antd/es/date-picker/locale/ja_JP';
import koKR from 'antd/es/date-picker/locale/ko_KR';
import ruRU from 'antd/es/date-picker/locale/ru_RU';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import zhTW from 'antd/es/date-picker/locale/zh_TW';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import classNames from 'classnames';
import * as React from 'react';
import { getLanguage } from '@apitable/core';

export default function wrapPicker(Picker: React.ComponentClass<any>, defaultFormat?: string): any {
  return class PickerWrapper extends React.Component<any, any> {
    static defaultProps = {
      format: defaultFormat || 'YYYY-MM-DD',
      transitionName: 'slide-up',
      popupStyle: {},
      onChange() {
        //
      },
      onOk() {
        //
      },
      onOpenChange() {
        //
      },
      locale: {},
    };

    private picker: any;

    override componentDidMount() {
      const { autoFocus, disabled } = this.props;
      if (autoFocus && !disabled) {
        this.focus();
      }
    }

    handleOpenChange = (open: boolean) => {
      const { onOpenChange } = this.props;
      onOpenChange(open);
    };

    handleFocus = (e: React.FocusEventHandler<HTMLInputElement>) => {
      const { onFocus } = this.props;
      if (onFocus) {
        onFocus(e);
      }
    };

    handleBlur = (e: React.FocusEventHandler<HTMLInputElement>) => {
      const { onBlur } = this.props;
      if (onBlur) {
        onBlur(e);
      }
    };

    handleMouseEnter = (e: React.MouseEventHandler<HTMLInputElement>) => {
      const { onMouseEnter } = this.props;
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    };

    handleMouseLeave = (e: React.MouseEventHandler<HTMLInputElement>) => {
      const { onMouseLeave } = this.props;
      if (onMouseLeave) {
        onMouseLeave(e);
      }
    };

    focus() {
      this.picker.focus();
    }

    blur() {
      this.picker.blur();
    }

    savePicker = (node: any) => {
      this.picker = node;
    };

    getDefaultLocale = () => {
      const locale = {
        'zh-CN': zhCN,
        'en-US': enUS,
        'zh-HK': zhTW,
        'fr-FR': frFR,
        'de-DE': deDE,
        'it-IT': itIT,
        'ja-JP': jaJP,
        'ko-KR': koKR,
        'ru-RU': ruRU,
        'es-ES': esES,
      }[getLanguage()];
      const result = {
        ...locale,
        ...this.props.locale,
      };
      result.lang = {
        ...result.lang,
        ...(this.props.locale || {}).lang,
      };
      return result;
    };

    renderPicker = (locale: any, localeCode?: string) => {
      const props = this.props;
      const { prefixCls } = props;
      const pickerClass = classNames(`${prefixCls}-picker`, {
        [`${prefixCls}-picker-${props.size}`]: !!props.size,
      });
      const pickerInputClass = classNames(`${prefixCls}-picker-input`);

      return (
        <Picker
          {...props}
          ref={this.savePicker}
          pickerClass={pickerClass}
          pickerInputClass={pickerInputClass}
          locale={locale}
          localeCode={localeCode}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
      );
    };

    override render() {
      return (
        <LocaleReceiver componentName="DatePicker" defaultLocale={this.getDefaultLocale}>
          {this.renderPicker}
        </LocaleReceiver>
      );
    }
  };
}
