import * as React from 'react';
import classNames from 'classnames';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import enUS from 'antd/es/date-picker/locale/en_US';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
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

    componentDidMount() {
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
        'en-US': enUS
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

    render() {
      return (
        <LocaleReceiver
          componentName="DatePicker"
          defaultLocale={this.getDefaultLocale}
        >
          {this.renderPicker}
        </LocaleReceiver>
      );
    }
  };
}
