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

import classNames from 'classnames';
import dayjs from 'dayjs';
import Trigger from 'rc-trigger';
import * as React from 'react';
import { ChangeEvent } from 'react';
import { KeyCode } from 'pc/utils';
import { Panel } from './panel';

// import './time_picker.less';

interface ITimePickerProps {
  prefixCls?: string;
  placeholder?: string;
  getPopupContainer?: (target: Element) => HTMLElement;
  align?: object;
  placement?: string;
  minuteStep: number;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (time: string) => void;
  onOpenChange?: (open: boolean) => void;

  disabled?: boolean;
  transitionName?: string;
  style?: object;
  inputReadOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  id?: string;
  value: string;

  name?: string;
  hourStep?: number;
  secondStep?: number;
  open?: boolean;
  timeZone?: string;
}

interface ITimePickerState {
  open: boolean;
  value: string;
}

export class TimePicker extends React.Component<ITimePickerProps, ITimePickerState> {
  saveInputRef: any;

  static defaultProps: Partial<ITimePickerProps> = {
    prefixCls: 'cp-time-picker',
    inputReadOnly: false,
    style: {},
    className: '',
    id: '',
    align: {},
    placement: 'bottomLeft',
    placeholder: '',
    open: false,
  };

  constructor(props: ITimePickerProps) {
    super(props);
    const { value } = props;
    this.state = {
      open: false,
      value,
    };
  }

  override UNSAFE_componentWillReceiveProps(nextProps: ITimePickerProps) {
    if (nextProps.hasOwnProperty('open') && nextProps.open !== this.props.open) {
      this.setOpen(nextProps.open || false);
    }
    if (nextProps.hasOwnProperty('value') && nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  setOpen(open: boolean) {
    if (this.props.inputReadOnly || this.props.disabled) {
      return;
    }
    this.setState({ open });
    this.props.onOpenChange?.(open);
    if (open) {
      if (!this.state.value) {
        const date = this.props.timeZone ? dayjs.tz(dayjs.tz(), this.props.timeZone) : dayjs.tz();
        this.setValue(date.format('HH:mm'));
      }
      this.saveInputRef.focus();
    }
  }

  handleDoubleClick = () => {
    this.setOpen(true);
  };

  onVisibleChange = (open: boolean) => {
    this.setOpen(open);
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === KeyCode.Enter) {
      this.setOpen(false);
    } else if (e.keyCode !== KeyCode.Esc && !this.state.open) {
      this.setOpen(true);
    }
  };

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setValue(e.target.value);
  };

  onPanelChange = (value: string) => {
    this.setValue(value);
    this.setOpen(false);
    this.saveInputRef.focus();
  };

  setValue(value: string) {
    this.setState({
      value,
    });
    this.props.onChange(value);
  }

  getPanelElement() {
    const { prefixCls, minuteStep } = this.props;
    return (
      <Panel
        prefixCls={`${prefixCls}-panel`}
        value={this.state.value}
        onChange={this.onPanelChange}
        minuteStep={minuteStep}
        clickPanelOutside={() => {
          if (this.state.open) {
            this.setState({ open: false });
          }
        }}
      />
    );
  }

  override render() {
    const { props, state } = this;
    const {
      align,
      getPopupContainer,
      prefixCls,
      placeholder,
      className,
      disabled,
      transitionName,
      style,
      inputReadOnly,
      autoComplete,
      autoFocus,
      id,
    } = props;
    const { open, value } = state;
    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={`${prefixCls}-panel-column-1`}
        popup={this.getPanelElement()}
        popupAlign={align}
        action={disabled || inputReadOnly ? [] : ['click']}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={open}
        onPopupVisibleChange={this.onVisibleChange}
      >
        <span className={classNames(prefixCls, className)} style={style}>
          <input
            className={`${prefixCls}-input`}
            ref={(el: HTMLInputElement) => (this.saveInputRef = el)}
            type="text"
            placeholder={placeholder}
            name={props.name}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            disabled={disabled}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            readOnly={!!inputReadOnly}
            value={value}
            id={id}
            onDoubleClick={this.handleDoubleClick}
            onFocus={(e) => {
              e.stopPropagation();
            }}
          />
        </span>
      </Trigger>
    );
  }
}
